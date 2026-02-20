"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  processLiftAnalysis,
  processMotionAnalysis,
} from "@/lib/lift-analysis-client";
import { MotionAnalysisResult } from "@/components/motion-analysis-result";
import type {
  LiftAnalysisProcessResponse,
  MotionAnalysisProcessResponse,
} from "@/types/lift-analysis";
import {
  MAX_FILE_BYTES,
  MAX_FILE_LABEL,
  MAX_DURATION_LIFT_SEC,
  ACCEPTED_FORMATS_LABEL,
} from "@/lib/video-limits";

type AnalysisType = "lift" | "motion";

type UploadState =
  | { status: "idle" }
  | { status: "selected"; videoUrl: string; fileName: string }
  | {
      status: "selecting-seed";
      videoUrl: string;
      videoElement: HTMLVideoElement;
    }
  | { status: "uploading"; progress: number }
  | { status: "processing" }
  | {
      status: "success";
      result: LiftAnalysisProcessResponse | MotionAnalysisProcessResponse;
    }
  | { status: "error"; message: string };

interface VideoAnalysisUploadProps {
  type: AnalysisType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function VideoAnalysisUpload({
  type,
  open,
  onOpenChange,
  onSuccess,
}: VideoAnalysisUploadProps) {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: "idle",
  });
  const uploadStateRef = useRef<UploadState>({ status: "idle" });

  // Keep ref in sync so callbacks always see the latest state without stale closures
  const setUploadStateSynced = useCallback((next: UploadState) => {
    uploadStateRef.current = next;
    setUploadState(next);
  }, []);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [seedPoint, setSeedPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const isLift = type === "lift";
  const title = isLift
    ? "Nova Análise de Levantamento"
    : "Nova Análise de Movimento";
  const description = isLift
    ? "Faça upload de um vídeo de perfil do levantamento. Será pedido para clicar no disco/peso."
    : "Faça upload de um vídeo do movimento. A análise de pose será feita automaticamente.";

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      console.log(`[VideoUpload] File selected:`, {
        name: file.name,
        type: file.type,
        sizeMB: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        sizeBytes: file.size,
        maxBytes: MAX_FILE_BYTES,
        tooBig: file.size > MAX_FILE_BYTES,
      });

      // Validate file type
      if (!file.type.startsWith("video/")) {
        console.warn(`[VideoUpload] Rejected — not a video type:`, file.type);
        setUploadStateSynced({
          status: "error",
          message: "Por favor selecione um ficheiro de vídeo válido",
        });
        return;
      }

      setSelectedFile(file);

      // Load metadata to check size + duration
      const videoUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.src = videoUrl;
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        const duration = video.duration;
        const tooBig = file.size > MAX_FILE_BYTES;
        const tooLong = duration > MAX_DURATION_LIFT_SEC;

        console.log(`[VideoUpload] Metadata loaded:`, {
          durationSec: duration.toFixed(2),
          maxDurationSec: MAX_DURATION_LIFT_SEC,
          tooLong,
          sizeMB: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          tooBig,
          needsTrim: tooBig || tooLong,
        });

        if (tooBig || tooLong) {
          console.warn(
            `[VideoUpload] Rejected — tooBig=${tooBig}, tooLong=${tooLong}`
          );
          URL.revokeObjectURL(videoUrl);
          setSelectedFile(null);
          const reasons: string[] = [];
          if (tooBig) reasons.push(`tamanho máximo: ${MAX_FILE_LABEL}`);
          if (tooLong)
            reasons.push(`duração máxima: ${MAX_DURATION_LIFT_SEC}s`);
          setUploadStateSynced({
            status: "error",
            message: `O vídeo é demasiado grande. ${reasons.join(", ")}. Grava um vídeo mais curto.`,
          });
          return;
        }

        if (isLift) {
          console.log(`[VideoUpload] → selecting-seed`);
          setUploadStateSynced({
            status: "selecting-seed",
            videoUrl,
            videoElement: video,
          });
        } else {
          console.log(`[VideoUpload] → selected (motion, ready to submit)`);
          setUploadStateSynced({
            status: "selected",
            videoUrl,
            fileName: file.name,
          });
        }
      };

      video.onerror = () => {
        console.warn(
          `[VideoUpload] Could not load video metadata — proceeding anyway`,
          {
            sizeMB: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            tooBig: file.size > MAX_FILE_BYTES,
          }
        );
        // Can't read metadata — if file is too big we can't let it through
        if (file.size > MAX_FILE_BYTES) {
          URL.revokeObjectURL(videoUrl);
          setUploadStateSynced({
            status: "error",
            message: `O vídeo é muito grande. Tamanho máximo: ${MAX_FILE_LABEL}`,
          });
          setSelectedFile(null);
          return;
        }
        if (isLift) {
          console.log(`[VideoUpload] onerror → selecting-seed (no metadata)`);
          setUploadStateSynced({
            status: "selecting-seed",
            videoUrl,
            videoElement: video,
          });
        } else {
          console.log(`[VideoUpload] onerror → selected (no metadata)`);
          setUploadStateSynced({
            status: "selected",
            videoUrl,
            fileName: file.name,
          });
        }
      };
    },
    [isLift]
  );

  const handleVideoClick = useCallback(
    (e: React.MouseEvent<HTMLVideoElement>) => {
      if (uploadState.status !== "selecting-seed") return;

      const video = e.currentTarget;
      const rect = video.getBoundingClientRect();

      // The video uses object-contain, so there may be black bars
      // (letterbox or pillarbox). We need to calculate the actual
      // rendered area of the video inside the element.
      const videoAspect = video.videoWidth / video.videoHeight;
      const elementAspect = rect.width / rect.height;

      let renderWidth: number;
      let renderHeight: number;
      let offsetX: number;
      let offsetY: number;

      if (videoAspect > elementAspect) {
        // Video is wider than element → pillarbox (black bars top/bottom)
        renderWidth = rect.width;
        renderHeight = rect.width / videoAspect;
        offsetX = 0;
        offsetY = (rect.height - renderHeight) / 2;
      } else {
        // Video is taller than element → letterbox (black bars left/right)
        renderHeight = rect.height;
        renderWidth = rect.height * videoAspect;
        offsetX = (rect.width - renderWidth) / 2;
        offsetY = 0;
      }

      // Click position relative to the element
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Click position relative to the actual video area (excluding black bars)
      const videoX = clickX - offsetX;
      const videoY = clickY - offsetY;

      // Ignore clicks on the black bars
      if (
        videoX < 0 ||
        videoX > renderWidth ||
        videoY < 0 ||
        videoY > renderHeight
      ) {
        console.log("[VideoUpload] Click on black bar — ignored");
        return;
      }

      // Convert to percentage (0–100) of the actual video
      const seedX = parseFloat(((videoX / renderWidth) * 100).toFixed(2));
      const seedY = parseFloat(((videoY / renderHeight) * 100).toFixed(2));

      console.log("[VideoUpload] Seed point selected:", {
        element: { width: rect.width, height: rect.height },
        videoNative: { width: video.videoWidth, height: video.videoHeight },
        rendered: {
          width: renderWidth,
          height: renderHeight,
          offsetX,
          offsetY,
        },
        clickInElement: { x: clickX, y: clickY },
        clickInVideo: { x: videoX, y: videoY },
        seedPercent: { x: seedX, y: seedY },
      });

      setSeedPoint({ x: seedX, y: seedY });
    },
    [uploadState]
  );

  const handleClose = useCallback(() => {
    // Abort any in-flight upload/processing
    if (
      uploadState.status === "uploading" ||
      uploadState.status === "processing"
    ) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    }

    // Cleanup object URLs
    if (uploadState.status === "selecting-seed") {
      URL.revokeObjectURL(uploadState.videoUrl);
    }
    if (uploadState.status === "selected") {
      URL.revokeObjectURL(uploadState.videoUrl);
    }

    setUploadStateSynced({ status: "idle" });
    setSelectedFile(null);
    setSeedPoint(null);
    onOpenChange(false);
  }, [uploadState, onOpenChange]);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) return;

    console.log(`[VideoUpload] Submit started:`, {
      type,
      fileName: selectedFile.name,
      fileType: selectedFile.type,
      fileSizeMB: (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB",
      fileSizeBytes: selectedFile.size,
      maxBytes: MAX_FILE_BYTES,
      tooBig: selectedFile.size > MAX_FILE_BYTES,
      seedPoint: isLift ? seedPoint : "n/a (motion)",
    });

    // Create a new AbortController for this submission
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      if (isLift) {
        if (!seedPoint) {
          setUploadStateSynced({
            status: "error",
            message: "Por favor clique no disco/peso no vídeo",
          });
          return;
        }

        setUploadStateSynced({ status: "uploading", progress: 0 });

        console.log(`[VideoUpload] Calling processLiftAnalysis…`, {
          seedX: seedPoint.x,
          seedY: seedPoint.y,
          showAngles: true,
          autoDetect: true,
        });

        const result = await processLiftAnalysis(
          {
            video: selectedFile,
            seedX: seedPoint.x,
            seedY: seedPoint.y,
            showAngles: true,
            autoDetect: true,
          },
          window.location.origin,
          (progress) => {
            const percent = Math.round(
              (progress.loaded / progress.total) * 100
            );
            if (percent >= 100) {
              console.log(
                `[VideoUpload] Upload complete — waiting for processing`
              );
              // Upload done — Railway is now processing; show spinner
              setUploadStateSynced({ status: "processing" });
            } else {
              setUploadStateSynced({ status: "uploading", progress: percent });
            }
          },
          controller.signal
        );

        console.log(`[VideoUpload] processLiftAnalysis success:`, {
          videoUrl: result.videoUrl,
        });

        // If aborted, don't continue
        if (controller.signal.aborted) return;

        // Save analysis to database
        setUploadStateSynced({ status: "processing" });

        const saveFormData = new FormData();
        saveFormData.append("localId", crypto.randomUUID());
        saveFormData.append("analysisData", JSON.stringify(result));
        // Use the video URL from processing result instead of re-uploading
        if (result.videoUrl) {
          saveFormData.append("videoUrl", result.videoUrl);
        }

        console.log(`[VideoUpload] Saving lift analysis to DB…`);
        const saveResponse = await fetch("/api/analyses/lift", {
          method: "POST",
          body: saveFormData,
          signal: controller.signal,
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json().catch(() => ({}));
          console.error(`[VideoUpload] Save lift failed:`, errorData);
          throw new Error(errorData.error || "Erro ao guardar análise");
        }

        console.log(`[VideoUpload] Lift analysis saved ✓`);

        // Use the B2 video URL from the save response so the result
        // viewer plays the stable B2 URL instead of the temporary Railway URL
        const saveData = await saveResponse.json().catch(() => ({}));
        const finalResult: LiftAnalysisProcessResponse = {
          ...result,
          videoUrl: saveData.videoUrl ?? result.videoUrl,
        };

        setUploadStateSynced({ status: "success", result: finalResult });
      } else {
        setUploadStateSynced({ status: "uploading", progress: 0 });

        console.log(`[VideoUpload] Calling processMotionAnalysis…`, {
          showAngles: true,
        });

        const result = await processMotionAnalysis(
          {
            video: selectedFile,
            showAngles: true,
          },
          window.location.origin,
          (progress) => {
            const percent = Math.round(
              (progress.loaded / progress.total) * 100
            );
            if (percent >= 100) {
              console.log(
                `[VideoUpload] Upload complete — waiting for processing`
              );
              // Upload done — Railway is now processing; show spinner
              setUploadStateSynced({ status: "processing" });
            } else {
              setUploadStateSynced({ status: "uploading", progress: percent });
            }
          },
          controller.signal
        );

        console.log(`[VideoUpload] processMotionAnalysis success:`, {
          videoUrl: result.videoUrl,
          framesProcessed: result.pose?.framesProcessed,
          detectionRate: result.pose?.detectionRate,
        });

        // If aborted, don't continue
        if (controller.signal.aborted) return;

        // Save analysis to database
        setUploadStateSynced({ status: "processing" });

        const saveFormData = new FormData();
        saveFormData.append("localId", crypto.randomUUID());
        saveFormData.append("analysisData", JSON.stringify(result));
        // Use the video URL from processing result instead of re-uploading
        if (result.videoUrl) {
          saveFormData.append("videoUrl", result.videoUrl);
        }

        console.log(`[VideoUpload] Saving motion analysis to DB…`);
        const saveResponse = await fetch("/api/analyses/motion", {
          method: "POST",
          body: saveFormData,
          signal: controller.signal,
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json().catch(() => ({}));
          console.error(`[VideoUpload] Save motion failed:`, errorData);
          throw new Error(errorData.error || "Erro ao guardar análise");
        }

        console.log(`[VideoUpload] Motion analysis saved ✓`);

        // Use the B2 video URL from the save response so the result
        // viewer plays the stable B2 URL instead of the temporary Railway URL
        const saveData = await saveResponse.json().catch(() => ({}));
        const finalResult: MotionAnalysisProcessResponse = {
          ...result,
          videoUrl: saveData.videoUrl ?? result.videoUrl,
        };

        setUploadStateSynced({ status: "success", result: finalResult });
      }

      // For both lift and motion, call onSuccess
      onSuccess?.();
    } catch (error) {
      // Ignore abort errors — user cancelled intentionally
      if (error instanceof Error && error.message === "Cancelled") return;
      if (error instanceof DOMException && error.name === "AbortError") return;

      console.error(`[VideoUpload] Submit error:`, error);
      setUploadStateSynced({
        status: "error",
        message:
          error instanceof Error ? error.message : "Erro ao processar vídeo",
      });
    } finally {
      abortControllerRef.current = null;
    }
  }, [selectedFile, seedPoint, isLift, onSuccess, handleClose]);

  const canSubmit =
    selectedFile &&
    uploadState.status !== "uploading" &&
    uploadState.status !== "processing" &&
    (uploadState.status === "selected" ||
      (isLift && uploadState.status === "selecting-seed" && !!seedPoint));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className={
          uploadState.status === "success"
            ? "max-h-[90vh] max-w-6xl overflow-y-auto"
            : "max-h-[90vh] max-w-2xl overflow-y-auto"
        }
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File selection */}
          {uploadState.status === "idle" && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 p-12 transition-colors hover:border-muted-foreground/40 hover:bg-muted/20"
              >
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium">Clique para selecionar vídeo</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {ACCEPTED_FORMATS_LABEL} · máx {MAX_FILE_LABEL} · máx{" "}
                    {MAX_DURATION_LIFT_SEC}s
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Motion analysis: video preview after file selected */}
          {uploadState.status === "selected" && (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-lg border bg-black">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src={uploadState.videoUrl}
                  className="max-h-64 w-full object-contain"
                  controls
                />
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm">
                <span className="truncate font-medium text-foreground">
                  {uploadState.fileName}
                </span>
                <button
                  className="ml-3 shrink-0 text-muted-foreground underline hover:text-foreground"
                  onClick={() => {
                    URL.revokeObjectURL(uploadState.videoUrl);
                    setUploadStateSynced({ status: "idle" });
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  Alterar
                </button>
              </div>
            </div>
          )}

          {/* Seed point selection (lift only) */}
          {uploadState.status === "selecting-seed" && (
            <div className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Clique no disco/peso</strong> no vídeo abaixo para
                  selecionar o ponto de referência para tracking.
                </AlertDescription>
              </Alert>

              <div className="relative overflow-hidden rounded-lg border bg-black">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  ref={videoRef}
                  src={uploadState.videoUrl}
                  onClick={handleVideoClick}
                  className="max-h-64 w-full cursor-crosshair object-contain"
                  controls={false}
                />
                {seedPoint &&
                  videoRef.current &&
                  (() => {
                    // Calculate the rendered video area to position the dot
                    // correctly over the actual video (ignoring black bars).
                    const vid = videoRef.current;
                    const el = vid.getBoundingClientRect();
                    const videoAspect = vid.videoWidth / vid.videoHeight;
                    const elementAspect = el.width / el.height;
                    let rw: number, rh: number, ox: number, oy: number;
                    if (videoAspect > elementAspect) {
                      rw = el.width;
                      rh = el.width / videoAspect;
                      ox = 0;
                      oy = (el.height - rh) / 2;
                    } else {
                      rh = el.height;
                      rw = el.height * videoAspect;
                      ox = (el.width - rw) / 2;
                      oy = 0;
                    }
                    const pxLeft = ox + (seedPoint.x / 100) * rw;
                    const pxTop = oy + (seedPoint.y / 100) * rh;
                    return (
                      <div
                        className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-lg"
                        style={{
                          left: `${(pxLeft / el.width) * 100}%`,
                          top: `${(pxTop / el.height) * 100}%`,
                        }}
                      />
                    );
                  })()}
              </div>

              {seedPoint && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Ponto selecionado: ({seedPoint.x}%, {seedPoint.y}%)
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Upload progress */}
          {uploadState.status === "uploading" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>A enviar vídeo...</span>
                <span className="font-medium">{uploadState.progress}%</span>
              </div>
              <Progress value={uploadState.progress} />
            </div>
          )}

          {/* Processing */}
          {uploadState.status === "processing" && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                A analisar o vídeo… pode demorar até 60 segundos.
              </p>
              <p className="text-xs text-muted-foreground/60">
                Não feches esta janela.
              </p>
            </div>
          )}

          {/* Success — show result viewer with video + 3D skeleton */}
          {uploadState.status === "success" && (
            <MotionAnalysisResult
              result={uploadState.result as MotionAnalysisProcessResponse}
              onClose={handleClose}
            />
          )}

          {/* Error */}
          {uploadState.status === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{uploadState.message}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            {uploadState.status !== "success" && (
              <Button
                variant={
                  uploadState.status === "uploading" ||
                  uploadState.status === "processing"
                    ? "destructive"
                    : "outline"
                }
                onClick={handleClose}
              >
                {uploadState.status === "uploading" ||
                uploadState.status === "processing" ? (
                  <>
                    <X className="mr-1.5 h-3.5 w-3.5" />
                    Cancelar
                  </>
                ) : (
                  "Cancelar"
                )}
              </Button>
            )}
            {uploadState.status === "success" && (
              <Button variant="outline" onClick={handleClose}>
                Fechar
              </Button>
            )}
            {canSubmit && (
              <Button onClick={handleSubmit}>Iniciar Análise</Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

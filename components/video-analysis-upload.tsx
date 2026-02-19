"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Loader2, AlertCircle, CheckCircle } from "lucide-react";
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
import type {
  LiftAnalysisProcessResponse,
  MotionAnalysisProcessResponse,
} from "@/types/lift-analysis";

type AnalysisType = "lift" | "motion";

type UploadState =
  | { status: "idle" }
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [seedPoint, setSeedPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

      // Validate file type
      if (!file.type.startsWith("video/")) {
        setUploadState({
          status: "error",
          message: "Por favor selecione um ficheiro de vídeo válido",
        });
        return;
      }

      // Validate file size (500MB max)
      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        setUploadState({
          status: "error",
          message: "O vídeo é muito grande. Tamanho máximo: 500 MB",
        });
        return;
      }

      setSelectedFile(file);

      if (isLift) {
        // For lift analysis, show video to select seed point
        const videoUrl = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.src = videoUrl;
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          setUploadState({
            status: "selecting-seed",
            videoUrl,
            videoElement: video,
          });
        };
      } else {
        // For motion analysis, upload directly
        setUploadState({ status: "idle" });
      }
    },
    [isLift]
  );

  const handleVideoClick = useCallback(
    (e: React.MouseEvent<HTMLVideoElement>) => {
      if (uploadState.status !== "selecting-seed") return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Convert to video coordinates
      const video = uploadState.videoElement;
      const scaleX = video.videoWidth / rect.width;
      const scaleY = video.videoHeight / rect.height;

      setSeedPoint({
        x: Math.round(x * scaleX),
        y: Math.round(y * scaleY),
      });
    },
    [uploadState]
  );

  const handleSubmit = useCallback(async () => {
    if (!selectedFile) return;

    try {
      if (isLift) {
        if (!seedPoint) {
          setUploadState({
            status: "error",
            message: "Por favor clique no disco/peso no vídeo",
          });
          return;
        }

        setUploadState({ status: "uploading", progress: 0 });

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
            setUploadState({ status: "uploading", progress: percent });
          }
        );

        // Save analysis to database
        setUploadState({ status: "processing" });

        const saveFormData = new FormData();
        saveFormData.append("video", selectedFile);
        saveFormData.append("localId", crypto.randomUUID());
        saveFormData.append("durationMs", String(result.duration_ms));
        saveFormData.append("fpsSample", String(result.fps_sample));
        saveFormData.append("seedPoint", JSON.stringify(result.seed_point));
        saveFormData.append("barPath", JSON.stringify(result.bar_path));
        saveFormData.append("metrics", JSON.stringify(result.metrics || {}));

        const saveResponse = await fetch("/api/analyses/lift", {
          method: "POST",
          body: saveFormData,
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json().catch(() => ({}));
          throw new Error(errorData.error || "Erro ao guardar análise");
        }

        setUploadState({ status: "success", result });
      } else {
        setUploadState({ status: "uploading", progress: 0 });

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
            setUploadState({ status: "uploading", progress: percent });
          }
        );

        // Save analysis to database
        setUploadState({ status: "processing" });

        const saveFormData = new FormData();
        saveFormData.append("video", selectedFile);
        saveFormData.append("localId", crypto.randomUUID());
        saveFormData.append("segment", JSON.stringify(result.segment));
        saveFormData.append("sampleFps", String(result.sample_fps));
        if (result.video_meta) {
          saveFormData.append("videoMeta", JSON.stringify(result.video_meta));
        }
        saveFormData.append("poseFrames", JSON.stringify(result.pose_frames));
        saveFormData.append("metrics", JSON.stringify(result.metrics || {}));

        const saveResponse = await fetch("/api/analyses/motion", {
          method: "POST",
          body: saveFormData,
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json().catch(() => ({}));
          throw new Error(errorData.error || "Erro ao guardar análise");
        }

        setUploadState({ status: "success", result });
      }

      // Call success callback after a delay
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 2000);
    } catch (error) {
      setUploadState({
        status: "error",
        message:
          error instanceof Error ? error.message : "Erro ao processar vídeo",
      });
    }
  }, [selectedFile, seedPoint, isLift, onSuccess, handleClose]);

  const handleClose = useCallback(() => {
    if (
      uploadState.status === "uploading" ||
      uploadState.status === "processing"
    ) {
      return; // Don't close while processing
    }

    // Cleanup
    if (uploadState.status === "selecting-seed") {
      URL.revokeObjectURL(uploadState.videoUrl);
    }

    setUploadState({ status: "idle" });
    setSelectedFile(null);
    setSeedPoint(null);
    onOpenChange(false);
  }, [uploadState, onOpenChange]);

  const canSubmit =
    selectedFile &&
    uploadState.status !== "uploading" &&
    uploadState.status !== "processing" &&
    (!isLift || (uploadState.status === "selecting-seed" && seedPoint));

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
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
                    MP4, MOV, AVI, MKV, WEBM (máx 500 MB, 120 seg)
                  </p>
                </div>
              </button>
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

              <div className="relative">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  ref={videoRef}
                  src={uploadState.videoUrl}
                  onClick={handleVideoClick}
                  className="w-full cursor-crosshair rounded-lg border"
                  controls={false}
                />
                {seedPoint && (
                  <div
                    className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primary shadow-lg"
                    style={{
                      left: `${(seedPoint.x / uploadState.videoElement.videoWidth) * 100}%`,
                      top: `${(seedPoint.y / uploadState.videoElement.videoHeight) * 100}%`,
                    }}
                  />
                )}
              </div>

              {seedPoint && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Ponto selecionado: ({seedPoint.x}, {seedPoint.y})
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
                A processar vídeo... Isto pode demorar alguns minutos.
              </p>
            </div>
          )}

          {/* Success */}
          {uploadState.status === "success" && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Análise concluída!</strong> O vídeo processado será
                adicionado à sua lista.
              </AlertDescription>
            </Alert>
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
              <Button variant="outline" onClick={handleClose}>
                {uploadState.status === "uploading" ||
                uploadState.status === "processing"
                  ? "A processar..."
                  : "Cancelar"}
              </Button>
            )}
            {canSubmit && (
              <Button onClick={handleSubmit}>
                {isLift && uploadState.status !== "selecting-seed"
                  ? "Selecionar Ponto"
                  : "Iniciar Análise"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

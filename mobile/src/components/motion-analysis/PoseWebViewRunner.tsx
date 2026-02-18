import React, { useRef, useCallback, useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { File as ExpoFile, Paths } from "expo-file-system";
import type { PoseFrame, PoseVideoMeta } from "@/src/types/motion-analysis";

/**
 * Inline HTML that loads TFJS + MoveNet inside the WebView.
 *
 * Instead of sending the video as a massive base64 data-URI (which causes OOM
 * on large files), we write this HTML to a local cache file and load the
 * WebView with `source={{ uri: … }}`.  That gives the page a `file://` origin
 * so it can load the video directly from a `file://` path.
 */
const POSE_ESTIMATOR_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>body{margin:0;padding:16px;background:#111;color:#eee;font-family:system-ui}
#status{font-size:14px;margin-bottom:8px}#progress{font-size:13px;color:#aaa}canvas,video{display:none}</style>
</head><body>
<div id="status">Loading model…</div><div id="progress"></div>
<video id="video" playsinline muted></video>
<canvas id="canvas"></canvas>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection@2.1.3/dist/pose-detection.min.js"><\/script>
<script>
var CONFIG={startMs:0,endMs:5000,sampleFps:8};
var videoFileUri=null;
var KP=['nose','left_eye','right_eye','left_ear','right_ear',
'left_shoulder','right_shoulder','left_elbow','right_elbow',
'left_wrist','right_wrist','left_hip','right_hip',
'left_knee','right_knee','left_ankle','right_ankle'];
var statusEl=document.getElementById('status');
var progressEl=document.getElementById('progress');
var videoEl=document.getElementById('video');
var canvasEl=document.getElementById('canvas');
var ctx=canvasEl.getContext('2d');
var detector=null;
var modelReady=false;
var videoReady=false;
function sendToRN(p){if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(JSON.stringify(p));}
function tryStart(){if(modelReady&&videoReady){processVideo().catch(function(err){sendToRN({type:'POSE_ERROR',error:String(err)});});}}
async function loadModel(){
statusEl.textContent='Loading TensorFlow.js…';await tf.ready();
statusEl.textContent='Loading MoveNet model…';
detector=await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet,
{modelType:poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,enableSmoothing:true});
statusEl.textContent='Model ready. Waiting for video…';modelReady=true;
sendToRN({type:'MODEL_READY'});tryStart();}
async function processVideo(){
var s=CONFIG.startMs,e=CONFIG.endMs,fps=CONFIG.sampleFps;
var dur=e-s,interval=1000/fps,total=Math.ceil(dur/interval)+1;
statusEl.textContent='Loading video…';
return new Promise(function(resolve,reject){
videoEl.src=videoFileUri;videoEl.preload='auto';
videoEl.onerror=function(){var err='Failed to load video: '+(videoEl.error?videoEl.error.message:'unknown');sendToRN({type:'POSE_ERROR',error:err});reject(new Error(err));};
videoEl.onloadedmetadata=async function(){
var vw=videoEl.videoWidth,vh=videoEl.videoHeight;
canvasEl.width=vw;canvasEl.height=vh;
statusEl.textContent='Analysing pose…';var frames=[];
for(var i=0;i<total;i++){
var tSeg=i*interval,absT=s+tSeg;if(absT>e)break;
videoEl.currentTime=absT/1000;
await new Promise(function(r){var fn=function(){videoEl.removeEventListener('seeked',fn);r();};videoEl.addEventListener('seeked',fn);});
ctx.drawImage(videoEl,0,0,vw,vh);
try{var poses=await detector.estimatePoses(canvasEl);
if(poses.length>0){var kps=poses[0].keypoints.map(function(kp,idx){
return{name:KP[idx]||kp.name||'kp_'+idx,x:kp.x/vw,y:kp.y/vh,score:kp.score||0};});
frames.push({t:Math.round(tSeg),keypoints:kps});}}catch(ex){}
var pct=Math.round((i+1)/total*100);
progressEl.textContent=pct+'% ('+(i+1)+'/'+total+')';
sendToRN({type:'POSE_PROGRESS',progress:pct,current:i+1,total:total});
await new Promise(function(r){setTimeout(r,10);});}
statusEl.textContent='Done! '+frames.length+' frames.';
sendToRN({type:'POSE_RESULT',data:{poseFrames:frames,meta:{videoWidth:vw,videoHeight:vh,sampleFps:fps,totalSamples:frames.length,segmentDurationMs:dur}}});
resolve();};});}
function handleMsg(ev){try{var m=JSON.parse(ev.data);
if(m.type==='START_ANALYSIS'){
CONFIG.startMs=m.config.startMs||0;CONFIG.endMs=m.config.endMs||5000;CONFIG.sampleFps=m.config.sampleFps||8;
videoFileUri=m.config.videoFileUri;videoReady=!!videoFileUri;
statusEl.textContent='Video URI received. Processing…';
tryStart();}
}catch(e){}}
document.addEventListener('message',handleMsg);window.addEventListener('message',handleMsg);
loadModel().catch(function(err){sendToRN({type:'POSE_ERROR',error:'Model load failed: '+String(err)});});
<\/script></body></html>`;

interface PoseWebViewRunnerProps {
  /**
   * File path to the video (file:// URI or absolute path).
   * The video is loaded directly by the WebView — no base64 encoding needed.
   */
  videoUri: string;
  /** Start of trimmed segment in ms */
  startMs: number;
  /** End of trimmed segment in ms */
  endMs: number;
  /** Desired sample FPS (default 12, max 15) */
  sampleFps?: number;
  /** Called when the model is loaded and ready */
  onModelReady?: () => void;
  /** Called periodically with progress 0–100 */
  onProgress?: (pct: number) => void;
  /** Called when analysis completes successfully */
  onResult: (poseFrames: PoseFrame[], videoMeta: PoseVideoMeta) => void;
  /** Called on error */
  onError: (message: string) => void;
}

export function PoseWebViewRunner({
  videoUri,
  startMs,
  endMs,
  sampleFps = 12,
  onModelReady,
  onProgress,
  onResult,
  onError,
}: PoseWebViewRunnerProps) {
  const webViewRef = useRef<WebView>(null);
  const [analysisStarted, setAnalysisStarted] = useState(false);
  const [htmlFileUri, setHtmlFileUri] = useState<string | null>(null);

  // Write the HTML to a local cache file so the WebView has a file:// origin
  // which can then load video files from file:// paths directly.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const htmlFile = new ExpoFile(Paths.cache, "pose-estimator.html");
        htmlFile.write(POSE_ESTIMATOR_HTML);
        if (!cancelled) {
          // On Android use the raw uri; strip "file://" prefix is not needed
          setHtmlFileUri(htmlFile.uri);
        }
      } catch (err) {
        console.error("Failed to write HTML file:", err);
        onError("Failed to prepare pose estimator: " + String(err));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [onError]);

  const startAnalysis = useCallback(() => {
    if (analysisStarted || !videoUri) return;
    setAnalysisStarted(true);

    // Ensure the video path is a file:// URI
    const fileUri = videoUri.startsWith("file://")
      ? videoUri
      : `file://${videoUri}`;

    const config = {
      videoFileUri: fileUri,
      startMs,
      endMs,
      sampleFps: Math.min(sampleFps, 15),
    };

    webViewRef.current?.postMessage(
      JSON.stringify({ type: "START_ANALYSIS", config })
    );
  }, [videoUri, startMs, endMs, sampleFps, analysisStarted]);

  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data) as {
          type: string;
          progress?: number;
          data?: {
            poseFrames: PoseFrame[];
            meta?: { videoWidth: number; videoHeight: number };
          };
          error?: string;
        };

        switch (msg.type) {
          case "MODEL_READY":
            onModelReady?.();
            startAnalysis();
            break;
          case "POSE_PROGRESS":
            onProgress?.(msg.progress ?? 0);
            break;
          case "POSE_RESULT": {
            const frames = msg.data?.poseFrames ?? [];
            const meta: PoseVideoMeta = {
              videoWidth: msg.data?.meta?.videoWidth ?? 0,
              videoHeight: msg.data?.meta?.videoHeight ?? 0,
            };
            onResult(frames, meta);
            break;
          }
          case "POSE_ERROR":
            onError(msg.error ?? "Unknown pose estimation error");
            break;
        }
      } catch {
        // ignore non-JSON messages
      }
    },
    [onModelReady, onProgress, onResult, onError, startAnalysis]
  );

  if (!htmlFileUri) return null;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: htmlFileUri }}
        originWhitelist={["*"]}
        allowFileAccess
        allowFileAccessFromFileURLs
        allowUniversalAccessFromFileURLs
        javaScriptEnabled
        mediaPlaybackRequiresUserAction={false}
        onMessage={handleMessage}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 1,
    height: 1,
    opacity: 0,
    position: "absolute",
    top: -100,
    left: -100,
  },
  webview: {
    width: 1,
    height: 1,
  },
});

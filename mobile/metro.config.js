// Learn more https://docs.expo.io/guides/customizing-metro
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
const fs = require("fs");
const http = require("http");
const url = require("url");
const { getDefaultConfig } = require("expo/metro-config");

// Read API URL from .env for the dev proxy
let API_TARGET = "http://192.168.1.206:3000";
try {
  const envFile = fs.readFileSync(path.resolve(__dirname, ".env"), "utf8");
  const match = envFile.match(/EXPO_PUBLIC_API_URL=(.+)/);
  if (match) API_TARGET = match[1].trim();
} catch {
  // fallback to default
}
const parsedTarget = url.parse(API_TARGET);

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Custom resolver for web platform compatibility
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Redirect .css imports to an empty stub so Metro doesn't choke
  // (needed because @rnmapbox/maps web entry imports mapbox-gl.css)
  if (moduleName.endsWith(".css")) {
    return {
      filePath: path.resolve(__dirname, "css-stub.js"),
      type: "sourceFile",
    };
  }

  // expo-secure-store is native-only; redirect to localStorage shim on web
  if (platform === "web" && moduleName === "expo-secure-store") {
    return {
      filePath: path.resolve(__dirname, "src/lib/secure-store-web.ts"),
      type: "sourceFile",
    };
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Proxy /api requests on web dev server to the real backend (avoids CORS)
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Proxy anything starting with /api to the backend
      if (req.url?.startsWith("/api")) {
        const targetUrl = new url.URL(req.url, API_TARGET);
        const proxyReq = http.request(
          targetUrl,
          {
            method: req.method,
            headers: { ...req.headers, host: parsedTarget.host },
          },
          (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
          }
        );
        proxyReq.on("error", (err) => {
          console.error("[proxy]", err.message);
          res.writeHead(502);
          res.end("Bad Gateway");
        });
        req.pipe(proxyReq, { end: true });
        return;
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;

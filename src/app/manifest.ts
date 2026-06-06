import type { MetadataRoute } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AI 30 天学习",
    short_name: "AI学习",
    description: "30 天完成 AI 应用开发入门",
    start_url: `${basePath || "/"}`,
    display: "standalone",
    background_color: "#f5f7f4",
    theme_color: "#2bbf9f",
    orientation: "portrait-primary",
    icons: [
      {
        src: `${basePath}/icons/icon-192.svg`,
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable"
      },
      {
        src: `${basePath}/icons/icon-512.svg`,
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}

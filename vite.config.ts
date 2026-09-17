import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

function githubPagesAssets() {
  return {
    name: "github-pages-assets",
    apply: "build" as const,

    transform(code: string, id: string) {
      if (
        id.includes("node_modules") ||
        !/\.(ts|tsx|js|jsx)$/.test(id)
      ) {
        return null;
      }

      const transformed = code
        .replaceAll('"/cards/', '"/eldritch-horror/cards/')
        .replaceAll('"/icons/', '"/eldritch-horror/icons/')
        .replaceAll('"/maps/', '"/eldritch-horror/maps/')
        .replaceAll('`/cards/', '`/eldritch-horror/cards/')
        .replaceAll('`/icons/', '`/eldritch-horror/icons/')
        .replaceAll('`/maps/', '`/eldritch-horror/maps/');

      if (transformed === code) {
        return null;
      }

      return {
        code: transformed,
        map: null,
      };
    },
  };
}

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/eldritch-horror/" : "/",

  plugins: [
    react(),
    tailwindcss(),
    githubPagesAssets(),
  ],
}));
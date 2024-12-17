import { defineConfig } from "tsup";

export default defineConfig([{
  entry: ["src/client/index.ts"],
  dts: true,
  sourcemap: true,
  minify: true,
  splitting: false,
  format: ["esm"],
  outDir: "dist/client",
},
{
  entry: ["src/server/index.ts"],
  dts: true,
  sourcemap: true,
  minify: true,
  splitting: false,
  format: ["esm"],
  outDir: "dist/server",
  target: "node18"
},
{
  entry: ["src/index.ts"],
  dts: true,
  sourcemap: true,
  minify: true,
  splitting: false,
  format: ["esm"],
  outDir: "dist"
}]);

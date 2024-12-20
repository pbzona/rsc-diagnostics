import { promises as fs } from 'node:fs';
import path from 'node:path';
import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["./src/lib/clientScripts.ts"],
    dts: true,
    sourcemap: true,
    minify: true,
    splitting: false,
    treeshake: false,
    format: ["cjs", "esm", "iife"],
    outDir: "dist/client",
    esbuildOptions(options) {
      options.conditions = ['import', 'module']
      options.platform = 'browser'
    },
    // async onSuccess() {
    //   const srcPath = path.resolve(__dirname, 'dist/client/clientScripts.js');
    //   const destPath = path.resolve(__dirname, 'src/generated/clientScripts.js');
    //   try {
    //     await fs.copyFile(srcPath, destPath);
    //     console.log(`Copied ${srcPath} to ${destPath}`);
    //   } catch (error) {
    //     console.error(`Error copying file: ${error}`);
    //   }

    //   return async () => {
    //     try {
    //       await fs.rm(destPath, { recursive: true, force: true });
    //       console.log(`Removed ${destPath}`);
    //     } catch (error) {
    //       console.error(`Error removing directory: ${error}`);
    //     }
    //   }
    // }
  },
]);

import { build } from 'esbuild'

export const bundleExtensionMain = async (input, outFile) => {
  await build({
    bundle: true,
    entryPoints: [input],
    external: ['electron', 'node:*'],
    format: 'esm',
    outfile: outFile,
    platform: 'browser',
    target: 'esnext',
  })
}

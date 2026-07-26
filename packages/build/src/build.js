import { packageExtension, bundleJs, replace } from '@lvce-editor/package-extension'
import fs, { readFileSync } from 'node:fs'
import path, { dirname, join } from 'node:path'
import { bundleExtensionMain } from './bundleExtensionMain.js'
import { root } from './root.js'

const extension = path.join(root, 'packages', 'extension')
const markdownPreviewWorker = path.join(root, 'packages', 'markdown-preview-worker')
const packageRoot = path.join(root, '.tmp', 'dist')

fs.rmSync(packageRoot, { recursive: true, force: true })
fs.rmSync(join(extension, 'dist'), { recursive: true, force: true })

fs.mkdirSync(packageRoot, { recursive: true })
fs.mkdirSync(path.join(extension, 'dist'))

const packageJson = JSON.parse(readFileSync(join(extension, 'package.json')).toString())
delete packageJson.xo
delete packageJson.jest
delete packageJson.prettier
delete packageJson.devDependencies

fs.writeFileSync(join(packageRoot, 'package.json'), JSON.stringify(packageJson, null, 2) + '\n')
fs.copyFileSync(join(root, 'README.md'), join(packageRoot, 'README.md'))
fs.copyFileSync(join(root, 'LICENSE'), join(packageRoot, 'LICENSE'))
fs.copyFileSync(join(extension, 'extension.json'), join(packageRoot, 'extension.json'))
fs.cpSync(join(extension, 'src'), join(packageRoot, 'src'), {
  recursive: true,
})
fs.cpSync(join(extension, 'media'), join(packageRoot, 'media'), {
  recursive: true,
})

fs.cpSync(join(markdownPreviewWorker, 'src'), join(packageRoot, 'markdown-preview-worker', 'src'), {
  recursive: true,
})

const markedSrcPath = join(root, 'node_modules', 'marked', 'lib', 'marked.esm.js')
const markedDistPath = join(packageRoot, 'third_party', 'marked.esm.js')

fs.mkdirSync(dirname(markedDistPath), { recursive: true })
fs.copyFileSync(markedSrcPath, markedDistPath)

const markedUrlPath = path.join(packageRoot, 'markdown-preview-worker', 'src', 'parts', 'MarkedUrl', 'MarkedUrl.ts')
await replace({
  path: markedUrlPath,
  occurrence: `export const markedUrl = new URL('../../../../../node_modules/marked/lib/marked.esm.js', import.meta.url).toString()`,
  replacement: `export const markedUrl = new URL('../../third_party/marked.esm.js', import.meta.url).toString()`,
})

await replace({
  path: join(packageRoot, 'extension.json'),
  occurrence: '../markdown-preview-worker/src/markdownPreviewWorkerMain.ts',
  replacement: 'markdown-preview-worker/dist/markdownPreviewWorkerMain.js',
})

await bundleJs(
  join(packageRoot, 'markdown-preview-worker', 'src', 'markdownPreviewWorkerMain.ts'),
  join(packageRoot, 'markdown-preview-worker', 'dist', 'markdownPreviewWorkerMain.js'),
)

await bundleExtensionMain(
  join(extension, 'src', 'markdownPreviewMain.ts'),
  join(extension, 'dist', 'markdownPreviewMain.js'),
)
fs.cpSync(join(extension, 'dist'), join(packageRoot, 'dist'), {
  recursive: true,
})

await packageExtension({
  highestCompression: true,
  inDir: packageRoot,
  outFile: join(root, 'extension.tar.br'),
})

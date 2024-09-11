import { packageExtension, bundleJs, replace } from '@lvce-editor/package-extension'
import fs, { readFileSync } from 'node:fs'
import path, { dirname, join } from 'node:path'
import { root } from './root.js'

const extension = path.join(root, 'packages', 'extension')
const mediaPreviewWorker = path.join(root, 'packages', 'markdown-preview-worker')

fs.rmSync(join(root, 'dist'), { recursive: true, force: true })

fs.mkdirSync(path.join(root, 'dist'))

const packageJson = JSON.parse(readFileSync(join(extension, 'package.json')).toString())
delete packageJson.xo
delete packageJson.jest
delete packageJson.prettier
delete packageJson.devDependencies

fs.writeFileSync(join(root, 'dist', 'package.json'), JSON.stringify(packageJson, null, 2) + '\n')
fs.copyFileSync(join(root, 'README.md'), join(root, 'dist', 'README.md'))
fs.copyFileSync(join(root, 'LICENSE'), join(root, 'dist', 'LICENSE'))
fs.copyFileSync(join(extension, 'extension.json'), join(root, 'dist', 'extension.json'))
fs.cpSync(join(extension, 'src'), join(root, 'dist', 'src'), {
  recursive: true,
})
fs.cpSync(join(extension, 'media'), join(root, 'dist', 'media'), {
  recursive: true,
})

fs.cpSync(join(mediaPreviewWorker, 'src'), join(root, 'dist', 'markdown-preview-worker', 'src'), {
  recursive: true,
})

const markedSrcPath = join(root, 'packages', 'markdown-preview-worker', 'node_modules', 'marked', 'lib', 'marked.esm.js')
const markedDistPath = join(root, 'dist', 'third_party', 'marked.esm.js')

fs.mkdirSync(dirname(markedDistPath), { recursive: true })
fs.copyFileSync(markedSrcPath, markedDistPath)

const workerUrlFilePath = path.join(root, 'dist', 'src', 'parts', 'MarkdownPreviewWorkerUrl', 'MarkdownPreviewWorkerUrl.ts')
await replace({
  path: workerUrlFilePath,
  occurrence: 'src/markdownPreviewWorkerMain.ts',
  replacement: 'dist/markdownPreviewWorkerMain.js',
})

const assetDirPath = path.join(root, 'dist', 'src', 'parts', 'AssetDir', 'AssetDir.ts')
await replace({
  path: assetDirPath,
  occurrence: '../../../../',
  replacement: '../',
})

await replace({
  path: join(root, 'dist', 'extension.json'),
  occurrence: 'src/markdownPreviewMain.ts',
  replacement: 'dist/markdownPreviewMain.js',
})

await bundleJs(
  join(root, 'dist', 'markdown-preview-worker', 'src', 'markdownPreviewWorkerMain.ts'),
  join(root, 'dist', 'markdown-preview-worker', 'dist', 'markdownPreviewWorkerMain.js'),
)

await bundleJs(join(root, 'dist', 'src', 'markdownPreviewMain.ts'), join(root, 'dist', 'dist', 'markdownPreviewMain.js'))

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})

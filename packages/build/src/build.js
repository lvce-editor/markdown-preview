import { packageExtension, bundleJs, replace } from '@lvce-editor/package-extension'
import fs, { readFileSync } from 'node:fs'
import path, { join } from 'node:path'
import { bundleExtensionMain } from './bundleExtensionMain.js'
import { root } from './root.js'

const extension = path.join(root, 'packages', 'extension')
const markdownPreviewWorker = path.join(root, 'packages', 'markdown-preview-worker')
const packageRoot = path.join(root, '.tmp', 'dist')

fs.rmSync(packageRoot, { recursive: true, force: true })
fs.rmSync(join(extension, 'dist'), { recursive: true, force: true })
fs.rmSync(join(markdownPreviewWorker, 'dist'), { recursive: true, force: true })

fs.mkdirSync(packageRoot, { recursive: true })
fs.mkdirSync(path.join(extension, 'dist'))
fs.mkdirSync(path.join(markdownPreviewWorker, 'dist'))

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

await replace({
  path: join(packageRoot, 'extension.json'),
  occurrence: '../markdown-preview-worker/dist/markdownPreviewWorkerMain.js',
  replacement: 'markdown-preview-worker/dist/markdownPreviewWorkerMain.js',
})

await bundleJs(
  join(markdownPreviewWorker, 'src', 'markdownPreviewWorkerMain.ts'),
  join(markdownPreviewWorker, 'dist', 'markdownPreviewWorkerMain.js'),
)

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

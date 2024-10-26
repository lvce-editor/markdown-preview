import * as GetOrCreateWorker from '../GetOrCreateWorker/GetOrCreateWorker.ts'
import * as LaunchMarkdownPreviewWorker from '../LaunchMarkdownPreviewWorker/LaunchMarkdownPreviewWorker.ts'

const { invoke } = GetOrCreateWorker.getOrCreateWorker(LaunchMarkdownPreviewWorker.launchMarkdownPreviewWorker)

export { invoke }

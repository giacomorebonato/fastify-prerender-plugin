import { fileURLToPath } from 'node:url'
import {
	isMainThread,
	parentPort,
	Worker,
	workerData,
} from 'node:worker_threads'
import { type LightpandaFetchOptions, lightpanda } from '@lightpanda/browser'

export async function requestFromBrowser(url: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const worker = new Worker(fileURLToPath(import.meta.url), {
			workerData: { url },
		})

		worker.on('message', resolve)
		worker.on('error', reject)
	})
}

if (!isMainThread) {
	const options: LightpandaFetchOptions = {
		dump: true,
		disableHostVerification: false,
	}

	lightpanda.fetch(workerData.url, options).then((response) => {
		parentPort?.postMessage(response.toString())
	})
}

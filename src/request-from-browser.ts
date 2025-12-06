import {
	isMainThread,
	parentPort,
	Worker,
	workerData,
} from 'node:worker_threads'
import { type LightpandaFetchOptions, lightpanda } from '@lightpanda/browser'

export async function requestFromBrowser(url: string): Promise<string> {
	return new Promise<string>((resolve, reject) => {
		const worker = new Worker(import.meta.filename, {
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

	const res = await lightpanda.fetch(workerData.url, options)

	parentPort?.postMessage(res.toString())
}

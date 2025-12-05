import { Worker } from 'node:worker_threads'

const workerCode = `
const { parentPort } = require('worker_threads');
const { execSync } = require('child_process');
const os = require('os');

const LIGHTPANDA_EXECUTABLE_PATH = process.env.LIGHTPANDA_EXECUTABLE_PATH;
const lightpandaPath = LIGHTPANDA_EXECUTABLE_PATH ?? \`\${os.homedir()}/.cache/lightpanda-node/lightpanda\`;

parentPort.on('message', ({ url }) => {
  try {
    const result = execSync(\`\${lightpandaPath} fetch --dump \${url}\`, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
    });
    parentPort.postMessage({ success: true, html: result });
  } catch (error) {
    parentPort.postMessage({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});
`

export async function requestFromBrowser(url: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const worker = new Worker(workerCode, { eval: true })

		const timeout = setTimeout(() => {
			worker.terminate()
			reject(new Error(`Lightpanda fetch timed out for ${url}`))
		}, 30000) // 30 second timeout

		worker.on(
			'message',
			(result: { success: boolean; html?: string; error?: string }) => {
				clearTimeout(timeout)
				worker.terminate()

				if (result.success && result.html) {
					resolve(result.html)
				} else {
					reject(new Error(result.error || 'Unknown error'))
				}
			},
		)

		worker.on('error', (error) => {
			clearTimeout(timeout)
			worker.terminate()
			reject(error)
		})

		worker.postMessage({ url })
	})
}

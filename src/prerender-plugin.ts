import Fs from 'node:fs'
import Path from 'node:path'
import { fastifyPlugin } from 'fastify-plugin'
import { isbot } from 'isbot'
import sanitize from 'sanitize-filename'
import tmp from 'tmp'
import { requestFromBrowser } from './request-from-browser.ts'

export const prerenderPlugin = fastifyPlugin<{
	urls: (string | RegExp)[]
	host: string
	port: number
	tmpPath?: string
}>(
	(app, options, done) => {
		const tmpobj = tmp.dirSync()

		app.addHook('onRequest', async (request, reply) => {
			const requestFromBot = isbot(request.headers['user-agent'])

			if (!requestFromBot || request.method !== 'GET') {
				return
			}

			request.log.info({ requestFromBot })

			let matches = false

			for (const url of options.urls) {
				if (typeof url === 'string') {
					if (url === request.url) {
						matches = true

						break
					}
				} else {
					if (url.test(request.url)) {
						matches = true

						break
					}
				}
			}

			if (!matches) {
				return
			}

			const url = `http://${options.host}:${options.port}${request.url}`
			const filepath = Path.join(
				options.tmpPath ?? tmpobj.name,
				sanitize(`${url}.html`),
			)

			if (Fs.existsSync(filepath)) {
				const fileStat = Fs.statSync(filepath)
				const fileAgeInMinutes =
					(Date.now() - fileStat.mtime.getTime()) / 1_000 / 60

				if (fileAgeInMinutes <= 5) {
					return reply
						.status(200)
						.type('text/html')
						.send(Fs.readFileSync(filepath))
				}
				Fs.rmSync(filepath)
			}

			request.log.info(`request-from-browser: ${url}`)

			const html: string =
				(await requestFromBrowser(url).catch((error) => {
					console.error(error)
				})) ?? ''

			try {
				Fs.writeFileSync(filepath, html)
			} catch (error) {
				request.log.error(`Couldn't write cache in ${filepath}`)
			}

			reply.status(200).type('text/html').send(html)
		})

		done()
	},
	{
		fastify: '^5.x',
		name: 'fastify-prerender',
	},
)

export default prerenderPlugin

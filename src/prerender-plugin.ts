import { fastifyPlugin } from 'fastify-plugin'
import { isbot } from 'isbot'
import { requestFromBrowser } from './request-from-browser.ts'

export const prerenderPlugin = fastifyPlugin<{ urls: (string | RegExp)[], host: string, port: number }>(
	(app, options, done) => {
		app.addHook('onRequest', async (request, reply) => {
			const requestFromBot = isbot(request.headers['user-agent'])

			if (!requestFromBot) {
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
			const html: string =
				(await requestFromBrowser(url).catch((error) => {
					console.error(error)
				})) ?? ''

			reply.status(200).type('text/html').send(html)
		})

		done()
	},
)

export default prerenderPlugin

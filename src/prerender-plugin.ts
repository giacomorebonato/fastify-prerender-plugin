import Crypto from 'node:crypto'
import Fs from 'node:fs'
import Path from 'node:path'
import { fastifyPlugin } from 'fastify-plugin'
import { isbot } from 'isbot'
import sanitize from 'sanitize-filename'
import tmp from 'tmp'
import { requestFromBrowser } from './request-from-browser.ts'

export const prerenderPlugin = fastifyPlugin<{
	urls: (string | RegExp)[]
	host?: string
	port: number
	tmpPath?: string
}>(
	(app, options, done) => {
		const tmpobj = tmp.dirSync()

		app.addHook('onRequest', async (request, reply) => {
			const userAgent = request.headers['user-agent'] ?? ''

			// Exclude Lightpanda from bot detection to prevent circular dependency
			if (userAgent.startsWith('Lightpanda/')) {
				return
			}

			const requestFromBot =
				isbot(userAgent) ||
				userAgent.toLowerCase().startsWith('facebookexternalhit') ||
				userAgent.toLowerCase().startsWith('whatsapp') ||
				userAgent.toLowerCase().startsWith('twitterbot')

			if (!requestFromBot || request.method !== 'GET') {
				return
			}

			request.log.info({ requestFromBot })

			let matches = false

			// Extract pathname from request URL (strip query parameters for string matching)
			const requestPathname = request.url.split('?')[0]

			for (const url of options.urls) {
				if (typeof url === 'string') {
					// For string URLs, match only the pathname (ignore query parameters)
					if (url === requestPathname) {
						matches = true

						break
					}
				} else {
					// For RegExp URLs, test against full request.url (including query parameters)
					if (url.test(request.url)) {
						matches = true

						break
					}
				}
			}

			if (!matches) {
				return
			}

			const url = `http://${options.host ?? 'localhost'}:${options.port}${request.url}`

			// Parse URL to handle query parameters separately
			const urlObj = new URL(url)
			const pathname = sanitize(urlObj.pathname.replace(/\//g, '_'))
			const queryString = urlObj.search

			// Create unique filename based on path and query parameters
			let filename = pathname || 'index'
			if (queryString) {
				const queryHash = Crypto.createHash('md5')
					.update(queryString)
					.digest('hex')
				filename = `${filename}_${queryHash}`
			}
			filename = `${filename}.html`

			const filepath = Path.join(options.tmpPath ?? tmpobj.name, filename)

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
			} catch (_error) {
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

// biome-ignore lint/style/noDefaultExport: it's handy to have
export default prerenderPlugin

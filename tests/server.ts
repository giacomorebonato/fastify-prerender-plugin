import { fastify } from 'fastify'
import { prerenderPlugin } from '../src/prerender-plugin.ts'

const app = fastify()

await app.register(prerenderPlugin, {
	urls: ['/'],
	host: 'localhost',
	port: 3_000,
})

app.get('/', (request, reply) => {
	reply.type('text/html').send(`
<html>
  <body>
    <div id="root"></div>
  </body>
  <script>
    const root = document.getElementById('root')

    root.textContent = 'Hello World'
  </script>
</html>
  `)
})

app.listen({ port: 3_000 })

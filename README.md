# fastify-prerender-plugin

Have you ever had a SPA that renders some pages that need to be crawled by Google, Facebook, etc... ?
This Fastify plugin detects when the request is made from a bot [using isbot](https://www.npmjs.com/package/isbot) and returns the HTML rendered by Puppeteer in that case.

## Requirements

1. install Chrome in a postinstall script
   `"postinstall": "pnpm dlx @puppeteer/browsers install chrome@stable"`
2. this plugin works best when Fastify serves the HTML page for the SPA

## Example

```typescript
import { fastify } from 'fastify'
import { prerenderPlugin } from '../src/prerender-plugin.ts'

const app = fastify()

await app.register(prerenderPlugin, {
  urls: [
    '/'
  ],
  host: 'localhost',
  port: 3_000
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
```
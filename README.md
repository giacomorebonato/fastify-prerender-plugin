# fastify-prerender-plugin

Have you ever had a SPA that renders some pages that need to be crawled by Google, Facebook, etc.? This Fastify plugin detects when the request is made from a bot [using isbot](https://www.npmjs.com/package/isbot) and returns the HTML rendered by Puppeteer in that case.

## Requirements

This plugin works best when Fastify serves the HTML page for the SPA.

## Installation

To install the plugin, run:

```sh
pnpm install fastify-prerender-plugin
```

## Usage

Here is an example of how to use the `prerenderPlugin` with Fastify:

```typescript
import { fastify } from 'fastify'
import { prerenderPlugin } from '../src/prerender-plugin.ts'

const app = fastify()

await app.register(prerenderPlugin, {
  urls: ['/'],
  host: 'localhost',
  port: 3000
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

app.listen({ port: 3000 })
```

## Configuration

The `prerenderPlugin` accepts the following options:

- `urls`: An array of strings or regular expressions representing the URLs to be prerendered.
- `host`: The host where the Fastify server is running.
- `port`: The port where the Fastify server is running.

## Scripts

The following scripts are available in the `package.json`:

- `build`: Builds the project using `pkgroll`.
- `postinstall`: Installs the stable version of Chrome using Puppeteer.
- `release`: Releases the project using `release-it`.
- `test`: Runs the tests using Playwright.
- `format`: Formats the code using Biome.

## License

This project is licensed under the MIT License.
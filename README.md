# fastify-prerender-plugin

[![npm version](https://img.shields.io/npm/v/fastify-prerender-plugin.svg)](https://www.npmjs.com/package/fastify-prerender-plugin)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **Fastify Prerender Plugin**: Effortlessly add SEO-friendly server-side rendering (SSR) to your Single Page Applications (SPAs) using Fastify and Lightpanda. Automatically detect bots (Google, Facebook, Twitter, etc.) and serve fully rendered HTML for improved search engine indexing and social sharing.

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [How It Works](#how-it-works)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)
- [Running with Lightpanda](#running-with-lightpanda)

---

## Features

- 🕸️ **SEO Optimization**: Serve prerendered HTML to search engine and social media bots for better indexing and previews.
- ⚡ **Fastify Integration**: Simple plugin for Fastify, the fast and low-overhead web framework.
- 🧠 **Bot Detection**: Uses [isbot](https://www.npmjs.com/package/isbot) to accurately detect crawlers and bots.
- 🎭 **Lightpanda Rendering**: Renders your SPA using [Lightpanda](https://lightpanda.io), a lightweight headless browser with minimal memory footprint for accurate, up-to-date HTML snapshots.
- 🔧 **Configurable**: Easily specify which URLs to prerender and server details.
- 🛡️ **Zero Impact**: Only prerenders for bots—regular users get the normal SPA experience.
- 💾 **Low Memory Footprint**: Lightpanda's efficient architecture keeps memory usage minimal compared to traditional headless browsers.

---

## Requirements

- Node.js (v22+ recommended)
- Fastify
- Lightpanda (installed automatically)

This plugin works best when Fastify serves the HTML page for your SPA.

---

## Installation

```sh
pnpm install fastify-prerender-plugin
```

---

## Usage

Add the `prerenderPlugin` to your Fastify server to enable SEO-friendly prerendering for bots:

```typescript
import { fastify } from 'fastify'
import { prerenderPlugin } from 'fastify-prerender-plugin'

const app = fastify()

await app.register(prerenderPlugin, {
  urls: ['/'], // URLs to prerender
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

---

## Configuration

The `prerenderPlugin` accepts the following options:

- `urls`: Array of strings or regular expressions for URLs to prerender (e.g., `['/', /^\/about/]`).
- `host`: Hostname where your Fastify server is running (e.g., `'localhost'`).
- `port`: Port number for your Fastify server (e.g., `3000`).

---

## How It Works

1. **Bot Detection**: On each request, the plugin checks the `User-Agent` header using [isbot](https://www.npmjs.com/package/isbot).
2. **Prerendering**: If the request is from a bot and matches a configured URL, Lightpanda launches to render the page with minimal memory usage.
3. **HTML Snapshot**: The fully rendered HTML is cached (5 minutes) and returned to the bot, ensuring proper SEO and social media previews.
4. **Normal Users**: All other requests receive the standard SPA HTML, with no performance impact.

---

## Scripts

The following scripts are available in the `package.json`:

- `build`: Builds the project using `pkgroll`.
- `release`: Releases the project using `release-it`.
- `test`: Runs the end-to-end tests using Playwright Test.
- `format`: Formats the code using Biome.

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to [open an issue](https://github.com/grebonato/fastify-prerender-plugin/issues) or submit a pull request.

---

## Support

If you have questions or need help, please open an issue on the [GitHub repository](https://github.com/grebonato/fastify-prerender-plugin).

---

## License

This project is licensed under the MIT License.

## Running with Lightpanda

This plugin uses [Lightpanda](https://lightpanda.io), a lightweight headless browser designed for server-side rendering with a minimal memory footprint. Lightpanda is automatically installed when you install the plugin via the `@lightpanda/browser` package.

### Why Lightpanda?

- **Low Memory Footprint**: Significantly lighter than traditional headless browsers like Chromium or Firefox
- **Fast Startup**: Quick initialization for on-demand prerendering
- **Designed for SSR**: Built specifically for server-side rendering use cases
- **Easy Installation**: No complex browser dependencies or large downloads

### Custom Lightpanda Executable Path

By default, Lightpanda is installed to `~/.cache/lightpanda-node/lightpanda`. If you need to use a custom executable path, set the `LIGHTPANDA_EXECUTABLE_PATH` environment variable:

```sh
export LIGHTPANDA_EXECUTABLE_PATH=/path/to/lightpanda
```

For more information about Lightpanda, visit [https://lightpanda.io](https://lightpanda.io).
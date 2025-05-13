# fastify-prerender-plugin

[![npm version](https://img.shields.io/npm/v/fastify-prerender-plugin.svg)](https://www.npmjs.com/package/fastify-prerender-plugin)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **Fastify Prerender Plugin**: Effortlessly add SEO-friendly server-side rendering (SSR) to your Single Page Applications (SPAs) using Fastify and Playwright. Automatically detect bots (Google, Facebook, Twitter, etc.) and serve fully rendered HTML for improved search engine indexing and social sharing.

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
- [Running Playwright in Docker](#running-playwright-in-docker)

---

## Features

- 🕸️ **SEO Optimization**: Serve prerendered HTML to search engine and social media bots for better indexing and previews.
- ⚡ **Fastify Integration**: Simple plugin for Fastify, the fast and low-overhead web framework.
- 🧠 **Bot Detection**: Uses [isbot](https://www.npmjs.com/package/isbot) to accurately detect crawlers and bots.
- 🎭 **Playwright Rendering**: Renders your SPA using Playwright for accurate, up-to-date HTML snapshots.
- 🔧 **Configurable**: Easily specify which URLs to prerender and server details.
- 🛡️ **Zero Impact**: Only prerenders for bots—regular users get the normal SPA experience.

---

## Requirements

- Node.js (v22+ recommended)
- Fastify
- Playwright (installed automatically)

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
2. **Prerendering**: If the request is from a bot and matches a configured URL, Playwright launches a headless browser to render the page.
3. **HTML Snapshot**: The fully rendered HTML is returned to the bot, ensuring proper SEO and social media previews.
4. **Normal Users**: All other requests receive the standard SPA HTML, with no performance impact.

---

## Scripts

The following scripts are available in the `package.json`:

- `build`: Builds the project using `pkgroll`.
- `postinstall`: Installs the stable version of Chrome using Playwright.
- `release`: Releases the project using `release-it`.
- `test`: Runs the tests using Playwright.
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

## Running Playwright in Docker

You can run Playwright scripts in a Docker environment using the official Playwright Docker images. This is useful for consistent, isolated browser environments in CI/CD or production.

### 1. Pull the Playwright Docker Image

```sh
docker pull mcr.microsoft.com/playwright:v1.52.0-noble
```

### 2. Run the Docker Container

For trusted code (e.g., end-to-end tests):

```sh
docker run -it --rm --ipc=host mcr.microsoft.com/playwright:v1.52.0-noble /bin/bash
```

For crawling or scraping untrusted websites, use a separate user and seccomp profile:

```sh
docker run -it --rm --ipc=host --user pwuser --security-opt seccomp=seccomp_profile.json mcr.microsoft.com/playwright:v1.52.0-noble /bin/bash
```

Where `seccomp_profile.json` is a Docker seccomp profile with extra user namespace cloning permissions. See the [Playwright Docker docs](https://playwright.dev/docs/docker) for details.

### 3. Recommended Docker Flags

- Use `--init` to avoid zombie processes.
- Use `--ipc=host` to prevent Chromium from running out of memory.
- If you see errors launching Chromium, try `--cap-add=SYS_ADMIN` (for local development only).

### 4. Version Matching

Ensure the Playwright version in your project matches the Docker image version to avoid browser executable issues.

For more details and advanced usage, see the [official Playwright Docker documentation](https://playwright.dev/docs/docker).
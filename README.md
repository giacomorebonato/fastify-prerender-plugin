# fastify-prerender-plugin

[![npm version](https://img.shields.io/npm/v/fastify-prerender-plugin.svg)](https://www.npmjs.com/package/fastify-prerender-plugin)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **Build your SPA. Get SEO for free.**
>
> Stop choosing between SPAs and SSR. This Fastify plugin automatically detects bots and serves them fully-rendered HTML—while your users get the fast SPA experience they deserve. No refactoring. No complexity. Just add one plugin.

## Why?

You want to ship fast SPAs. Google wants fully-rendered HTML. Traditional SSR means maintaining two codebases or dealing with complex frameworks.

**This plugin solves that.** Write your SPA once, and bots automatically get server-rendered snapshots using [Lightpanda](https://lightpanda.io)—a blazingly fast, lightweight headless browser built for SSR.

✨ **Zero impact on your users** • ⚡ **Lightning-fast setup** • 🧠 **Smart bot detection** • 💾 **Minimal memory footprint**

## Installation

```sh
pnpm install fastify-prerender-plugin
```

**Requirements:** Node.js 22+, Fastify

## Quick Start

Register the plugin with your Fastify server. That's it.

```typescript
import { fastify } from 'fastify'
import { prerenderPlugin } from 'fastify-prerender-plugin'

const app = fastify()

await app.register(prerenderPlugin, {
  urls: ['/'], // URLs to prerender (supports regex too!)
  port: 3000
})

app.get('/', (request, reply) => {
  reply.type('text/html').send(`
    <html>
      <body>
        <div id="root"></div>
        <script>
          document.getElementById('root').textContent = 'Hello World'
        </script>
      </body>
    </html>
  `)
})

app.listen({ port: 3000 })
```

**Done!** Bots now get fully-rendered HTML. Your users get the lightning-fast SPA.

## Configuration

```typescript
{
  urls: ['/', /^\/about/],  // URLs to prerender (strings or regex)
  host: 'localhost',         // Optional, defaults to 'localhost'
  port: 3000                 // Your Fastify server port
}
```

## How It Works

1. **Request comes in** → Plugin checks `User-Agent` with [isbot](https://www.npmjs.com/package/isbot)
2. **Bot detected?** → Lightpanda renders the page in milliseconds
3. **Fully-rendered HTML** → Cached (5 min) and served to bot
4. **Regular user?** → Standard SPA, zero overhead

Your SPA works exactly as before. Bots see the rendered version. Everyone wins.

## About Lightpanda

This plugin uses [Lightpanda](https://lightpanda.io)—a lightweight headless browser built specifically for SSR. It's **dramatically lighter** than Chromium or Firefox, starts instantly, and installs automatically with the plugin.

**Custom executable path?** Set `LIGHTPANDA_EXECUTABLE_PATH`:

```sh
export LIGHTPANDA_EXECUTABLE_PATH=/path/to/lightpanda
```

## Contributing

Issues and PRs welcome! [Open an issue](https://github.com/grebonato/fastify-prerender-plugin/issues) or submit a pull request.

## License

MIT
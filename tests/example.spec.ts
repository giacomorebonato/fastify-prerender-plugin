import { expect, test } from '@playwright/test'

test.describe('when JS is enabled and user agent is not a bot', () => {
	test('applies browser JS', async ({ page }) => {
		await page.goto('http://localhost:3000')

		await expect(page.getByText('Hello World')).toBeVisible()
	})
})

test.describe('when JS is disabled and user agent is not a bot', () => {
	test.use({
		javaScriptEnabled: false,
	})
	test(`doesn't apply browser JS`, async ({ page }) => {
		await page.goto('http://localhost:3000')

		await expect(page.getByText('Hello World')).not.toBeVisible()
	})
})

test.describe('when JS is disabled and user agent is a bot', () => {
	test.use({
		javaScriptEnabled: false,
		userAgent:
			'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
	})
	test('applies browser JS ', async ({ page }) => {
		await page.goto('http://localhost:3000')
		await expect(page.getByText('Hello World')).toBeVisible()

		for (let i = 0; i < 50; i++) {
			await page.reload()
			await expect(page.getByText('Hello World')).toBeVisible()
		}
	})
})

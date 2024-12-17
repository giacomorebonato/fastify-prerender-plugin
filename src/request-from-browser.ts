import puppeteer from 'puppeteer-core'

export async function requestFromBrowser(url: string): Promise<string> {
	const browser = await puppeteer.launch({
		executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
		args: [
			'--disable-dev-shm-usage',
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-background-timer-throttling',
			'--disable-backgrounding-occluded-windows',
			'--disable-renderer-backgrounding',
			'--disable-extensions',
			'--disable-sync',
			'--disable-translate',
			'--single-process', // Run in a single process
			'--no-zygote', // Disable the zygote process for reduced memory usage
			'--disable-gpu', // Disable GPU hardware acceleration
		],
		headless: true,
		protocolTimeout: 30_000,
	})
	const page = await browser.newPage()

	await page.setUserAgent(
		'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
	)

	await page.goto(url)
	let html: string
	try {
		html = await page.content()
	} catch (error) {
		console.error(error)

		return ''
	}

	await browser.close()

	return html
}

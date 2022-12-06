import type {LoaderFunction} from '@remix-run/node'

import {isHex, isValidName} from '~/lib/helpers'

// Getting this to deploy required changing some settings in Dockerfile!
const puppeteer = require('puppeteer')

export const loader: LoaderFunction = async ({request, params}) => {
  if (!params?.name || !isValidName(params?.name) || !params?.value || !isHex(params?.value)) {
    throw new Response(`Not Found`, {
      status: 404,
    })
  }

  // URL without `.png` is the actual design
  const requestUrl = new URL(request.url)
  const metaUrl = requestUrl.origin + requestUrl.pathname.replace(`.png`, ``)

  // Use pupeeteer to get the image
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_BIN,
    args: [
      // From https://github.com/fly-apps/puppeteer-js-renderer/blob/master/index.js
      // Required for Docker version of Puppeteer
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      '--disable-dev-shm-usage',
    ],
  })
  const page = await browser.newPage()

  await page.setViewport({
    width: 1200,
    height: 630,
    deviceScaleFactor: 2,
  })

  await page.goto(metaUrl)
  const file = await page.screenshot({type: 'png'})

  await browser.close()

  return new Response(file, {
    headers: {
      'Content-Type': 'image/png',
      'x-content-type-options': 'nosniff',
      'Cache-Control': 'max-age=604800, s-maxage=604800',
    },
  })
}

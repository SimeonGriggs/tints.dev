import type {LinksFunction, LoaderArgs, MetaFunction} from '@remix-run/node'
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from '@remix-run/react'
import {Analytics} from '@vercel/analytics/react'

import stylesUrl from '~/styles/app.css'

import {META} from './lib/constants'

export const meta: MetaFunction = () => {
  const title = META.title
  const description = META.description

  return {
    title,
    description,
    type: 'website',
    'theme-color': '#2522fc',
    'color-scheme': 'light',
    'twitter:card': 'summary_large_image',
    'twitter:creator': `@simeonGriggs`,
    'twitter:title': title,
    'twitter:description': description,
    'og:title': title,
    'og:url': META.origin,
    'og:type': 'website',
  }
}

const fonts = [
  `/fonts/JetBrainsMono-Regular.woff2`,
  `/fonts/Inter-Regular.woff2`,
  `/fonts/Inter-Medium.woff2`,
  `/fonts/Inter-Bold.woff2`,
]

export const links: LinksFunction = () => {
  return [
    ...fonts.map((href: string) => ({
      rel: 'preload',
      as: 'font',
      href,
      type: 'font/woff2',
      crossOrigin: 'anonymous' as const,
    })),
    {rel: 'canonical', href: META.origin},
    {rel: 'stylesheet', href: stylesUrl},
  ]
}

export const loader = async (props: LoaderArgs) => {
  return {
    ENV: {
      VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID,
    },
  }
}

export default function App() {
  const {ENV} = useLoaderData<typeof loader>()

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="https://fav.farm/🎨" />
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
        <Meta />
        <Links />
      </head>
      <body className="bg-white text-gray-900">
        <Outlet />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <LiveReload />
        {process.env.NODE_ENV !== 'development' ? <Analytics debug={false} /> : null}
      </body>
    </html>
  )
}

export function CatchBoundary() {
  const caught = useCatch()

  switch (caught.status) {
    case 401:
    case 404:
    case 406:
      return (
        <div className="w-screen min-h-screen flex items-center justify-center">
          <article className="prose prose-lg prose-blue w-full max-w-lg">
            <h1>
              <span className="font-mono text-blue-500 pr-5">{caught.status}</span>
              <br /> {caught.data}
            </h1>
            {caught?.statusText ? <p>{caught.statusText}</p> : null}
            <hr />
            <p>
              Report a broken link to <a href="mailto:simeon@hey.com">simeon@hey.com</a>
            </p>
            <p>
              <Link to="/">Start fresh</Link>
            </p>
          </article>
        </div>
      )

    default:
      throw new Error(`Unexpected caught response with status: ${caught.status}`)
  }
}

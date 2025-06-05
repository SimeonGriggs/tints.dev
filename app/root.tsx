import type { LinksFunction, MetaFunction, SerializeFrom } from 'react-router';
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from 'react-router';
import {Analytics} from '@vercel/analytics/react'

import {FONTS, META} from '~/lib/constants'
import styles from '~/styles/app.css?url'

export const meta: MetaFunction = () => {
  const title = META.title
  const description = META.description

  return [
    {title},
    {name: 'description', content: description},
    {type: 'website'},
    {'theme-color': '#2522fc'},
    {'color-scheme': 'light'},
    {'twitter:card': 'summary_large_image'},
    {'twitter:creator': `@simeonGriggs`},
    {'twitter:title': title},
    {'twitter:description': description},
    {'og:title': title},
    {'og:url': META.origin},
    {'og:type': 'website'},
  ]
}

export const links: LinksFunction = () => {
  return [
    ...FONTS.map((href: string) => ({
      rel: 'preload',
      as: 'font',
      href,
      type: 'font/woff2',
      crossOrigin: 'anonymous' as const,
    })),
    {rel: 'canonical', href: META.origin},
    {rel: 'preload', href: styles, as: 'style'},
    {rel: 'stylesheet', href: styles},
  ]
}

export const loader = async () => {
  return {
    ENV: {
      VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID,
    },
  }
}

declare global {
  interface Window {
    ENV: SerializeFrom<typeof loader>['ENV']
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
        {process.env.NODE_ENV !== 'development' ? <Analytics debug={false} /> : null}
      </body>
    </html>
  )
}

export function CatchBoundary() {
  const error = useRouteError()

  return (
    <div className="w-screen min-h-screen flex items-center justify-center">
      <article className="prose prose-lg prose-blue w-full max-w-lg">
        {isRouteErrorResponse(error) ? (
          <>
            <h1>
              <span className="font-mono text-blue-500 pr-5">{error.status}</span>
              <br /> {error.data}
            </h1>
            {error?.statusText ? <p>{error.statusText}</p> : null}
          </>
        ) : (
          <h1>Unknown error</h1>
        )}
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
}

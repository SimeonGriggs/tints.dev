import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch, Link} from 'remix'
import type {MetaFunction, LinksFunction} from 'remix'
import {META} from './lib/constants'
import stylesUrl from '~/styles/output.css'

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
      crossOrigin: 'anonymous',
    })),
    {rel: 'canonical', href: META.origin},
    {rel: 'stylesheet', href: stylesUrl},
  ]
}

export default function App() {
  return <Document />
}

function Document({children}: {children?: React.ReactNode}) {
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
        {children ?? null}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
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
        <Document title={`${caught.status} ${caught.data}`}>
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
        </Document>
      )

    default:
      throw new Error(`Unexpected caught response with status: ${caught.status}`)
  }
}

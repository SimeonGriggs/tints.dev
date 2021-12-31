import {Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration} from 'remix'
import type {MetaFunction, LinksFunction} from 'remix'
import {META} from './lib/constants'
import stylesUrl from '~/styles/output.css'

export const meta: MetaFunction = () => {
  const title = META.title
  const description = META.description

  return {
    title,
    description,
    'twitter:card': 'summary_large_image',
    'twitter:creator': `@simeonGriggs`,
    'twitter:title': title,
    'twitter:description': description,
    'og:url': META.origin,
    'theme-color': '#2522fc',
    'color-scheme': 'light',
    type: 'website',
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
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  )
}

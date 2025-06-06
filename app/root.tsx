import "~/styles/app.css";

import { Analytics } from "@vercel/analytics/react";
import type { LinksFunction } from "react-router";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "react-router";

import { META } from "~/lib/constants";

export const links: LinksFunction = () => {
  return [
    { rel: "canonical", href: META.origin },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "anonymous",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap",
    },
  ];
};

export const loader = async () => {
  return {
    ENV: {
      VERCEL_ANALYTICS_ID: process.env.VERCEL_ANALYTICS_ID,
    },
  };
};

export default function App() {
  const { ENV } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="https://fav.farm/🎨" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />

        <title>{META.title}</title>
        <meta name="description" content={META.description} />
        <meta name="type" content="website" />
        <meta name="theme-color" content="#2522fc" />
        <meta name="color-scheme" content="light" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@simeonGriggs" />
        <meta name="twitter:title" content={META.title} />
        <meta name="twitter:description" content={META.description} />
        <meta name="og:title" content={META.title} />
        <meta name="og:type" content="website" />

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
        {process.env.NODE_ENV !== "development" ? (
          <Analytics debug={false} />
        ) : null}
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const error = useRouteError();

  return (
    <div className="w-screen min-h-screen flex items-center justify-center">
      <article className="prose prose-lg prose-blue w-full max-w-lg">
        {isRouteErrorResponse(error) ? (
          <>
            <h1>
              <span className="font-mono text-blue-500 pr-5">
                {error.status}
              </span>
              <br /> {error.data}
            </h1>
            {error?.statusText ? <p>{error.statusText}</p> : null}
          </>
        ) : (
          <h1>Unknown error</h1>
        )}
        <hr />
        <p>
          Report a broken link to{" "}
          <a href="mailto:simeon@hey.com">simeon@hey.com</a>
        </p>
        <p>
          <Link to="/">Start fresh</Link>
        </p>
      </article>
    </div>
  );
}

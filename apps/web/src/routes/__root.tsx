import {
  Outlet,
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import appCss from "@workspace/ui/styles/globals.css?url";
import type { QueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { DefaultCatchBoundary } from "@/components/util/DefaultCatchBoundary";
import { NotFound } from "@/components/util/NotFound";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Providers } from "@/components/providers";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <Layout>
          <DefaultCatchBoundary {...props} />
        </Layout>
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: () => (
    <RootDocument>
      <Outlet />
    </RootDocument>
  ),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
          <Scripts />
        </Providers>
        <TanStackRouterDevtools />{" "}
      </body>
    </html>
  );
}

import { getEvent } from "vinxi/http";

type CfEnv = {
  env: Cloudflare.Env;
  waitUntil: (promise: Promise<unknown>) => void;
};

const getDevProxy = async () => {
  const cf = await import("wrangler");
  return await cf.getPlatformProxy<Cloudflare.Env>({ persist: true });
};

let ___devProxy: ReturnType<typeof getDevProxy> | undefined = undefined;

export const getCloudflareContext = async (): Promise<CfEnv> => {
  const event = getEvent();
  if (import.meta.env.DEV) {
    // Attach the cloudflare context
    if (!___devProxy) {
      ___devProxy = getDevProxy();
    }
    const proxy = await ___devProxy;
    return {
      env: proxy.env,
      waitUntil: (promise: Promise<unknown>) => proxy.ctx.waitUntil(promise),
    };
  } else {
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      env: event.context.cloudflare?.env as Cloudflare.Env,
      waitUntil: (promise: Promise<unknown>) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        event.context.cloudflare?.context?.waitUntil(promise);
      },
    };
  }
};

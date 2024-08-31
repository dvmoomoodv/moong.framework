// @ts-ignore
import { options } from "#moong-cache-ssr-options";
import path from "#moong/core/utils/path";

export const isUrlCacheable = (req, res, pages = []) => {
  const { disableCacheOnDemand = {} } = options;
  const { headerKey = "" } = disableCacheOnDemand;
  const { url } = req;
  let isCacheable = false;
  if (headerKey) {
    const resHeaders = res.getHeaders();
    if (headerKey in resHeaders) {
      return false;
    }
  }

  pages.forEach((page) => {
    if (page === "/") {
      if (page === url) {
        isCacheable = true;
      }
    } else if (path.isMatchPatterns(url, page)) {
      isCacheable = true;
    }
  });
  return isCacheable;
};

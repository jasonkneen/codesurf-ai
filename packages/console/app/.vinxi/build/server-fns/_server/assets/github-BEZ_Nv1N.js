import { c as createServerReference } from "./server-fns-runtime-DkWzG_ke.js";
import { c as config } from "./config-DvKqrD3y.js";
import "solid-js/web";
import "solid-js/web/storage";
import "./fetchEvent-4t5qANvA.js";
import "h3";
import "unctx";
import "node:async_hooks";
const github_query = createServerReference(async () => {
  const headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
  };
  const apiBaseUrl = config.github.repoUrl.replace("https://github.com/", "https://api.github.com/repos/");
  try {
    const [meta, releases, contributors] = await Promise.all([fetch(apiBaseUrl, {
      headers
    }).then((res) => res.json()), fetch(`${apiBaseUrl}/releases`, {
      headers
    }).then((res) => res.json()), fetch(`${apiBaseUrl}/contributors?per_page=1`, {
      headers
    })]);
    const [release] = releases;
    const contributorCount = Number.parseInt(contributors.headers.get("Link").match(/&page=(\d+)>; rel="last"/).at(1));
    return {
      stars: meta.stargazers_count,
      release: {
        name: release.name,
        url: release.html_url
      },
      contributors: contributorCount
    };
  } catch (e) {
    console.error(e);
  }
  return void 0;
}, "src_lib_github_ts--github_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/lib/github.ts?tsr-directive-use-server=");
export {
  github_query
};

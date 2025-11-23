import { ssr, ssrHydrationKey, escape, createComponent, ssrAttribute, ssrStyle } from "solid-js/web";
import { l as logoLight, a as logoDark } from "./logo-ornate-dark-DH7mkrML.js";
import { createMemo, createEffect, onCleanup, Show, Switch, Match } from "solid-js";
import { createStore } from "solid-js/store";
import { q as query, l as useNavigate } from "./query-D38s0pjD.js";
import { c as createAsync } from "./createAsync-NuC5SOD6.js";
import { A } from "./components-DamWUrce.js";
import { c as createServerReference } from "./server-fns-runtime-CTvv0t23.js";
const copyLogoLight = "data:image/svg+xml,%3csvg%20width='22'%20height='26'%20viewBox='0%200%2022%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_1311_94907)'%3e%3cpath%20d='M15%2019H7V11H15V19Z'%20fill='%23BCBBBB'/%3e%3cpath%20d='M15%207H7V19H15V7ZM19%2023H3V3H19V23Z'%20fill='%23211E1E'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1311_94907'%3e%3crect%20width='16'%20height='20'%20fill='white'%20transform='translate(3%203)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const copyLogoDark = "data:image/svg+xml,%3csvg%20width='22'%20height='26'%20viewBox='0%200%2022%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_1311_94916)'%3e%3cpath%20d='M15%2019H7V11H15V19Z'%20fill='%234B4646'/%3e%3cpath%20d='M15%207H7V19H15V7ZM19%2023H3V3H19V23Z'%20fill='%23F1ECEC'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1311_94916'%3e%3crect%20width='16'%20height='20'%20fill='white'%20transform='translate(3%203)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const copyWordmarkLight = "data:image/svg+xml,%3csvg%20width='22'%20height='26'%20viewBox='0%200%2022%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.33203%207.99967V6.33301H10.9987M17.6654%207.99967V6.33301H10.9987M10.9987%206.33301V19.6663M10.9987%2019.6663H9.33203M10.9987%2019.6663H12.6654'%20stroke='black'%20stroke-width='2'%20stroke-linecap='square'/%3e%3c/svg%3e";
const copyWordmarkDark = "data:image/svg+xml,%3csvg%20width='22'%20height='26'%20viewBox='0%200%2022%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.33203%207.99967V6.33301H10.9987M17.6654%207.99967V6.33301H10.9987M10.9987%206.33301V19.6663M10.9987%2019.6663H9.33203M10.9987%2019.6663H12.6654'%20stroke='%23F1ECEC'%20stroke-width='2'%20stroke-linecap='square'/%3e%3c/svg%3e";
const copyBrandAssetsLight = "data:image/svg+xml,%3csvg%20width='22'%20height='26'%20viewBox='0%200%2022%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M15%207H7V19H15V7ZM19%2023H3V3H19V23Z'%20fill='url(%23paint0_linear_1311_94913)'%20stroke='%238E8B8B'/%3e%3cpath%20d='M3%200V26M19%200V26M15%200V26M7%200V26M0%203H22M0%207H22M0%2019H22M0%2023H22'%20stroke='%23110000'%20stroke-opacity='0.121569'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_1311_94913'%20x1='11'%20y1='3'%20x2='11'%20y2='23'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%23F9F8F8'/%3e%3cstop%20offset='1'%20stop-color='%23E9E8E8'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e";
const copyBrandAssetsDark = "data:image/svg+xml,%3csvg%20width='22'%20height='26'%20viewBox='0%200%2022%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M15%207H7V19H15V7ZM19%2023H3V3H19V23Z'%20fill='url(%23paint0_linear_1311_94922)'%20stroke='%23F1ECEC'/%3e%3cpath%20d='M3%200V26M19%200V26M15%200V26M7%200V26M0%203H22M0%207H22M0%2019H22M0%2023H22'%20stroke='%234B4646'%20stroke-opacity='0.4'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_1311_94922'%20x1='11'%20y1='3'%20x2='11'%20y2='23'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%231B1818'/%3e%3cstop%20offset='1'%20stop-color='%232D2828'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e";
const config = {
  // Base URL
  baseUrl: "https://opencode.ai",
  // GitHub
  github: {
    repoUrl: "https://github.com/sst/opencode",
    starsFormatted: {
      compact: "30K",
      full: "30,000"
    }
  },
  // Social links
  social: {
    twitter: "https://x.com/opencode"
  },
  // Static stats (used on landing page)
  stats: {
    contributors: "250",
    commits: "3,500",
    monthlyUsers: "300,000"
  }
};
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
const github = query(github_query, "github");
var _tmpl$$2 = ["<img", ' data-slot="logo light"', ' alt="opencode logo light">'], _tmpl$2 = ["<img", ' data-slot="logo dark"', ' alt="opencode logo dark">'], _tmpl$3 = ["<div", ' class="context-menu" style="', '"><button class="context-menu-item"><img data-slot="copy light"', ' alt="Logo"><img data-slot="copy dark"', ' alt="Logo">Copy logo as SVG</button><button class="context-menu-item"><img data-slot="copy light"', ' alt="Wordmark"><img data-slot="copy dark"', ' alt="Wordmark">Copy wordmark as SVG</button><button class="context-menu-item"><img data-slot="copy light"', ' alt="Brand Assets"><img data-slot="copy dark"', ' alt="Brand Assets">Brand assets</button></div>'], _tmpl$4 = ["<a", ' href="/auth">Login</a>'], _tmpl$5 = ["<svg", ' class="icon icon-close" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M12.7071 11.9993L18.0104 17.3026L17.3033 18.0097L12 12.7064L6.6967 18.0097L5.98959 17.3026L11.2929 11.9993L5.98959 6.69595L6.6967 5.98885L12 11.2921L17.3033 5.98885L18.0104 6.69595L12.7071 11.9993Z" fill="currentColor"></path></svg>'], _tmpl$6 = ["<svg", ' class="icon icon-hamburger" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M19 17H5V16H19V17Z" fill="currentColor"></path><path d="M19 8H5V7H19V8Z" fill="currentColor"></path></svg>'], _tmpl$7 = ["<div", ' id="nav-mobile-menu" data-component="nav-mobile"><nav data-component="nav-mobile-menu-list"><ul><li>', "</li><li><a", ' target="_blank">GitHub <span>[<!--$-->', '<!--/-->]</span></a></li><li><a href="/docs">Docs</a></li><li>', "</li><li>", "</li></ul></nav></div>"], _tmpl$8 = ["<section", ' data-component="top"><div>', "</div><!--$-->", '<!--/--><nav data-component="nav-desktop"><ul><li><a', ' target="_blank">GitHub <span>[<!--$-->', '<!--/-->]</span></a></li><li><a href="/docs">Docs</a></li><li>', "</li><li>", '</li></ul></nav><nav data-component="nav-mobile"><button type="button" data-component="nav-mobile-toggle" aria-expanded="false" aria-controls="nav-mobile-menu" class="nav-toggle"><span class="sr-only">Open menu</span><!--$-->', "<!--/--></button><!--$-->", "<!--/--></nav></section>"];
function Header(props) {
  useNavigate();
  const githubData = createAsync(() => github());
  const starCount = createMemo(() => githubData()?.stars ? new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short"
  }).format(githubData()?.stars) : config.github.starsFormatted.compact);
  const [store, setStore] = createStore({
    mobileMenuOpen: false,
    contextMenuOpen: false,
    contextMenuPosition: {
      x: 0,
      y: 0
    }
  });
  createEffect(() => {
    const handleClickOutside = () => {
      setStore("contextMenuOpen", false);
    };
    const handleContextMenu = (event) => {
      event.preventDefault();
      setStore("contextMenuOpen", false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setStore("contextMenuOpen", false);
      }
    };
    if (store.contextMenuOpen) {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("keydown", handleKeyDown);
      onCleanup(() => {
        document.removeEventListener("click", handleClickOutside);
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("keydown", handleKeyDown);
      });
    }
  });
  return ssr(_tmpl$8, ssrHydrationKey(), escape(createComponent(A, {
    href: "/",
    get children() {
      return [ssr(_tmpl$$2, ssrHydrationKey(), ssrAttribute("src", escape(logoLight, true), false)), ssr(_tmpl$2, ssrHydrationKey(), ssrAttribute("src", escape(logoDark, true), false))];
    }
  })), escape(createComponent(Show, {
    get when() {
      return store.contextMenuOpen;
    },
    get children() {
      return ssr(_tmpl$3, ssrHydrationKey(), ssrStyle(`left: ${store.contextMenuPosition.x}px; top: ${store.contextMenuPosition.y}px;`), ssrAttribute("src", escape(copyLogoLight, true), false), ssrAttribute("src", escape(copyLogoDark, true), false), ssrAttribute("src", escape(copyWordmarkLight, true), false), ssrAttribute("src", escape(copyWordmarkDark, true), false), ssrAttribute("src", escape(copyBrandAssetsLight, true), false), ssrAttribute("src", escape(copyBrandAssetsDark, true), false));
    }
  })), ssrAttribute("href", escape(config.github.repoUrl, true), false), escape(starCount()), escape(createComponent(A, {
    href: "/enterprise",
    children: "Enterprise"
  })), escape(createComponent(Switch, {
    get children() {
      return [createComponent(Match, {
        get when() {
          return props.zen;
        },
        get children() {
          return ssr(_tmpl$4, ssrHydrationKey());
        }
      }), createComponent(Match, {
        get when() {
          return !props.zen;
        },
        get children() {
          return createComponent(A, {
            href: "/zen",
            children: "Zen"
          });
        }
      })];
    }
  })), escape(createComponent(Switch, {
    get children() {
      return [createComponent(Match, {
        get when() {
          return store.mobileMenuOpen;
        },
        get children() {
          return ssr(_tmpl$5, ssrHydrationKey());
        }
      }), createComponent(Match, {
        get when() {
          return !store.mobileMenuOpen;
        },
        get children() {
          return ssr(_tmpl$6, ssrHydrationKey());
        }
      })];
    }
  })), escape(createComponent(Show, {
    get when() {
      return store.mobileMenuOpen;
    },
    get children() {
      return ssr(_tmpl$7, ssrHydrationKey(), escape(createComponent(A, {
        href: "/",
        children: "Home"
      })), ssrAttribute("href", escape(config.github.repoUrl, true), false), escape(starCount()), escape(createComponent(A, {
        href: "/enterprise",
        children: "Enterprise"
      })), escape(createComponent(Switch, {
        get children() {
          return [createComponent(Match, {
            get when() {
              return props.zen;
            },
            get children() {
              return ssr(_tmpl$4, ssrHydrationKey());
            }
          }), createComponent(Match, {
            get when() {
              return !props.zen;
            },
            get children() {
              return createComponent(A, {
                href: "/zen",
                children: "Zen"
              });
            }
          })];
        }
      })));
    }
  })));
}
var _tmpl$$1 = ["<footer", ' data-component="footer"><div data-slot="cell"><a', ' target="_blank">GitHub <span>[<!--$-->', '<!--/-->]</span></a></div><div data-slot="cell"><a href="/docs">Docs</a></div><div data-slot="cell"><a href="/discord">Discord</a></div><div data-slot="cell"><a', ">X</a></div></footer>"];
function Footer() {
  const githubData = createAsync(() => github());
  const starCount = createMemo(() => githubData()?.stars ? new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short"
  }).format(githubData().stars) : config.github.starsFormatted.compact);
  return ssr(_tmpl$$1, ssrHydrationKey(), ssrAttribute("href", escape(config.github.repoUrl, true), false), escape(starCount()), ssrAttribute("href", escape(config.social.twitter, true), false));
}
var _tmpl$ = ["<div", ' data-component="legal"><span>©<!--$-->', '<!--/--> <a href="https://anoma.ly">Anomaly</a></span><span>', "</span></div>"];
function Legal() {
  return ssr(_tmpl$, ssrHydrationKey(), escape((/* @__PURE__ */ new Date()).getFullYear()), escape(createComponent(A, {
    href: "/brand",
    children: "Brand"
  })));
}
export {
  Footer as F,
  Header as H,
  Legal as L,
  config as c,
  github as g
};

import { h as delegateEvents, a as createMemo, A as createEffect, f as onCleanup, i as getNextElement, t as template, v as getNextMarker, l as insert, b as createComponent, w as setAttribute, y as createRenderEffect, O as style, r as runHydrationEvents, S as Show, M as Match, K as Switch } from './web-B4FMlVCr.js';
import { l as logoLight, a as logoDark } from './logo-ornate-dark-BX3xCqAP.js';
import { c as createStore } from './store-CSXr9rVx.js';
import { q as query, h as useNavigate } from './query-C7ETZYOA.js';
import { a as createServerReference, c as createAsync } from './server-runtime-BVQMvLQK.js';
import { A } from './components-D9Uvz6lf.js';

const copyLogoLight = "data:image/svg+xml,%3csvg%20width='22'%20height='26'%20viewBox='0%200%2022%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_1311_94907)'%3e%3cpath%20d='M15%2019H7V11H15V19Z'%20fill='%23BCBBBB'/%3e%3cpath%20d='M15%207H7V19H15V7ZM19%2023H3V3H19V23Z'%20fill='%23211E1E'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1311_94907'%3e%3crect%20width='16'%20height='20'%20fill='white'%20transform='translate(3%203)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";

const copyLogoDark = "data:image/svg+xml,%3csvg%20width='22'%20height='26'%20viewBox='0%200%2022%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_1311_94916)'%3e%3cpath%20d='M15%2019H7V11H15V19Z'%20fill='%234B4646'/%3e%3cpath%20d='M15%207H7V19H15V7ZM19%2023H3V3H19V23Z'%20fill='%23F1ECEC'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1311_94916'%3e%3crect%20width='16'%20height='20'%20fill='white'%20transform='translate(3%203)'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";

const copyWordmarkLight = "data:image/svg+xml,%3csvg%20width='22'%20height='26'%20viewBox='0%200%2022%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.33203%207.99967V6.33301H10.9987M17.6654%207.99967V6.33301H10.9987M10.9987%206.33301V19.6663M10.9987%2019.6663H9.33203M10.9987%2019.6663H12.6654'%20stroke='black'%20stroke-width='2'%20stroke-linecap='square'/%3e%3c/svg%3e";

const copyWordmarkDark = "data:image/svg+xml,%3csvg%20width='22'%20height='26'%20viewBox='0%200%2022%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M4.33203%207.99967V6.33301H10.9987M17.6654%207.99967V6.33301H10.9987M10.9987%206.33301V19.6663M10.9987%2019.6663H9.33203M10.9987%2019.6663H12.6654'%20stroke='%23F1ECEC'%20stroke-width='2'%20stroke-linecap='square'/%3e%3c/svg%3e";

const copyBrandAssetsLight = "data:image/svg+xml,%3csvg%20width='22'%20height='26'%20viewBox='0%200%2022%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M15%207H7V19H15V7ZM19%2023H3V3H19V23Z'%20fill='url(%23paint0_linear_1311_94913)'%20stroke='%238E8B8B'/%3e%3cpath%20d='M3%200V26M19%200V26M15%200V26M7%200V26M0%203H22M0%207H22M0%2019H22M0%2023H22'%20stroke='%23110000'%20stroke-opacity='0.121569'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_1311_94913'%20x1='11'%20y1='3'%20x2='11'%20y2='23'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%23F9F8F8'/%3e%3cstop%20offset='1'%20stop-color='%23E9E8E8'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e";

const copyBrandAssetsDark = "data:image/svg+xml,%3csvg%20width='22'%20height='26'%20viewBox='0%200%2022%2026'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M15%207H7V19H15V7ZM19%2023H3V3H19V23Z'%20fill='url(%23paint0_linear_1311_94922)'%20stroke='%23F1ECEC'/%3e%3cpath%20d='M3%200V26M19%200V26M15%200V26M7%200V26M0%203H22M0%207H22M0%2019H22M0%2023H22'%20stroke='%234B4646'%20stroke-opacity='0.4'/%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_1311_94922'%20x1='11'%20y1='3'%20x2='11'%20y2='23'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%231B1818'/%3e%3cstop%20offset='1'%20stop-color='%232D2828'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e";

const copyLogoSvgLight = "data:image/svg+xml,%3csvg%20width='32'%20height='40'%20viewBox='0%200%2032%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_1311_94969)'%3e%3cpath%20d='M24%2032H8V16H24V32Z'%20fill='%23BCBBBB'/%3e%3cpath%20d='M24%208H8V32H24V8ZM32%2040H0V0H32V40Z'%20fill='%23211E1E'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1311_94969'%3e%3crect%20width='32'%20height='40'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";

const copyLogoSvgDark = "data:image/svg+xml,%3csvg%20width='32'%20height='40'%20viewBox='0%200%2032%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_1311_94973)'%3e%3cpath%20d='M24%2032H8V16H24V32Z'%20fill='%234B4646'/%3e%3cpath%20d='M24%208H8V32H24V8ZM32%2040H0V0H32V40Z'%20fill='%23F1ECEC'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1311_94973'%3e%3crect%20width='32'%20height='40'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";

const copyWordmarkSvgLight = "data:image/svg+xml,%3csvg%20width='234'%20height='42'%20viewBox='0%200%20234%2042'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_1311_95049)'%3e%3cpath%20d='M18%2030H6V18H18V30Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M18%2012H6V30H18V12ZM24%2036H0V6H24V36Z'%20fill='%23656363'/%3e%3cpath%20d='M48%2030H36V18H48V30Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M36%2030H48V12H36V30ZM54%2036H36V42H30V6H54V36Z'%20fill='%23656363'/%3e%3cpath%20d='M84%2024V30H66V24H84Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M84%2024H66V30H84V36H60V6H84V24ZM66%2018H78V12H66V18Z'%20fill='%23656363'/%3e%3cpath%20d='M108%2036H96V18H108V36Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M108%2012H96V36H90V6H108V12ZM114%2036H108V12H114V36Z'%20fill='%23656363'/%3e%3cpath%20d='M144%2030H126V18H144V30Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M144%2012H126V30H144V36H120V6H144V12Z'%20fill='%23211E1E'/%3e%3cpath%20d='M168%2030H156V18H168V30Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M168%2012H156V30H168V12ZM174%2036H150V6H174V36Z'%20fill='%23211E1E'/%3e%3cpath%20d='M198%2030H186V18H198V30Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M198%2012H186V30H198V12ZM204%2036H180V6H198V0H204V36Z'%20fill='%23211E1E'/%3e%3cpath%20d='M234%2024V30H216V24H234Z'%20fill='%23CFCECD'/%3e%3cpath%20d='M216%2012V18H228V12H216ZM234%2024H216V30H234V36H210V6H234V24Z'%20fill='%23211E1E'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1311_95049'%3e%3crect%20width='234'%20height='42'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";

const copyWordmarkSvgDark = "data:image/svg+xml,%3csvg%20width='234'%20height='42'%20viewBox='0%200%20234%2042'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_1311_95032)'%3e%3cpath%20d='M18%2030H6V18H18V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M18%2012H6V30H18V12ZM24%2036H0V6H24V36Z'%20fill='%23B7B1B1'/%3e%3cpath%20d='M48%2030H36V18H48V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M36%2030H48V12H36V30ZM54%2036H36V42H30V6H54V36Z'%20fill='%23B7B1B1'/%3e%3cpath%20d='M84%2024V30H66V24H84Z'%20fill='%234B4646'/%3e%3cpath%20d='M84%2024H66V30H84V36H60V6H84V24ZM66%2018H78V12H66V18Z'%20fill='%23B7B1B1'/%3e%3cpath%20d='M108%2036H96V18H108V36Z'%20fill='%234B4646'/%3e%3cpath%20d='M108%2012H96V36H90V6H108V12ZM114%2036H108V12H114V36Z'%20fill='%23B7B1B1'/%3e%3cpath%20d='M144%2030H126V18H144V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M144%2012H126V30H144V36H120V6H144V12Z'%20fill='%23F1ECEC'/%3e%3cpath%20d='M168%2030H156V18H168V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M168%2012H156V30H168V12ZM174%2036H150V6H174V36Z'%20fill='%23F1ECEC'/%3e%3cpath%20d='M198%2030H186V18H198V30Z'%20fill='%234B4646'/%3e%3cpath%20d='M198%2012H186V30H198V12ZM204%2036H180V6H198V0H204V36Z'%20fill='%23F1ECEC'/%3e%3cpath%20d='M234%2024V30H216V24H234Z'%20fill='%234B4646'/%3e%3cpath%20d='M216%2012V18H228V12H216ZM234%2024H216V30H234V36H210V6H234V24Z'%20fill='%23F1ECEC'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1311_95032'%3e%3crect%20width='234'%20height='42'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";

const github_query = createServerReference(() => {
}, "src_lib_github_ts--github_query", "/Users/jkneen/Documents/GitHub/flows/opencode-stt/packages/console/app/src/lib/github.ts?tsr-directive-use-server=");
const github = query(github_query, "github");

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
    twitter: "https://x.com/opencode"},
  // Static stats (used on landing page)
  stats: {
    contributors: "250",
    commits: "3,500",
    monthlyUsers: "300,000"
  }
};

var _tmpl$$2 = /* @__PURE__ */ template(`<img data-slot="logo light"alt="opencode logo light">`), _tmpl$2 = /* @__PURE__ */ template(`<img data-slot="logo dark"alt="opencode logo dark">`), _tmpl$3 = /* @__PURE__ */ template(`<div class=context-menu><button class=context-menu-item><img data-slot="copy light"alt=Logo><img data-slot="copy dark"alt=Logo>Copy logo as SVG</button><button class=context-menu-item><img data-slot="copy light"alt=Wordmark><img data-slot="copy dark"alt=Wordmark>Copy wordmark as SVG</button><button class=context-menu-item><img data-slot="copy light"alt="Brand Assets"><img data-slot="copy dark"alt="Brand Assets">Brand assets`), _tmpl$4 = /* @__PURE__ */ template(`<a href=/auth>Login`), _tmpl$5 = /* @__PURE__ */ template(`<svg class="icon icon-close"width=24 height=24 viewBox="0 0 24 24"fill=none aria-hidden=true xmlns=http://www.w3.org/2000/svg><path d="M12.7071 11.9993L18.0104 17.3026L17.3033 18.0097L12 12.7064L6.6967 18.0097L5.98959 17.3026L11.2929 11.9993L5.98959 6.69595L6.6967 5.98885L12 11.2921L17.3033 5.98885L18.0104 6.69595L12.7071 11.9993Z"fill=currentColor>`), _tmpl$6 = /* @__PURE__ */ template(`<svg class="icon icon-hamburger"width=24 height=24 viewBox="0 0 24 24"fill=none aria-hidden=true xmlns=http://www.w3.org/2000/svg><path d="M19 17H5V16H19V17Z"fill=currentColor></path><path d="M19 8H5V7H19V8Z"fill=currentColor>`), _tmpl$7 = /* @__PURE__ */ template(`<div id=nav-mobile-menu data-component=nav-mobile><nav data-component=nav-mobile-menu-list><ul><li></li><li><a target=_blank>GitHub <span>[<!$><!/>]</span></a></li><li><a href=/docs>Docs</a></li><li></li><li>`), _tmpl$8 = /* @__PURE__ */ template(`<section data-component=top><div></div><!$><!/><nav data-component=nav-desktop><ul><li><a target=_blank>GitHub <span>[<!$><!/>]</span></a></li><li><a href=/docs>Docs</a></li><li></li><li></li></ul></nav><nav data-component=nav-mobile><button type=button data-component=nav-mobile-toggle aria-expanded=false aria-controls=nav-mobile-menu class=nav-toggle><span class=sr-only>Open menu</span><!$><!/></button><!$><!/>`);
const isDarkMode = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
const fetchSvgContent = async (svgPath) => {
  try {
    const response = await fetch(svgPath);
    const svgText = await response.text();
    return svgText;
  } catch (err) {
    console.error("Failed to fetch SVG content:", err);
    throw err;
  }
};
function Header(props) {
  const navigate = useNavigate();
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
  const handleLogoContextMenu = (event) => {
    event.preventDefault();
    const logoElement = event.currentTarget.querySelector("a");
    if (logoElement) {
      const rect = logoElement.getBoundingClientRect();
      setStore("contextMenuPosition", {
        x: rect.left - 16,
        y: rect.bottom + 8
      });
    }
    setStore("contextMenuOpen", true);
  };
  const copyWordmarkToClipboard = async () => {
    try {
      const isDark = isDarkMode();
      const wordmarkSvgPath = isDark ? copyWordmarkSvgDark : copyWordmarkSvgLight;
      const wordmarkSvg = await fetchSvgContent(wordmarkSvgPath);
      await navigator.clipboard.writeText(wordmarkSvg);
    } catch (err) {
      console.error("Failed to copy wordmark to clipboard:", err);
    }
  };
  const copyLogoToClipboard = async () => {
    try {
      const isDark = isDarkMode();
      const logoSvgPath = isDark ? copyLogoSvgDark : copyLogoSvgLight;
      const logoSvg = await fetchSvgContent(logoSvgPath);
      await navigator.clipboard.writeText(logoSvg);
    } catch (err) {
      console.error("Failed to copy logo to clipboard:", err);
    }
  };
  return (() => {
    var _el$ = getNextElement(_tmpl$8), _el$2 = _el$.firstChild, _el$52 = _el$2.nextSibling, [_el$53, _co$5] = getNextMarker(_el$52.nextSibling), _el$13 = _el$53.nextSibling, _el$14 = _el$13.firstChild, _el$15 = _el$14.firstChild, _el$16 = _el$15.firstChild, _el$17 = _el$16.firstChild, _el$18 = _el$17.nextSibling, _el$19 = _el$18.firstChild, _el$21 = _el$19.nextSibling, [_el$22, _co$] = getNextMarker(_el$21.nextSibling); _el$22.nextSibling; var _el$23 = _el$15.nextSibling, _el$24 = _el$23.nextSibling, _el$25 = _el$24.nextSibling, _el$27 = _el$13.nextSibling, _el$28 = _el$27.firstChild, _el$29 = _el$28.firstChild, _el$32 = _el$29.nextSibling, [_el$33, _co$2] = getNextMarker(_el$32.nextSibling), _el$50 = _el$28.nextSibling, [_el$51, _co$4] = getNextMarker(_el$50.nextSibling);
    _el$2.$$contextmenu = handleLogoContextMenu;
    insert(_el$2, createComponent(A, {
      href: "/",
      get children() {
        return [(() => {
          var _el$3 = getNextElement(_tmpl$$2);
          setAttribute(_el$3, "src", logoLight);
          return _el$3;
        })(), (() => {
          var _el$4 = getNextElement(_tmpl$2);
          setAttribute(_el$4, "src", logoDark);
          return _el$4;
        })()];
      }
    }));
    insert(_el$, createComponent(Show, {
      get when() {
        return store.contextMenuOpen;
      },
      get children() {
        var _el$5 = getNextElement(_tmpl$3), _el$6 = _el$5.firstChild, _el$7 = _el$6.firstChild, _el$8 = _el$7.nextSibling, _el$9 = _el$6.nextSibling, _el$0 = _el$9.firstChild, _el$1 = _el$0.nextSibling, _el$10 = _el$9.nextSibling, _el$11 = _el$10.firstChild, _el$12 = _el$11.nextSibling;
        _el$6.$$click = copyLogoToClipboard;
        setAttribute(_el$7, "src", copyLogoLight);
        setAttribute(_el$8, "src", copyLogoDark);
        _el$9.$$click = copyWordmarkToClipboard;
        setAttribute(_el$0, "src", copyWordmarkLight);
        setAttribute(_el$1, "src", copyWordmarkDark);
        _el$10.$$click = () => navigate("/brand");
        setAttribute(_el$11, "src", copyBrandAssetsLight);
        setAttribute(_el$12, "src", copyBrandAssetsDark);
        createRenderEffect((_$p) => style(_el$5, `left: ${store.contextMenuPosition.x}px; top: ${store.contextMenuPosition.y}px;`, _$p));
        runHydrationEvents();
        return _el$5;
      }
    }), _el$53, _co$5);
    insert(_el$18, starCount, _el$22, _co$);
    insert(_el$24, createComponent(A, {
      href: "/enterprise",
      children: "Enterprise"
    }));
    insert(_el$25, createComponent(Switch, {
      get children() {
        return [createComponent(Match, {
          get when() {
            return props.zen;
          },
          get children() {
            return getNextElement(_tmpl$4);
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
    }));
    _el$28.$$click = () => setStore("mobileMenuOpen", !store.mobileMenuOpen);
    insert(_el$28, createComponent(Switch, {
      get children() {
        return [createComponent(Match, {
          get when() {
            return store.mobileMenuOpen;
          },
          get children() {
            return getNextElement(_tmpl$5);
          }
        }), createComponent(Match, {
          get when() {
            return !store.mobileMenuOpen;
          },
          get children() {
            return getNextElement(_tmpl$6);
          }
        })];
      }
    }), _el$33, _co$2);
    insert(_el$27, createComponent(Show, {
      get when() {
        return store.mobileMenuOpen;
      },
      get children() {
        var _el$34 = getNextElement(_tmpl$7), _el$35 = _el$34.firstChild, _el$36 = _el$35.firstChild, _el$37 = _el$36.firstChild, _el$38 = _el$37.nextSibling, _el$39 = _el$38.firstChild, _el$40 = _el$39.firstChild, _el$41 = _el$40.nextSibling, _el$42 = _el$41.firstChild, _el$44 = _el$42.nextSibling, [_el$45, _co$3] = getNextMarker(_el$44.nextSibling); _el$45.nextSibling; var _el$46 = _el$38.nextSibling, _el$47 = _el$46.nextSibling, _el$48 = _el$47.nextSibling;
        insert(_el$37, createComponent(A, {
          href: "/",
          children: "Home"
        }));
        insert(_el$41, starCount, _el$45, _co$3);
        insert(_el$47, createComponent(A, {
          href: "/enterprise",
          children: "Enterprise"
        }));
        insert(_el$48, createComponent(Switch, {
          get children() {
            return [createComponent(Match, {
              get when() {
                return props.zen;
              },
              get children() {
                return getNextElement(_tmpl$4);
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
        }));
        createRenderEffect(() => setAttribute(_el$39, "href", config.github.repoUrl));
        return _el$34;
      }
    }), _el$51, _co$4);
    createRenderEffect(() => setAttribute(_el$16, "href", config.github.repoUrl));
    runHydrationEvents();
    return _el$;
  })();
}
delegateEvents(["contextmenu", "click"]);

var _tmpl$$1 = /* @__PURE__ */ template(`<footer data-component=footer><div data-slot=cell><a target=_blank>GitHub <span>[<!$><!/>]</span></a></div><div data-slot=cell><a href=/docs>Docs</a></div><div data-slot=cell><a href=/discord>Discord</a></div><div data-slot=cell><a>X`);
function Footer() {
  const githubData = createAsync(() => github());
  const starCount = createMemo(() => githubData()?.stars ? new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short"
  }).format(githubData().stars) : config.github.starsFormatted.compact);
  return (() => {
    var _el$ = getNextElement(_tmpl$$1), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild, _el$5 = _el$4.nextSibling, _el$6 = _el$5.firstChild, _el$8 = _el$6.nextSibling, [_el$9, _co$] = getNextMarker(_el$8.nextSibling); _el$9.nextSibling; var _el$0 = _el$2.nextSibling, _el$1 = _el$0.nextSibling, _el$10 = _el$1.nextSibling, _el$11 = _el$10.firstChild;
    insert(_el$5, starCount, _el$9, _co$);
    createRenderEffect((_p$) => {
      var _v$ = config.github.repoUrl, _v$2 = config.social.twitter;
      _v$ !== _p$.e && setAttribute(_el$3, "href", _p$.e = _v$);
      _v$2 !== _p$.t && setAttribute(_el$11, "href", _p$.t = _v$2);
      return _p$;
    }, {
      e: void 0,
      t: void 0
    });
    return _el$;
  })();
}

var _tmpl$ = /* @__PURE__ */ template(`<div data-component=legal><span>©<!$><!/> <a href=https://anoma.ly>Anomaly</a></span><span>`);
function Legal() {
  return (() => {
    var _el$ = getNextElement(_tmpl$), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$5 = _el$3.nextSibling, [_el$6, _co$] = getNextMarker(_el$5.nextSibling); _el$6.nextSibling; var _el$7 = _el$2.nextSibling;
    insert(_el$2, () => (/* @__PURE__ */ new Date()).getFullYear(), _el$6, _co$);
    insert(_el$7, createComponent(A, {
      href: "/brand",
      children: "Brand"
    }));
    return _el$;
  })();
}

export { Footer as F, Header as H, Legal as L, config as c, github as g };

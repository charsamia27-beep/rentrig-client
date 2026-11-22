export const THEME_KEY = "rentrig-theme";
export const LIGHT = "rentrig";
export const DARK = "rentrig-dark";

/** Inline script that applies the saved theme before first paint (no flash). */
export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'${DARK}':'${LIGHT}'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`;

// runs in <head> so the theme applies before the page paints
const saved = localStorage.getItem("theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
document.documentElement.setAttribute("data-theme", saved || (prefersLight ? "light" : "dark"));

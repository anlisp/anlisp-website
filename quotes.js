// random philosophy quote + photo, pulled live from Wikiquote and Wikipedia.
// add or remove names below (use the Wikiquote page title).
const PHILOSOPHERS = [
  "Socrates", "Plato", "Aristotle", "Epicurus", "Seneca the Younger",
  "Marcus Aurelius", "Epictetus", "Confucius", "Laozi",
  "René Descartes", "Baruch Spinoza", "Blaise Pascal", "Thomas Hobbes",
  "Jean-Jacques Rousseau", "Voltaire", "David Hume", "Immanuel Kant",
  "Arthur Schopenhauer", "John Stuart Mill", "Karl Marx", "Søren Kierkegaard",
  "Friedrich Nietzsche", "Bertrand Russell", "Ludwig Wittgenstein",
  "Jean-Paul Sartre", "Simone de Beauvoir", "Albert Camus",
  "Hannah Arendt", "Michel Foucault",
];

// used only if wikiquote can't be reached
const FALLBACK = [
  { text: "The unexamined life is not worth living.", by: "Socrates" },
  { text: "I think, therefore I am.", by: "René Descartes" },
  { text: "He who has a why to live can bear almost any how.", by: "Friedrich Nietzsche" },
  { text: "Life can only be understood backwards; but it must be lived forwards.", by: "Søren Kierkegaard" },
  { text: "One must imagine Sisyphus happy.", by: "Albert Camus" },
  { text: "Man is condemned to be free.", by: "Jean-Paul Sartre" },
];

const WIKIQUOTE = "https://en.wikiquote.org/w/api.php";
const WIKIPEDIA = "https://en.wikipedia.org/w/api.php";

const out = document.getElementById("random-out");
const btn = document.getElementById("random-btn");
const cache = {};   // name -> { quotes, photo }
let last = "";

// strip wiki markup from a line of wikitext
function clean(s) {
  s = s.replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, "").replace(/<ref[^>]*\/>/gi, "");
  let prev;
  do { prev = s; s = s.replace(/\{\{[^{}]*\}\}/g, ""); } while (s !== prev);
  return s
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1")
    .replace(/\[(?:https?:)?\/\/\S+\s*([^\]]*)\]/g, "$1")
    .replace(/'{2,}/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// pull the top-level bullet quotes out of a wikiquote page,
// skipping disputed / misattributed / "quotes about" sections
function extractQuotes(wikitext) {
  const skip = /attributed|disputed|unsourced|quotes about|about\b|see also|external|references|further reading|notes/i;
  let ok = true;
  const found = [];

  for (const line of wikitext.split("\n")) {
    const h = line.match(/^(={2,6})\s*(.*?)\s*\1\s*$/);
    if (h) {
      if (h[1].length === 2) ok = !skip.test(h[2]);
      continue;
    }
    if (!ok) continue;

    const m = line.match(/^\*\s+(.+)/);   // "* quote" but not "** source"
    if (!m) continue;

    const q = clean(m[1]);
    if (q.length >= 20 && q.length <= 300 && !/https?:/.test(q) && /[a-z]/i.test(q)) {
      found.push(q);
    }
  }
  return found;
}

async function load(name) {
  if (cache[name]) return cache[name];
  const enc = encodeURIComponent(name);
  const quoteUrl = `${WIKIQUOTE}?action=parse&page=${enc}&prop=wikitext&redirects=1&format=json&formatversion=2&origin=*`;
  const photoUrl = `${WIKIPEDIA}?action=query&titles=${enc}&prop=pageimages&piprop=thumbnail&pithumbsize=400&redirects=1&format=json&formatversion=2&origin=*`;

  const [qData, pData] = await Promise.all([
    fetch(quoteUrl).then(r => r.json()),
    fetch(photoUrl).then(r => r.json()).catch(() => null),
  ]);

  const quotes = extractQuotes(qData.parse.wikitext);
  const page = pData && pData.query && pData.query.pages && pData.query.pages[0];
  const photo = page && page.thumbnail ? page.thumbnail.source : null;

  cache[name] = { quotes, photo };
  return cache[name];
}

function render(name, text, photo, live) {
  out.innerHTML = "";
  out.style.display = "flex";
  out.style.flexWrap = "wrap";
  out.style.gap = "24px";
  out.style.alignItems = "flex-start";

  if (photo) {
    const img = document.createElement("img");
    img.src = photo;
    img.alt = name;
    img.style.width = "180px";
    img.style.filter = "grayscale(1)";   // delete this line for colour
    out.appendChild(img);
  }

  const box = document.createElement("div");
  box.style.flex = "1";
  box.style.minWidth = "240px";

  const p = document.createElement("p");
  p.textContent = text;
  const by = document.createElement("div");
  by.className = "by";
  by.textContent = "- " + name;
  box.append(p, by);

  if (live) {
    const src = document.createElement("div");
    src.className = "by";
    src.style.fontSize = "0.7rem";
    src.style.marginTop = "16px";
    const a = document.createElement("a");
    a.href = "https://en.wikiquote.org/wiki/" + encodeURIComponent(name.replace(/ /g, "_"));
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = "wikiquote";
    src.append("quote from ", a, " (CC BY-SA), photo via wikipedia");
    box.appendChild(src);
  }

  out.appendChild(box);
}

async function show() {
  btn.disabled = true;
  if (!out.children.length) out.textContent = "...";

  for (let attempt = 0; attempt < 4; attempt++) {
    let name;
    do { name = PHILOSOPHERS[Math.floor(Math.random() * PHILOSOPHERS.length)]; }
    while (name === last && PHILOSOPHERS.length > 1);

    try {
      const data = await load(name);
      if (!data.quotes.length) continue;
      last = name;
      const q = data.quotes[Math.floor(Math.random() * data.quotes.length)];
      render(name, q, data.photo, true);
      btn.disabled = false;
      return;
    } catch (e) {
      // try a different philosopher
    }
  }

  const f = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
  render(f.by, f.text, null, false);
  btn.disabled = false;
}

btn.addEventListener("click", show);
show();

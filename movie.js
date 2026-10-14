// picks a random film from watchlist.csv (exported from letterboxd)
// and shows its poster from TMDB (free key: themoviedb.org > settings > api)
const TMDB_KEY = "3eda645ccedde9a6bb3359639bc8e4e1";

const out = document.getElementById("movie-out");
const btn = document.getElementById("movie-btn");
let movies = [];
let last = -1;
let token = 0; // stops a slow poster from a previous roll showing up late

// small csv parser that handles quoted titles with commas
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

async function getPoster(m) {
  if (TMDB_KEY === "YOUR_TMDB_API_KEY") return null;
  try {
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(m.name)}&year=${m.year}`;
    const data = await (await fetch(url)).json();
    const hit = data.results && data.results.find(r => r.poster_path);
    return hit ? `https://image.tmdb.org/t/p/w500${hit.poster_path}` : null;
  } catch (e) {
    return null;
  }
}

async function show() {
  if (!movies.length) return;
  let i;
  do { i = Math.floor(Math.random() * movies.length); } while (i === last && movies.length > 1);
  last = i;
  const m = movies[i];
  const mine = ++token;

  out.innerHTML = "";
  const title = document.createElement("p");
  title.textContent = m.name;
  const year = document.createElement("div");
  year.className = "by";
  year.textContent = m.year;
  const link = document.createElement("a");
  link.href = m.uri;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "view on letterboxd";
  out.append(title, year, link);

  const poster = await getPoster(m);
  if (poster && mine === token) {
    const img = document.createElement("img");
    img.src = poster;
    img.alt = m.name;
    img.style.maxWidth = "300px";
    img.style.marginBottom = "16px";
    out.prepend(img);
  }
}

fetch("watchlist.csv")
  .then(r => { if (!r.ok) throw new Error(); return r.text(); })
  .then(text => {
    const rows = parseCSV(text);
    const head = rows[0].map(h => h.trim());
    const n = head.indexOf("Name"), y = head.indexOf("Year"), u = head.indexOf("Letterboxd URI");
    movies = rows.slice(1).filter(r => r[n]).map(r => ({ name: r[n], year: r[y], uri: r[u] }));
    show();
  })
  .catch(() => { out.textContent = "put watchlist.csv in this folder"; });

btn.addEventListener("click", show);

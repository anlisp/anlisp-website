// each entry becomes a button on the games page.
// for a downloaded game: put it in games/<folder>/ and add
// { name: "snake", href: "games/snake/index.html" }
const GAMES = [
  { name: "quotes", href: "quotes.html" },
  { name: "random movie (from watchlist)", href: "movie.html" },
  { name: "pixel canvas", href: "canvas.html" },
];

const list = document.getElementById("game-list");

GAMES.forEach(g => {
  const a = document.createElement("a");
  a.className = "btn";
  a.href = g.href;
  a.textContent = g.name;
  list.appendChild(a);
});

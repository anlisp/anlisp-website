// each entry becomes a button on the games page.
// for a downloaded game: put it in games/ and add
// { name: "snake", href: "games/snake.html" }
const GAMES = [
  { name: "quotes", href: "quotes.html" },
  { name: "random movie", href: "movie.html" },
  { name: "pixel canvas", href: "canvas.html" },
  { name: "tetris", href: "games/tetris.html" },
  { name: "2048", href: "games/2048.html" },
  { name: "snake", href: "games/snake.html" },
  { name: "minesweeper", href: "games/minesweeper.html" },
  { name: "calculator", href: "games/calculator.html" },
];

const list = document.getElementById("game-list");

GAMES.forEach(g => {
  const a = document.createElement("a");
  a.className = "btn";
  a.href = g.href;
  a.textContent = g.name;
  list.appendChild(a);
});

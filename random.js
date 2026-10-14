// replace these with your own quotes and images.
// images go in images/random/ e.g. { type: "image", src: "images/random/1.jpg" }
const ITEMS = [
  { type: "quote", text: "your first quote here", by: "someone" },
  { type: "quote", text: "your second quote here", by: "someone else" },
  { type: "quote", text: "your third quote here", by: "" },
];

const out = document.getElementById("random-out");
const btn = document.getElementById("random-btn");
let last = -1;

function show() {
  let i;
  do { i = Math.floor(Math.random() * ITEMS.length); } while (i === last && ITEMS.length > 1);
  last = i;
  const item = ITEMS[i];
  out.innerHTML = "";

  if (item.type === "image") {
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = "";
    out.appendChild(img);
  } else {
    const p = document.createElement("p");
    p.textContent = item.text;
    out.appendChild(p);
    if (item.by) {
      const by = document.createElement("div");
      by.className = "by";
      by.textContent = "- " + item.by;
      out.appendChild(by);
    }
  }
}

btn.addEventListener("click", show);
show();

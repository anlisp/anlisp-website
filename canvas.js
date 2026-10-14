const SIZE = 32;   // 32x32 pixels
const CELL = 16;   // each pixel is 16px on the canvas

const canvas = document.getElementById("pixels");
canvas.width = canvas.height = SIZE * CELL;
const ctx = canvas.getContext("2d");

let color = "#000000";
let drawing = false;

function clearCanvas() {
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
clearCanvas();

function paint(e) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / rect.width * SIZE);
  const y = Math.floor((e.clientY - rect.top) / rect.height * SIZE);
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return;
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL, y * CELL, CELL, CELL);
}

canvas.addEventListener("pointerdown", e => { drawing = true; canvas.setPointerCapture(e.pointerId); paint(e); });
canvas.addEventListener("pointermove", e => { if (drawing) paint(e); });
canvas.addEventListener("pointerup", () => { drawing = false; });

// tools
const picker = document.getElementById("color-picker");
picker.addEventListener("input", () => { color = picker.value; });

document.querySelectorAll(".swatch").forEach(s => {
  s.style.background = s.dataset.color;
  s.addEventListener("click", () => { color = s.dataset.color; picker.value = color; });
});

document.getElementById("eraser").addEventListener("click", () => { color = "#ffffff"; });
document.getElementById("clear").addEventListener("click", clearCanvas);
document.getElementById("save").addEventListener("click", () => {
  const a = document.createElement("a");
  a.download = "pixels.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
});

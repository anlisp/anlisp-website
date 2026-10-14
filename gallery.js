// loads "foto (1).ext", "foto (2).ext"... from images/fotos/
// stops at the first number where no extension matches
const FOLDER = "images/fotos/";
const BASE_NAME = "foto";
const EXTENSIONS = ["jpg", "jpeg", "png", "jfif", "webp", "gif"];

const grid = document.getElementById("gallery");

function tryExtensions(n, extIndex) {
  if (extIndex >= EXTENSIONS.length) return;

  const img = new Image();
  img.onload = () => {
    img.alt = "";
    img.loading = "lazy";
    grid.appendChild(img);
    tryExtensions(n + 1, 0);
  };
  img.onerror = () => tryExtensions(n, extIndex + 1);
  img.src = `${FOLDER}${BASE_NAME} (${n}).${EXTENSIONS[extIndex]}`;
}

tryExtensions(1, 0);

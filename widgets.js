// clock, weather and light/dark toggle, added to the bottom of the navbar
const nav = document.querySelector("nav");
const extra = document.createElement("div");
extra.className = "nav-extra";
nav.appendChild(extra);

// theme toggle
const themeLink = document.createElement("a");
themeLink.href = "#";
function setThemeLabel() {
  const current = document.documentElement.getAttribute("data-theme");
  themeLink.textContent = current === "light" ? "dark mode" : "light mode";
}
themeLink.addEventListener("click", e => {
  e.preventDefault();
  const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  setThemeLabel();
});
setThemeLabel();
extra.appendChild(themeLink);

// clock (visitor's own local time)
const clock = document.createElement("div");
extra.appendChild(clock);
function tick() {
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone.replace("_", " ");
  clock.textContent = `${time} ${zone}`;
}
tick();
setInterval(tick, 10000);

// weather (only asks for location if the visitor clicks)
const weatherLink = document.createElement("a");
weatherLink.href = "#";
weatherLink.textContent = "show weather";
extra.appendChild(weatherLink);

const CODES = {
  0: "clear", 1: "mostly clear", 2: "partly cloudy", 3: "overcast",
  45: "fog", 48: "fog", 51: "drizzle", 53: "drizzle", 55: "drizzle",
  61: "rain", 63: "rain", 65: "heavy rain", 71: "snow", 73: "snow", 75: "heavy snow",
  80: "showers", 81: "showers", 82: "heavy showers", 95: "thunderstorm"
};

weatherLink.addEventListener("click", e => {
  e.preventDefault();
  weatherLink.textContent = "locating...";
  navigator.geolocation.getCurrentPosition(async pos => {
    try {
      const f = navigator.language === "en-US" ? "&temperature_unit=fahrenheit" : "";
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current=temperature_2m,weather_code${f}`;
      const data = await (await fetch(url)).json();
      const t = Math.round(data.current.temperature_2m);
      const unit = f ? "F" : "C";
      weatherLink.textContent = `${t}°${unit} ${CODES[data.current.weather_code] || ""}`;
    } catch (err) {
      weatherLink.textContent = "weather unavailable";
    }
  }, () => {
    weatherLink.textContent = "location off";
  });
});

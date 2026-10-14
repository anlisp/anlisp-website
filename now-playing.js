// last.fm now playing
// 1. make an account at last.fm and connect spotify/apple music etc
// 2. get a free api key at https://www.last.fm/api/account/create
const LASTFM_USER = "anlisp";
const LASTFM_KEY = "b44ada98eb6afe4745f4b35b85d042c8";

const box = document.getElementById("now-playing");

async function updateNowPlaying() {
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USER}&api_key=${LASTFM_KEY}&format=json&limit=1`;
    const res = await fetch(url);
    const data = await res.json();
    const t = data.recenttracks.track[0];
    const live = t["@attr"] && t["@attr"].nowplaying === "true";
    const art = t.image && t.image[1] ? t.image[1]["#text"] : "";

    box.innerHTML = "";

    if (art) {
      const img = document.createElement("img");
      img.src = art;
      img.alt = "";
      box.appendChild(img);
    }

    const text = document.createElement("div");
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = live ? "now playing" : "last played";
    const track = document.createElement("div");
    track.className = "track";
    track.textContent = `${t.name} - ${t.artist["#text"]}`;
    text.append(label, track);
    box.appendChild(text);
  } catch (e) {
    box.textContent = "";
  }
}

updateNowPlaying();
setInterval(updateNowPlaying, 30000);

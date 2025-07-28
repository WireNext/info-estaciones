import { Stations } from './stations.js';

const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");
const iframe = document.getElementById("infoFrame");
const warningBanner = document.getElementById("warningBanner");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  suggestionsBox.innerHTML = "";

  if (!query) return;

  const matches = Stations.filter(st =>
    st.name.toLowerCase().includes(query) || st.code.includes(query)
  );

  matches.forEach(station => {
    const div = document.createElement("div");
    div.textContent = `${station.name} (${station.code})`;
    div.onclick = () => {
      searchInput.value = station.name;
      suggestionsBox.innerHTML = "";
      buscarEstacion();
    };
    suggestionsBox.appendChild(div);
  });
});

document.addEventListener("click", (e) => {
  if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
    suggestionsBox.innerHTML = "";
  }
});

function buscarEstacion() {
  const input = searchInput.value.trim().toLowerCase();
  let foundStation = Stations.find(st =>
    st.name.toLowerCase() === input || st.code === input
  );

  if (!foundStation) {
    warningBanner.className = "visible";
    iframe.style.display = "none";
    return;
  }

  const { code, location } = foundStation;

  if (location.lat == null || location.lon == null) {
    warningBanner.className = "visible";
    iframe.style.display = "none";
  } else {
    warningBanner.className = "hidden";
    iframe.src = `https://info.adif.es/?s=${code}`;
    iframe.style.display = "block";
  }
}

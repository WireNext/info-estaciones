import { Stations } from './stations.js';

const searchInput = document.getElementById("stationInput");
const searchButton = document.getElementById("searchButton");
const suggestionsContainer = document.getElementById("suggestions");
const warning = document.getElementById("warning");
const infoFrame = document.getElementById("infoFrame");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  suggestionsContainer.innerHTML = "";

  if (!query) return;

  const filteredStations = Stations.filter(station =>
    station.name.toLowerCase().includes(query) || station.code.includes(query)
  ).slice(0, 5);

  filteredStations.forEach(station => {
    const div = document.createElement("div");
    div.className = "suggestion";
    div.textContent = `${station.name} (${station.code})`;
    div.addEventListener("click", () => {
      searchInput.value = station.name;
      suggestionsContainer.innerHTML = "";
      searchStation(station.name);
    });
    suggestionsContainer.appendChild(div);
  });
});

searchButton.addEventListener("click", () => {
  searchStation(searchInput.value);
});

function searchStation(inputValue) {
  const station = Stations.find(st =>
    st.name.toLowerCase() === inputValue.toLowerCase() ||
    st.code === inputValue
  );

  if (station && station.code && station.location.lat !== null && station.location.lon !== null) {
    const url = `https://info.adif.es/?s=${station.code}`;
    infoFrame.src = url;
    warning.style.display = "none";
  } else {
    infoFrame.src = "";
    warning.style.display = "block";
  }
}

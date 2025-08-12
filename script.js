let Stations = [];

const searchInput = document.getElementById("stationInput");
const searchButton = document.getElementById("searchButton");
const suggestionsContainer = document.getElementById("suggestions");
const warning = document.getElementById("warning");

// Cargar estaciones desde JSON externo
fetch("stations.json")
  .then((res) => res.json())
  .then((data) => {
    Stations = data;
    enableSearch();
  })
  .catch((err) => {
    console.error("Error al cargar estaciones:", err);
    warning.textContent = "Error al cargar las estaciones. Intenta más tarde.";
    warning.style.display = "block";
  });

function enableSearch() {
  searchInput.disabled = false;
  searchButton.disabled = false;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    suggestionsContainer.innerHTML = "";
    warning.style.display = "none";

    if (query.length < 3) return; // Muestra sugerencias solo si se escriben al menos 3 caracteres

    const filteredStations = Stations.filter((station) =>
      station.name.toLowerCase().includes(query) || station.code.includes(query)
    ).slice(0, 6);

    filteredStations.forEach((station) => {
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

  // Oculta las sugerencias si el usuario hace clic fuera de la barra de búsqueda
  document.addEventListener("click", (e) => {
    if (!suggestionsContainer.contains(e.target) && e.target !== searchInput) {
      suggestionsContainer.innerHTML = "";
    }
  });
}

function searchStation(inputValue) {
  const station = Stations.find(
    (st) =>
      st.name.toLowerCase() === inputValue.toLowerCase() ||
      st.code === inputValue
  );

  if (station && station.code) {
    const url = `https://info.adif.es/?s=${station.code}`;
    window.open(url, "_blank");
    warning.style.display = "none";
  } else {
    warning.textContent = "No se ha encontrado ninguna estación válida para esta búsqueda.";
    warning.style.display = "block";
  }
}

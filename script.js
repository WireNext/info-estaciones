let Stations = [];

const searchInput = document.getElementById("stationInput");
const searchButton = document.getElementById("searchButton");
const suggestionsContainer = document.getElementById("suggestions");
const warning = document.getElementById("warning");
const infoFrame = document.getElementById("infoFrame");

// Cargar estaciones desde JSON externo
fetch("stations.json")
  .then((res) => res.json())
  .then((data) => {
    Stations = data;
    enableSearch(); // Solo habilita la búsqueda cuando ya se cargó el JSON
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

    if (!query) return;

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
}

function searchStation(inputValue) {
  const station = Stations.find(
    (st) =>
      st.name.toLowerCase() === inputValue.toLowerCase() ||
      st.code === inputValue
  );

  if (
    station &&
    station.code &&
    station.location.lat !== null &&
    station.location.lon !== null
  ) {
    const url = `https://info.adif.es/?s=${station.code}`;
    infoFrame.src = url;
    warning.style.display = "none";
  } else if (station) {
    // Existe pero no tiene datos de ADIF
    infoFrame.src = "";
    warning.textContent =
      "ADIF no proporciona datos para esta estación.";
    warning.style.display = "block";
  } else {
    // Estación no encontrada
    infoFrame.src = "";
    warning.textContent =
      "No se ha encontrado ninguna estación con ese nombre o código.";
    warning.style.display = "block";
  }
}

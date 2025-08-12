let Stations = [];

const searchInput = document.getElementById("stationInput");
const searchButton = document.getElementById("searchButton");
const suggestionsContainer = document.getElementById("suggestions");
const warning = document.getElementById("warning");
// Eliminamos la referencia a infoFrame ya que no lo usaremos
// const infoFrame = document.getElementById("infoFrame"); 

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
    warning.style.display = "none"; // Ocultar advertencia al escribir
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

  if (station && station.code) {
    const url = `https://info.adif.es/?s=${station.code}`;
    // Aquí es donde cambiamos la lógica: abrimos la URL en una nueva pestaña
    window.open(url, "_blank");
    warning.style.display = "none";
  } else {
    // Si no tiene código o no se encuentra la estación
    warning.textContent = "No se ha encontrado ninguna estación válida para esta búsqueda.";
    warning.style.display = "block";
  }
}

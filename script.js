import { Stations } from './stations.js';

const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");
const iframe = document.getElementById("infoFrame");
const warningBanner = document.getElementById("warningBanner");

// Escucha cuando el usuario escribe
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  suggestionsBox.innerHTML = "";

  if (!query) return;

  // Filtra las estaciones que contienen el texto buscado
  const matches = Stations.filter(st =>
    st.name.toLowerCase().includes(query) || st.code.includes(query)
  );

  // Muestra sugerencias debajo del input
  matches.forEach(station => {
    const option = document.createElement("div");
    option.textContent = `${station.name} (${station.code})`;
    option.onclick = () => {
      // Al hacer clic en una sugerencia, rellena el input
      searchInput.value = station.name;
      suggestionsBox.innerHTML = "";
      buscarEstacion();
    };
    suggestionsBox.appendChild(option);
  });
});

// Cierra las sugerencias si haces clic fuera
document.addEventListener("click", (e) => {
  if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
    suggestionsBox.innerHTML = "";
  }
});

function buscarEstacion() {
  const input = searchInput.value.toLowerCase().trim();
  suggestionsBox.innerHTML = "";

  // Encuentra la estación por nombre exacto o código
  const station = Stations.find(st =>
    st.name.toLowerCase() === input || st.code === input
  );

  if (!station) {
    mostrarAviso("Estación no encontrada.");
    return;
  }

  const { code, location } = station;

  if (location.lat == null || location.lon == null) {
    mostrarAviso("ADIF no proporciona datos para esta estación.");
    return;
  }

  // Si todo está correcto, carga el iframe
  ocultarAviso();
  iframe.src = `https://info.adif.es/?s=${code}`;
  iframe.style.display = "block";
}

function mostrarAviso(texto) {
  warningBanner.textContent = texto;
  warningBanner.classList.add("visible");
  iframe.style.display = "none";
}

function ocultarAviso() {
  warningBanner.classList.remove("visible");
  warningBanner.classList.add("hidden");
}

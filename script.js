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

  const matches = Stations.filter(st =>
    st.name.toLowerCase().includes(query) || st.code.includes(query)
  );

  matches.forEach(station => {
    const option = document.createElement("div");
    option.textContent = `${station.name} (${station.code})`;

    option.onclick = () => {
      searchInput.value = station.code;
      suggestionsBox.innerHTML = "";
      buscarEstacion();
    };

    suggestionsBox.appendChild(option);
  });
});

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
  const input = searchInput.value.trim();
  suggestionsBox.innerHTML = "";

  const station = Stations.find(st =>
    st.code === input || st.name.toLowerCase() === input.toLowerCase()
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

  ocultarAviso();
  iframe.src = `https://info.adif.es/?s=${code}`;
  iframe.style.display = "block";
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

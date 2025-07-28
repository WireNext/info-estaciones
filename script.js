const estaciones = {
  "Castelló": "65300",
  "València Nord": "65000",
  "València Joaquín Sorolla": "03216",
  "Madrid Chamartín": "01000",
  "Madrid Puerta de Atocha": "00100",
  "Barcelona Sants": "71700",
  "Sevilla Santa Justa": "51003",
  "Bilbao-Abando Indalecio Prieto": "13200",
  "Zaragoza Goya": "70807",
  "Málaga María Zambrano": "54413"
};

const searchInput = document.getElementById("searchInput");
const suggestionsBox = document.getElementById("suggestions");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  suggestionsBox.innerHTML = "";

  if (!query) return;

  const matches = Object.keys(estaciones).filter(name =>
    name.toLowerCase().includes(query)
  );

  matches.forEach(name => {
    const div = document.createElement("div");
    div.textContent = name;
    div.onclick = () => {
      searchInput.value = name;
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
  const input = searchInput.value.trim();
  const iframe = document.getElementById("infoFrame");

  if (!input) return;

  if (!isNaN(input)) {
    // Si es un número (código)
    iframe.src = `https://info.adif.es/?s=${input}`;
  } else if (estaciones[input]) {
    // Si coincide con el nombre
    iframe.src = `https://info.adif.es/?s=${estaciones[input]}`;
  } else {
    alert("Estación no encontrada.");
  }
}

const estaciones = {
  "Castelló": "65300",
  "València Nord": "65302",
  "Madrid Chamartín": "01000",
  "Madrid Puerta de Atocha": "00100",
  "Barcelona Sants": "71700",
  "Sevilla Santa Justa": "01030",
  "Alicante": "60900",
  "Bilbao Abando": "12200",
  "Zaragoza Delicias": "78100",
  "Málaga María Zambrano": "50000"
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

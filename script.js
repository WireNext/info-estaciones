let estaciones = [];
const buscador = document.getElementById('buscador');
const sugerencias = document.getElementById('sugerencias');
const pantalla = document.getElementById('pantalla');
let selectedIndex = -1;

function normalizeStr(s) {
  return s
    ? s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    : '';
}

// Cargar estaciones (asegúrate que estaciones.json está en la ruta correcta)
fetch('estaciones.json')
  .then(res => {
    if (!res.ok) throw new Error('No se pudo cargar estaciones.json: ' + res.status);
    return res.json();
  })
  .then(data => {
    estaciones = data.map(e => ({
      ...e,
      _nombreNorm: normalizeStr(e.nombre),
      _codigoStr: (e.codigo || '').toString()
    }));
    // Si el usuario ya había tecleado algo antes de que llegara el fetch, re-disparamos input
    if (buscador.value.trim()) buscador.dispatchEvent(new Event('input'));
  })
  .catch(err => {
    console.error(err);
    sugerencias.innerHTML = `<div style="padding:8px;color:#900">Error cargando estaciones.json (mira la consola)</div>`;
  });

function renderSuggestions(list) {
  sugerencias.innerHTML = '';
  selectedIndex = -1;
  list.forEach((est, i) => {
    const div = document.createElement('div');
    div.textContent = `${est.nombre} (${est.codigo})`;
    div.setAttribute('role', 'option');
    div.addEventListener('click', () => selectStation(est));
    div.addEventListener('mousemove', () => {
      // resaltar al pasar el ratón
      const prev = sugerencias.querySelector('.selected');
      if (prev) prev.classList.remove('selected');
      div.classList.add('selected');
      selectedIndex = i;
    });
    sugerencias.appendChild(div);
  });
}

function selectStation(est) {
  buscador.value = est.nombre;
  sugerencias.innerHTML = '';
  pantalla.src = `https://info.adif.es/?s=${est.codigo}`;
  pantalla.scrollIntoView({ behavior: 'smooth' });
}

buscador.addEventListener('input', () => {
  const texto = normalizeStr(buscador.value.trim());
  if (!texto) {
    sugerencias.innerHTML = '';
    return;
  }

  const palabras = texto.split(/\s+/).filter(Boolean);

  const filtradas = estaciones.filter(e =>
    palabras.every(p => e._nombreNorm.includes(p) || e._codigoStr.includes(p))
  ).slice(0, 12);

  if (filtradas.length) renderSuggestions(filtradas);
  else sugerencias.innerHTML = '<div style="padding:8px">No hay coincidencias</div>';
});

// teclado: flechas + enter
buscador.addEventListener('keydown', (e) => {
  const items = Array.from(sugerencias.children);
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
    updateSelection(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex = Math.max(selectedIndex - 1, 0);
    updateSelection(items);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (selectedIndex >= 0 && items[selectedIndex]) {
      items[selectedIndex].click();
    } else {
      // si no hay selección, elegir la primera coincidencia (UX más amigable)
      items[0].click();
    }
  }
});

function updateSelection(items) {
  items.forEach(it => it.classList.remove('selected'));
  if (selectedIndex >= 0 && items[selectedIndex]) {
    items[selectedIndex].classList.add('selected');
    items[selectedIndex].scrollIntoView({ block: 'nearest' });
  }
}

// ocultar sugerencias al clicar fuera
document.addEventListener('click', (e) => {
  if (!document.querySelector('.search-wrapper').contains(e.target)) {
    sugerencias.innerHTML = '';
  }
});

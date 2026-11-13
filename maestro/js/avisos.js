const avisosProfesorData = [
  {
    id: 1,
    titulo: "Jornada Institucional Docente sin Asistencia",
    emisor: "Dirección General",
    prioridad: "urgente",
    fecha: "13 Nov, 2026",
    texto: "Se convoca a todo el cuerpo docente a la plenaria obligatoria en el salón de actos a partir de las 08:30 hs. Durante la jornada se abordarán los criterios de evaluación final y el cronograma de mesas de examen de diciembre. No habrá dictado de clases para los alumnos."
  },
  {
    id: 2,
    titulo: "Entrega de Calificaciones Trimestrales",
    emisor: "Secretaría Académica",
    prioridad: "advertencia",
    fecha: "11 Nov, 2026",
    texto: "Recordatorio importante: El plazo límite para la carga de notas del tercer trimestre en el sistema digital vence indefectiblemente este viernes a las 18:00 hs. Ante cualquier inconveniente técnico con las actas, comunicarse con Secretaría."
  },
  {
    id: 3,
    titulo: "Revisión de Planillas de Asistencia",
    emisor: "Departamento de Preceptoría",
    prioridad: "general",
    fecha: "09 Nov, 2026",
    texto: "Se solicita a los profesores pasar por preceptoría para firmar los partes diarios correspondientes al mes en curso antes del cierre administrativo semanal."
  },
  {
    id: 4,
    titulo: "Actualización de Protocolo de Salidas Educativas",
    emisor: "Dirección General",
    prioridad: "general",
    fecha: "06 Nov, 2026",
    texto: "Ya se encuentra disponible el nuevo formulario de autorización para proyectos y salidas pedagógicas fuera del establecimiento. Debe presentarse con al menos 15 días de anticipación."
  }
];

// Referencias DOM
const contenedorAvisos = document.getElementById("contenedorAvisos");
const inputBuscar = document.getElementById("inputBuscarAviso");
const filtroEmisor = document.getElementById("filtroEmisor");
const filtroPrioridad = document.getElementById("filtroPrioridad");

// KPIs
const kpiTotal = document.getElementById("kpiTotal");
const kpiUrgente = document.getElementById("kpiUrgente");
const kpiAdvertencia = document.getElementById("kpiAdvertencia");
const kpiGeneral = document.getElementById("kpiGeneral");

// Modal Lectura
const modalLeer = document.getElementById("modalLeerAviso");
const modalBadge = document.getElementById("modalBadge");
const modalFecha = document.getElementById("modalFecha");
const modalTitulo = document.getElementById("modalTitulo");
const modalEmisor = document.getElementById("modalEmisor");
const modalContenido = document.getElementById("modalContenido");

document.addEventListener("DOMContentLoaded", () => {
  renderAvisos();
});

inputBuscar.addEventListener("input", renderAvisos);
filtroEmisor.addEventListener("change", renderAvisos);
filtroPrioridad.addEventListener("change", renderAvisos);

const etiquetasPrioridad = {
  urgente: "Urgente",
  advertencia: "Advertencia",
  general: "Informativo"
};

function renderAvisos() {
  const textoBusqueda = inputBuscar.value.toLowerCase().trim();
  const emisorSeleccionado = filtroEmisor.value;
  const prioridadSeleccionada = filtroPrioridad.value;

  // Actualizar KPIs
  kpiTotal.textContent = avisosProfesorData.length;
  kpiUrgente.textContent = avisosProfesorData.filter(a => a.prioridad === "urgente").length;
  kpiAdvertencia.textContent = avisosProfesorData.filter(a => a.prioridad === "advertencia").length;
  kpiGeneral.textContent = avisosProfesorData.filter(a => a.prioridad === "general").length;

  const filtrados = avisosProfesorData.filter(aviso => {
    const coincideTexto = aviso.titulo.toLowerCase().includes(textoBusqueda) ||
                          aviso.texto.toLowerCase().includes(textoBusqueda) ||
                          aviso.emisor.toLowerCase().includes(textoBusqueda);
    const coincideEmisor = emisorSeleccionado === "todos" || aviso.emisor === emisorSeleccionado;
    const coincidePrioridad = prioridadSeleccionada === "todos" || aviso.prioridad === prioridadSeleccionada;

    return coincideTexto && coincideEmisor && coincidePrioridad;
  });

  contenedorAvisos.innerHTML = "";

  if (filtrados.length === 0) {
    contenedorAvisos.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#64748b; padding:32px;">No hay comunicados disponibles para estos filtros.</p>`;
    return;
  }

  filtrados.forEach(aviso => {
    const card = document.createElement("article");
    card.className = `aviso-card ${aviso.prioridad}`;

    card.innerHTML = `
      <div>
        <div class="aviso-header">
          <span class="aviso-badge">${etiquetasPrioridad[aviso.prioridad]}</span>
          <span class="aviso-fecha"><i class="bi bi-calendar3"></i> ${aviso.fecha}</span>
        </div>
        <h3 class="aviso-title">${aviso.titulo}</h3>
        <p class="aviso-texto">${aviso.texto}</p>
      </div>
      <div class="aviso-footer">
        <span class="aviso-emisor"><i class="bi bi-person-badge-fill"></i> ${aviso.emisor}</span>
        <button type="button" class="btn-leer" onclick="abrirLectura(${aviso.id})">
          <i class="bi bi-eye"></i> Leer más
        </button>
      </div>
    `;
    contenedorAvisos.appendChild(card);
  });
}

// Abrir modal de lectura completa
window.abrirLectura = function(id) {
  const aviso = avisosProfesorData.find(a => a.id === id);
  if (!aviso) return;

  modalBadge.textContent = etiquetasPrioridad[aviso.prioridad];
  modalBadge.className = `aviso-badge ${aviso.prioridad}`;
  modalFecha.innerHTML = `<i class="bi bi-calendar3"></i> ${aviso.fecha}`;
  modalTitulo.textContent = aviso.titulo;
  modalEmisor.innerHTML = `<i class="bi bi-person-badge-fill"></i> Emitido por: ${aviso.emisor}`;
  modalContenido.textContent = aviso.texto;

  modalLeer.classList.remove("hidden");
};

function cerrarModal() {
  modalLeer.classList.add("hidden");
}

document.getElementById("btnCerrarModal").addEventListener("click", cerrarModal);
document.getElementById("btnEntendidoModal").addEventListener("click", cerrarModal);
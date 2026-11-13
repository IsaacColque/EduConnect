let avisosData = [
  {
    id: 1,
    titulo: "Entrega de Proyecto Final de Matemáticas",
    destino: "5° Año 'A'",
    prioridad: "advertencia",
    fecha: "13 Nov, 2026",
    texto: "Se recuerda a los alumnos del curso que la presentación de carpetas y defensa del proyecto impacta en el cierre del trimestre."
  },
  {
    id: 2,
    titulo: "Suspensión de Actividades Turno Mañana",
    destino: "Toda la Institución",
    prioridad: "urgente",
    fecha: "12 Nov, 2026",
    texto: "Por tareas de desinfección y mantenimiento en red eléctrica, el día viernes no se dictarán clases presenciales."
  },
  {
    id: 3,
    titulo: "Autorización Salida Educativa Feria de Ciencias",
    destino: "4° Año 'A'",
    prioridad: "general",
    fecha: "10 Nov, 2026",
    texto: "Los alumnos deberán presentar el talón firmado por padre, madre o tutor en preceptoría antes del miércoles."
  },
  {
    id: 4,
    titulo: "Cierre de Planillas de Asistencia Mensual",
    destino: "Cuerpo Docente",
    prioridad: "advertencia",
    fecha: "08 Nov, 2026",
    texto: "Se solicita verificar las justificaciones pendientes antes de emitir el parte mensual a dirección."
  }
];

let avisoAEliminarId = null;

// Referencias DOM
const contenedorAvisos = document.getElementById("contenedorAvisos");
const inputBuscar = document.getElementById("inputBuscarAviso");
const filtroCurso = document.getElementById("filtroCurso");
const filtroPrioridad = document.getElementById("filtroPrioridad");

// KPIs
const kpiTotal = document.getElementById("kpiTotal");
const kpiUrgente = document.getElementById("kpiUrgente");
const kpiAdvertencia = document.getElementById("kpiAdvertencia");
const kpiGeneral = document.getElementById("kpiGeneral");

// Modales
const modalNuevo = document.getElementById("modalNuevoAviso");
const modalEliminar = document.getElementById("modalEliminar");

document.addEventListener("DOMContentLoaded", () => {
  renderAvisos();
});

// Eventos de filtros
inputBuscar.addEventListener("input", renderAvisos);
filtroCurso.addEventListener("change", renderAvisos);
filtroPrioridad.addEventListener("change", renderAvisos);

// Abrir / Cerrar Modal Nuevo Aviso
document.getElementById("btnNuevoAviso").addEventListener("click", () => {
  modalNuevo.classList.remove("hidden");
});

function cerrarModalNuevo() {
  modalNuevo.classList.add("hidden");
  document.getElementById("formAviso").reset();
}

document.getElementById("btnCerrarModal").addEventListener("click", cerrarModalNuevo);
document.getElementById("btnCancelarModal").addEventListener("click", cerrarModalNuevo);

// Publicar Aviso
document.getElementById("btnGuardarAviso").addEventListener("click", () => {
  const titulo = document.getElementById("tituloAviso").value.trim();
  const destino = document.getElementById("destinoAviso").value;
  const prioridad = document.getElementById("prioridadAviso").value;
  const texto = document.getElementById("contenidoAviso").value.trim();

  if (!titulo || !texto) {
    mostrarToast("Completá el título y el mensaje del comunicado.");
    return;
  }

  const nuevoAviso = {
    id: Date.now(),
    titulo,
    destino,
    prioridad,
    fecha: "13 Nov, 2026",
    texto
  };

  avisosData.unshift(nuevoAviso);
  renderAvisos();
  cerrarModalNuevo();
  mostrarToast("Comunicado publicado correctamente.");
});

// Modal Eliminar
window.solicitarEliminar = function(id) {
  avisoAEliminarId = id;
  modalEliminar.classList.remove("hidden");
};

function cerrarModalEliminar() {
  modalEliminar.classList.add("hidden");
  avisoAEliminarId = null;
}

document.getElementById("btnCerrarEliminar").addEventListener("click", cerrarModalEliminar);
document.getElementById("btnCancelarEliminar").addEventListener("click", cerrarModalEliminar);

document.getElementById("btnConfirmarEliminar").addEventListener("click", () => {
  if (avisoAEliminarId !== null) {
    avisosData = avisosData.filter(a => a.id !== avisoAEliminarId);
    renderAvisos();
    mostrarToast("Comunicado eliminado.");
  }
  cerrarModalEliminar();
});

// Renderizar tarjetas y KPIs
function renderAvisos() {
  const textoBusqueda = inputBuscar.value.toLowerCase().trim();
  const cursoSeleccionado = filtroCurso.value;
  const prioridadSeleccionada = filtroPrioridad.value;

  // Actualizar KPIs
  kpiTotal.textContent = avisosData.length;
  kpiUrgente.textContent = avisosData.filter(a => a.prioridad === "urgente").length;
  kpiAdvertencia.textContent = avisosData.filter(a => a.prioridad === "advertencia").length;
  kpiGeneral.textContent = avisosData.filter(a => a.prioridad === "general").length;

  const filtrados = avisosData.filter(aviso => {
    const coincideTexto = aviso.titulo.toLowerCase().includes(textoBusqueda) ||
                          aviso.texto.toLowerCase().includes(textoBusqueda) ||
                          aviso.destino.toLowerCase().includes(textoBusqueda);
    const coincideCurso = cursoSeleccionado === "todos" || aviso.destino === cursoSeleccionado;
    const coincidePrioridad = prioridadSeleccionada === "todos" || aviso.prioridad === prioridadSeleccionada;

    return coincideTexto && coincideCurso && coincidePrioridad;
  });

  contenedorAvisos.innerHTML = "";

  if (filtrados.length === 0) {
    contenedorAvisos.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#64748b; padding:32px;">No hay avisos que coincidan con los filtros seleccionados.</p>`;
    return;
  }

  const etiquetasPrioridad = {
    urgente: "Urgente",
    advertencia: "Advertencia",
    general: "Informativo"
  };

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
        <span class="aviso-destino"><i class="bi bi-people-fill"></i> ${aviso.destino}</span>
        <button type="button" class="btn-eliminar" onclick="solicitarEliminar(${aviso.id})" title="Eliminar comunicado">
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    `;
    contenedorAvisos.appendChild(card);
  });
}

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}
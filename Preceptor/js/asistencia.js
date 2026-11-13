// Datos de ejemplo por curso (luego podés reemplazarlo por tu fetch a una API o base de datos)
const cursosData = {
  "5A": [
    
    { id: 101, dni: "46.812.340", nombre: "Acosta, Valentina", porcentaje: 96, estado: "presente", observacion: "" },
    { id: 102, dni: "46.905.112", nombre: "Benítez, Mateo", porcentaje: 88, estado: "ausente", observacion: "Sin aviso" },
    { id: 103, dni: "46.744.890", nombre: "Carrizo, Sofía", porcentaje: 94, estado: "presente", observacion: "" },
    { id: 104, dni: "47.012.554", nombre: "Díaz, Lautaro", porcentaje: 82, estado: "tardanza", observacion: "Ingresó 07:45 hs" },
    { id: 105, dni: "46.889.021", nombre: "Fernández, Camila", porcentaje: 98, estado: "presente", observacion: "" },
    { id: 106, dni: "46.933.410", nombre: "Gómez, Thiago", porcentaje: 91, estado: "justificado", observacion: "Certificado odontológico" }
    ,{ id: 107, dni: "46.813.340", nombre: "Acosta, Valentina", porcentaje: 96, estado: "presente", observacion: "" },
    { id: 108, dni: "46.906.112", nombre: "Benítez2, Mateo", porcentaje: 88, estado: "ausente", observacion: "Sin aviso" },
    { id: 109, dni: "46.745.890", nombre: "Carrizo2, Sofía", porcentaje: 94, estado: "presente", observacion: "" },
    { id: 110, dni: "47.013.554", nombre: "Díaz2, Lautaro", porcentaje: 82, estado: "tardanza", observacion: "Ingresó 07:45 hs" },
    { id: 111, dni: "46.890.021", nombre: "Fernández2, Camila", porcentaje: 98, estado: "presente", observacion: "" },
    { id: 112, dni: "46.934.410", nombre: "Gómez2, Thiago", porcentaje: 91, estado: "justificado", observacion: "Certificado odontológico" }
  
  ],
  "5B": [
    { id: 201, dni: "46.710.223", nombre: "Herrera, Lucía", porcentaje: 95, estado: "presente", observacion: "" },
    { id: 202, dni: "46.854.990", nombre: "Luna, Benjamín", porcentaje: 85, estado: "presente", observacion: "" },
    { id: 203, dni: "46.901.778", nombre: "Molina, Martina", porcentaje: 79, estado: "ausente", observacion: "" }
  ],
  "4A": [
    { id: 301, dni: "47.512.880", nombre: "Peralta, Joaquín", porcentaje: 92, estado: "presente", observacion: "" },
    { id: 302, dni: "47.620.114", nombre: "Quiroga, Alma", porcentaje: 97, estado: "presente", observacion: "" }
  ],
  "3C": [
    { id: 401, dni: "48.311.009", nombre: "Ríos, Bautista", porcentaje: 90, estado: "presente", observacion: "" },
    { id: 402, dni: "48.409.654", nombre: "Sosa, Emilia", porcentaje: 93, estado: "tardanza", observacion: "Transporte demorado" }
  ]
};

let cursoActual = "5A";
let alumnoEditandoId = null;

// Referencias al DOM
const selectCurso = document.getElementById("selectCurso");
const inputFecha = document.getElementById("inputFecha");
const inputBuscar = document.getElementById("inputBuscar");
const filtroEstado = document.getElementById("filtroEstado");
const tablaBody = document.getElementById("tablaAlumnosBody");

// KPIs
const kpiTotal = document.getElementById("kpiTotal");
const kpiPresentes = document.getElementById("kpiPresentes");
const kpiAusentes = document.getElementById("kpiAusentes");
const kpiOtros = document.getElementById("kpiOtros");
const textoResumen = document.getElementById("textoResumenRegistro");

// Modal
const modal = document.getElementById("modalObservacion");
const modalAlumnoNombre = document.getElementById("modalAlumnoNombre");
const modalEstadoSelect = document.getElementById("modalEstadoSelect");
const modalMotivoInput = document.getElementById("modalMotivoInput");

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  renderTabla();
});

// Eventos de filtros
selectCurso.addEventListener("change", (e) => {
  cursoActual = e.target.value;
  renderTabla();
});

inputBuscar.addEventListener("input", renderTabla);
filtroEstado.addEventListener("change", renderTabla);

// Marcar todos presentes
document.getElementById("btnTodosPresentes").addEventListener("click", () => {
  cursosData[cursoActual].forEach(alumno => {
    alumno.estado = "presente";
    alumno.observacion = "";
  });
  renderTabla();
  mostrarToast("Todos los alumnos fueron marcados como Presentes.");
});

// Guardar parte diario
document.getElementById("btnGuardarAsistencia").addEventListener("click", () => {
  const fecha = inputFecha.value;
  // Aquí iría tu petición fetch() POST hacia el backend
  console.log("Guardando asistencia:", { curso: cursoActual, fecha, alumnos: cursosData[cursoActual] });
  mostrarToast(`Parte diario del ${fecha} guardado correctamente.`);
});

// Exportar CSV
document.getElementById("btnExportar").addEventListener("click", () => {
  const lista = cursosData[cursoActual];
  let csv = "DNI,Alumno,Estado,Observacion\n";
  lista.forEach(a => {
    csv += `"${a.dni}","${a.nombre}","${a.estado.toUpperCase()}","${a.observacion}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Asistencia_${cursoActual}_${inputFecha.value}.csv`;
  link.click();
});

// Renderizar tabla y actualizar contadores
function renderTabla() {
  const listaCompleta = cursosData[cursoActual] || [];
  const textoBusqueda = inputBuscar.value.toLowerCase().trim();
  const estadoFiltro = filtroEstado.value;

  actualizarKPIs(listaCompleta);

  const filtrados = listaCompleta.filter(alumno => {
    const coincideTexto = alumno.nombre.toLowerCase().includes(textoBusqueda) || alumno.dni.includes(textoBusqueda);
    const coincideEstado = estadoFiltro === "todos" || alumno.estado === estadoFiltro;
    return coincideTexto && coincideEstado;
  });

  tablaBody.innerHTML = "";

  if (filtrados.length === 0) {
    tablaBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:#64748b;">No se encontraron alumnos con esos filtros.</td></tr>`;
    textoResumen.textContent = "0 alumnos mostrados";
    return;
  }

  filtrados.forEach(alumno => {
    const iniciales = alumno.nombre.split(" ").map(p => p[0]).slice(0, 2).join("");
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><strong>${alumno.dni}</strong></td>
      <td>
        <div class="student-cell">
          <div class="avatar-circle">${iniciales}</div>
          <span>${alumno.nombre}</span>
        </div>
      </td>
      <td><strong>${alumno.porcentaje}%</strong></td>
      <td>
        <div class="status-pills">
          <button class="pill-btn ${alumno.estado === 'presente' ? 'active' : ''}" data-status="presente" onclick="cambiarEstado(${alumno.id}, 'presente')">P</button>
          <button class="pill-btn ${alumno.estado === 'ausente' ? 'active' : ''}" data-status="ausente" onclick="cambiarEstado(${alumno.id}, 'ausente')">A</button>
          <button class="pill-btn ${alumno.estado === 'tardanza' ? 'active' : ''}" data-status="tardanza" onclick="cambiarEstado(${alumno.id}, 'tardanza')">T</button>
          <button class="pill-btn ${alumno.estado === 'justificado' ? 'active' : ''}" data-status="justificado" onclick="cambiarEstado(${alumno.id}, 'justificado')">J</button>
        </div>
      </td>
      <td><div class="obs-text" title="${alumno.observacion}">${alumno.observacion || "—"}</div></td>
      <td class="text-right">
        <button class="btn-action-note" onclick="abrirModal(${alumno.id})">
          <i class="bi bi-pencil-square"></i> Detalle
        </button>
      </td>
    `;
    tablaBody.appendChild(tr);
  });

  textoResumen.textContent = `Mostrando ${filtrados.length} de ${listaCompleta.length} alumnos`;
}

function actualizarKPIs(lista) {
  kpiTotal.textContent = lista.length;
  kpiPresentes.textContent = lista.filter(a => a.estado === "presente").length;
  kpiAusentes.textContent = lista.filter(a => a.estado === "ausente").length;
  kpiOtros.textContent = lista.filter(a => a.estado === "tardanza" || a.estado === "justificado").length;
}

// Cambiar estado rápido desde los botones P / A / T / J
window.cambiarEstado = function(id, nuevoEstado) {
  const alumno = cursosData[cursoActual].find(a => a.id === id);
  if (alumno) {
    alumno.estado = nuevoEstado;
    renderTabla();
  }
};

// Lógica del Modal
window.abrirModal = function(id) {
  const alumno = cursosData[cursoActual].find(a => a.id === id);
  if (!alumno) return;

  alumnoEditandoId = id;
  modalAlumnoNombre.textContent = `${alumno.nombre} (DNI: ${alumno.dni})`;
  modalEstadoSelect.value = alumno.estado;
  modalMotivoInput.value = alumno.observacion;
  modal.classList.remove("hidden");
};

function cerrarModal() {
  modal.classList.add("hidden");
  alumnoEditandoId = null;
}

document.getElementById("btnCerrarModal").addEventListener("click", cerrarModal);
document.getElementById("btnCancelarModal").addEventListener("click", cerrarModal);

document.getElementById("btnGuardarModal").addEventListener("click", () => {
  const alumno = cursosData[cursoActual].find(a => a.id === alumnoEditandoId);
  if (alumno) {
    alumno.estado = modalEstadoSelect.value;
    alumno.observacion = modalMotivoInput.value.trim();
    renderTabla();
    mostrarToast("Observación actualizada.");
  }
  cerrarModal();
});

function mostrarToast(mensaje) {
  const toast = document.getElementById("toast");
  toast.textContent = mensaje;
  toast.classList.remove("hidden");
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}
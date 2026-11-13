//  Perfil del alumno - Editar y guardar 
const CLAVE = "perfil_alumno_isaac";   // clave en localStorage

const $ = (id) => document.getElementById(id);

// Datos por defecto
const datosDefault = {
    nombre:  "Isaac Colque",
    email:   "isaccolque37@gmail.com",
    telefono:"+54 3825 410060",
    fecha:   "2007-09-24"          // formato yyyy-mm-dd para <input type="date">
};

// Utilidades
const iniciales = (nombre) =>
    nombre.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase();

const fechaBonita = (iso) => {
    if (!iso) return "";
    const [a, m, d] = iso.split("-");
    const meses = ["enero","febrero","marzo","abril","mayo","junio","julio",
                   "agosto","septiembre","octubre","noviembre","diciembre"];
    return `${Number(d)} de ${meses[Number(m) - 1]} de ${a}`;
};

function mostrarAviso(texto) {
    let toast = document.querySelector(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${texto}`;
    toast.classList.add("visible");
    setTimeout(() => toast.classList.remove("visible"), 2800);
}

// Pintar los datos en la página
function pintarPerfil(d) {
    $("profile-name").textContent  = d.nombre;
    $("profile-email").textContent = d.email;
    $("user-name").textContent     = "¡Hola, " + d.nombre + "!";

    $("profile-avatar").textContent = iniciales(d.nombre);

    $("detail-nombre").textContent   = d.nombre;
    $("detail-email").textContent    = d.email;
    $("detail-telefono").textContent = d.telefono;
    $("detail-fecha").textContent    = fechaBonita(d.fecha);
}

// Cargar datos guardados (o los de ejemplo)
function cargarPerfil() {
    let datos = datosDefault;
    try {
        const guardado = localStorage.getItem(CLAVE);
        if (guardado) datos = { ...datosDefault, ...JSON.parse(guardado) };
    } catch (e) { /* si falla, usamos los de ejemplo */ }

    pintarPerfil(datos);

    // Rellenar el modal con los datos actuales
    $("input-nombre").value   = datos.nombre;
    $("input-email").value    = datos.email;
    $("input-telefono").value = datos.telefono;
    $("input-fecha").value    = datos.fecha;
}

// Abrir / cerrar modales
function abrirModal(id)  { $(id).classList.add("abierto"); }
function cerrarModal(m)  { m.classList.remove("abierto"); }

document.getElementById("btn-editar-perfil")
    .addEventListener("click", () => abrirModal("modal-editar-perfil"));

document.getElementById("btn-cambiar-clave")
    .addEventListener("click", () => abrirModal("modal-cambiar-clave"));

document.querySelectorAll(".modal-overlay").forEach(modal => {
    modal.querySelector(".close-btn").addEventListener("click", () => cerrarModal(modal));
    modal.querySelector(".btn-cancelar").addEventListener("click", () => cerrarModal(modal));
    modal.addEventListener("click", e => { if (e.target === modal) cerrarModal(modal); });
});

document.addEventListener("keydown", e => {
    if (e.key === "Escape")
        document.querySelectorAll(".modal-overlay.abierto").forEach(cerrarModal);
});

// Guardar cambios del perfil
document.getElementById("form-editar-perfil").addEventListener("submit", e => {
    e.preventDefault();

    const datos = {
        nombre:   $("input-nombre").value.trim(),
        email:    $("input-email").value.trim(),
        telefono: $("input-telefono").value.trim(),
        fecha:    $("input-fecha").value
    };

    if (datos.nombre.length < 3) { alert("Ingresá tu nombre completo."); return; }

    localStorage.setItem(CLAVE, JSON.stringify(datos));  // persiste
    pintarPerfil(datos);
    cerrarModal($("modal-editar-perfil"));
    mostrarAviso("Perfil actualizado correctamente");
});

// Cambiar contraseña
document.getElementById("form-cambiar-clave").addEventListener("submit", e => {
    e.preventDefault();

    const actual = $("clave-actual").value;
    const nueva  = $("clave-nueva").value;
    const repetir= $("clave-repetir").value;

    if (nueva.length < 6) { alert("La nueva contraseña debe tener al menos 6 caracteres."); return; }
    if (nueva !== repetir){ alert("Las contraseñas no coinciden."); return; }

    e.target.reset();
    cerrarModal($("modal-cambiar-clave"));
    mostrarAviso("Contraseña actualizada");
});

// Arranque 
cargarPerfil();
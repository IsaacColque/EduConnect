const roleSelect = document.getElementById('role');

const camposEstudiante = document.getElementById('camposEstudiante');
const anioInput = document.getElementById('anio');
const divisionInput = document.getElementById('division');

const camposProfesor = document.getElementById('camposProfesor');
const materiaInput = document.getElementById('materia');

// Mostrar u ocultar los campos según el rol
function actualizarCampos() {

    const rol = roleSelect.value;

    // Campos del estudiante
    if (rol === 'estudiante') {

        camposEstudiante.style.display = 'flex';

        anioInput.required = true;
        divisionInput.required = true;

    } else {

        camposEstudiante.style.display = 'none';

        anioInput.required = false;
        divisionInput.required = false;

        anioInput.value = '';
        divisionInput.value = '';
    }

    // Campos del profesor
    if (rol === 'profesor') {

        camposProfesor.style.display = 'block';
        materiaInput.required = true;

    } else {

        camposProfesor.style.display = 'none';

        materiaInput.required = false;
        materiaInput.value = '';
    }
}

// Detectar cuando cambia el rol
roleSelect.addEventListener('change', actualizarCampos);

// Ejecutar al cargar la página
actualizarCampos();
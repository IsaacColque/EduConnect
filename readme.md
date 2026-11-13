//codigo de alumno
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Cursos - EduConnect</title>
    <!-- Fuentes y Font Awesome -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="stylesheet" href="css/sidebar.css">
    <link rel="stylesheet" href="css/mis_cursos.css">
    <link rel="icon" type="image/png" href="imagenes/icono4.png">

    <!-- Estilos adicionales únicamente para la vista de detalle y pestañas internas -->
    <style>
        .hidden {
            display: none !important;
        }

        .course-detail-view {
            background: #ffffff;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
            margin-top: 15px;
            animation: fadeIn 0.25s ease-in-out;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .detail-top-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
            border-bottom: 1px solid #eef0f5;
            padding-bottom: 18px;
            margin-bottom: 20px;
        }

        .btn-back {
            background: #f3f5f9;
            border: 1px solid #dce1eb;
            color: #333;
            padding: 8px 16px;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            transition: background 0.2s;
        }

        .btn-back:hover {
            background: #e5e9f2;
        }

        .detail-course-info h3 {
            margin: 0;
            font-size: 20px;
            color: #1e293b;
        }

        .detail-course-info p {
            margin: 3px 0 0;
            font-size: 14px;
            color: #64748b;
        }

        /* Pestañas internas (Tareas, Evaluaciones, TP, etc.) */
        .detail-tabs {
            display: flex;
            gap: 10px;
            border-bottom: 2px solid #f1f5f9;
            margin-bottom: 20px;
            overflow-x: auto;
        }

        .tab-btn {
            background: none;
            border: none;
            padding: 10px 18px;
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            font-weight: 500;
            color: #64748b;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            margin-bottom: -2px;
            transition: all 0.2s;
            white-space: nowrap;
        }

        .tab-btn:hover {
            color: #0d6efd;
        }

        .tab-btn.active {
            color: #0d6efd;
            border-bottom-color: #0d6efd;
            font-weight: 600;
        }

        /* Lista de actividades */
        .activity-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .activity-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 18px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            background: #fafbfc;
            flex-wrap: wrap;
            gap: 10px;
        }

        .activity-info h4 {
            margin: 0 0 4px;
            font-size: 15px;
            color: #1e293b;
        }

        .activity-info span {
            font-size: 13px;
            color: #64748b;
        }

        .badge {
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
        }

        .badge-pendiente { background: #fff3cd; color: #856404; }
        .badge-proximo { background: #cfe2ff; color: #084298; }
        .badge-entregado { background: #d1e7dd; color: #0f5132; }
    </style>
</head>
<body>

    <!-- CONTENEDOR PRINCIPAL -->
    <div class="dashboard-container">
        
        <!-- Sidebar lateral -->
        <aside class="sidebar" id="sidebar">
            <div class="logo-container">
                <img src="imagenes/Estilos3/LogoEduConnect.jpeg" class="logo" alt="Logo de EduConnect">
            </div>
            
            <ul class="menu">
                <li>
                    <a href="Interfaz_Menu.html">
                        <i class="fa-solid fa-house"></i>
                        <span>Inicio</span>
                    </a>
                </li>
                <li class="activo">
                    <a href="mis_cursos.html">
                        <i class="fa-solid fa-book"></i>
                        <span>Cursos</span>
                    </a>
                </li>
                <li>
                    <a href="sistema_calificaciones.html">
                        <i class="fa-regular fa-clipboard"></i>
                        <span>Calificaciones</span>
                    </a>
                </li>
                <li>
                    <a href="avisos.html">
                        <i class="fa-regular fa-bell"></i>
                        <span>Avisos</span>
                    </a>
                </li>
                <li>
                    <a href="eventos.html">
                        <i class="fa-regular fa-calendar"></i>
                        <span>Eventos</span>
                    </a>
                </li>
                <li>
                    <a href="mensaje.html">
                        <i class="fa-regular fa-message"></i>
                        <span>Mensajes</span>
                    </a>
                </li>
                <li>
                    <a href="perfil.html">
                        <i class="fa-regular fa-user"></i>
                        <span>Perfil</span>
                    </a>
                </li>
                <li>
                    <a href="configuracion.html">
                        <i class="fa-solid fa-gear"></i>
                        <span>Configuración</span>
                    </a>
                </li>
            </ul>
            <div class="salir">
                <a href="iniciar_sesion.html">
                    <i class="fa-solid fa-right-from-bracket"></i>
                    <span>Cerrar sesión</span>
                </a>
            </div>
        </aside>

        <!-- Contenido Principal -->
        <main class="main-content">
            <!-- Barra superior limpia (idéntica a Interfaz_Menu.html) -->
            <header class="top-bar">
                <div class="navbar-left">
                    <button class="hamburger-btn" id="menu-btn" type="button" aria-label="Abrir menú">
                        <i class="fa-solid fa-bars"></i>
                    </button>
                </div>
                <div class="navbar-right">
                    <div class="user-profile-top">
                        <div class="user-info-text">
                            <span class="user-name"> Isaac Colque </span>
                            <span class="user-role">Estudiante</span>
                        </div>
                        <div class="avatar-container"><i class="fa-solid fa-circle-user"></i></div>
                    </div>
                </div>
            </header>

            <!-- Cuerpo principal de la página -->
            <div class="content-body page-body">
                
                <!-- Encabezado de la sección movido hacia abajo -->
                <div class="calendar-header-panel">
                    <h2>Panel de Cursos - EduConnect</h2>
                    <span class="user-role" style="font-size: 14px; font-weight: 500;">Ciclo Lectivo: 2026</span>
                </div>

                <!-- VISTA 1: LISTA DE CURSOS (La que ya tenías) -->
                <div id="courses-list-view">
                    <!-- Barra de búsqueda -->
                    <div class="search-bar-container">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="search-input" placeholder="Buscar cursos...">
                    </div>

                    <!-- Cuadrícula de Tarjetas de Cursos -->
                    <div class="courses-grid">
                        <!-- Tarjeta 1: Matemáticas -->
                        <div class="course-card" data-course="matematicas">
                            <div class="course-icon azul-claro"><i class="fa-solid fa-chart-line"></i></div>
                            <h3>Matemáticas V</h3>
                            <p class="teacher-name">Prof. García</p>
                            <div class="progress-info">
                                <span>75% completado</span>
                            </div>
                            <div class="progress-bar"><div class="progress-fill" style="width: 75%;"></div></div>
                            <button class="btn-details" onclick="abrirDetalleCurso('matematicas')">Ver detalles</button>
                        </div>

                        <!-- Tarjeta 2: Lengua -->
                        <div class="course-card" data-course="lengua">
                            <div class="course-icon naranja"><i class="fa-solid fa-book-open"></i></div>
                            <h3>Lengua y Literatura IV</h3>
                            <p class="teacher-name">Prof. García IV</p>
                            <div class="progress-info">
                                <span>75% completado</span>
                            </div>
                            <div class="progress-bar"><div class="progress-fill" style="width: 75%;"></div></div>
                            <button class="btn-details" onclick="abrirDetalleCurso('lengua')">Ver detalles</button>
                        </div>

                        <!-- Tarjeta 3: Física -->
                        <div class="course-card" data-course="fisica">
                            <div class="course-icon verde"><i class="fa-solid fa-atom"></i></div>
                            <h3>Física II</h3>
                            <p class="teacher-name">Prof. García</p>
                            <div class="progress-info">
                                <span>75% completado</span>
                            </div>
                            <div class="progress-bar"><div class="progress-fill" style="width: 75%;"></div></div>
                            <button class="btn-details" onclick="abrirDetalleCurso('fisica')">Ver detalles</button>
                        </div>

                        <!-- Tarjeta 4: Historia -->
                        <div class="course-card" data-course="historia">
                            <div class="course-icon rojo"><i class="fa-solid fa-landmark"></i></div>
                            <h3>Historia III</h3>
                            <p class="teacher-name">Prof. García</p>
                            <div class="progress-info">
                                <span>75% completado</span>
                            </div>
                            <div class="progress-bar"><div class="progress-fill" style="width: 75%;"></div></div>
                            <button class="btn-details" onclick="abrirDetalleCurso('historia')">Ver detalles</button>
                        </div>
                    </div>
                </div>

                <!-- VISTA 2: DETALLE DEL CURSO EN LA MISMA PESTAÑA -->
                <div id="course-detail-view" class="course-detail-view hidden">
                    <div class="detail-top-bar">
                        <div class="detail-course-info">
                            <h3 id="detail-title">Nombre del Curso</h3>
                            <p id="detail-teacher">Docente</p>
                        </div>
                        <button class="btn-back" onclick="volverACursos()">
                            <i class="fa-solid fa-arrow-left"></i> Volver a mis cursos
                        </button>
                    </div>

                    <!-- Pestañas internas -->
                    <div class="detail-tabs">
                        <button class="tab-btn active" onclick="cambiarTab('tareas', this)">
                            <i class="fa-solid fa-list-check"></i> Tareas pendientes
                        </button>
                        <button class="tab-btn" onclick="cambiarTab('evaluaciones', this)">
                            <i class="fa-solid fa-file-signature"></i> Evaluaciones
                        </button>
                        <button class="tab-btn" onclick="cambiarTab('practicos', this)">
                            <i class="fa-solid fa-flask"></i> Trabajos Prácticos
                        </button>
                        <button class="tab-btn" onclick="cambiarTab('material', this)">
                            <i class="fa-solid fa-folder-open"></i> Material de estudio
                        </button>
                    </div>

                    <!-- Contenedor dinámico del contenido de cada pestaña -->
                    <div id="tab-content-container" class="activity-list">
                        <!-- Se llena automáticamente con JavaScript -->
                    </div>
                </div>

            </div>
        </main>
    </div>

    <!-- SCRIPTS -->
    <script>
        // 1. Botón Hamburguesa (Tu código original)
        const menuBtn = document.getElementById('menu-btn');
        const sidebar = document.getElementById('sidebar');

        if (menuBtn && sidebar) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
            });
        }

        // 2. Base de datos simulada de cada curso (Puedes conectarlo a tu backend/PHP/JSON después)
        const datosCursos = {
            matematicas: {
                titulo: "Matemáticas V",
                profesor: "Prof. García • Progreso: 75%",
                tareas: [
                    { titulo: "Guía de ejercicios: Derivadas e Integrales", fecha: "Vence: 18 Nov 2026", estado: "Pendiente", claseBadge: "badge-pendiente" },
                    { titulo: "Resolución de límites indeterminados", fecha: "Vence: 22 Nov 2026", estado: "Pendiente", claseBadge: "badge-pendiente" }
                ],
                evaluaciones: [
                    { titulo: "Parcial N° 2: Cálculo Diferencial", fecha: "Fecha: 25 Nov 2026 - 08:00 hs", estado: "Próxima", claseBadge: "badge-proximo" },
                    { titulo: "Parcial N° 1: Funciones", fecha: "Realizado", estado: "Aprobado (8.5)", claseBadge: "badge-entregado" }
                ],
                practicos: [
                    { titulo: "TP N° 4: Aplicación de derivadas en optimización", fecha: "Entrega: 28 Nov 2026", estado: "Pendiente", claseBadge: "badge-pendiente" }
                ],
                material: [
                    { titulo: "PDF: Tabla de Derivadas e Integrales", fecha: "Subido hace 1 semana", estado: "Disponible", claseBadge: "badge-proximo" }
                ]
            },
            lengua: {
                titulo: "Lengua y Literatura IV",
                profesor: "Prof. García IV • Progreso: 75%",
                tareas: [
                    { titulo: "Análisis literario: Realismo Mágico", fecha: "Vence: 19 Nov 2026", estado: "Pendiente", claseBadge: "badge-pendiente" }
                ],
                evaluaciones: [
                    { titulo: "Examen Oral: Vanguardias Latinoamericanas", fecha: "Fecha: 26 Nov 2026", estado: "Próxima", claseBadge: "badge-proximo" }
                ],
                practicos: [
                    { titulo: "TP N° 3: Ensayo argumentativo", fecha: "Entrega: 30 Nov 2026", estado: "En curso", claseBadge: "badge-pendiente" }
                ],
                material: [
                    { titulo: "Antología de cuentos seleccionados (PDF)", fecha: "Subido hace 2 semanas", estado: "Disponible", claseBadge: "badge-proximo" }
                ]
            },
            fisica: {
                titulo: "Física II",
                profesor: "Prof. García • Progreso: 75%",
                tareas: [
                    { titulo: "Problemas de Electromagnetismo y Ley de Ohm", fecha: "Vence: 17 Nov 2026", estado: "Pendiente", claseBadge: "badge-pendiente" }
                ],
                evaluaciones: [
                    { titulo: "Evaluación Escrita: Circuitos Eléctricos", fecha: "Fecha: 24 Nov 2026", estado: "Próxima", claseBadge: "badge-proximo" }
                ],
                practicos: [
                    { titulo: "TP Laboratorio: Medición de resistencias en serie y paralelo", fecha: "Entrega: 27 Nov 2026", estado: "Pendiente", claseBadge: "badge-pendiente" }
                ],
                material: [
                    { titulo: "Guía de fórmulas de Física II", fecha: "Subido el 02 Nov", estado: "Disponible", claseBadge: "badge-proximo" }
                ]
            },
            historia: {
                titulo: "Historia III",
                profesor: "Prof. García • Progreso: 75%",
                tareas: [
                    { titulo: "Cuestionario: Revolución Industrial y consecuencias sociales", fecha: "Vence: 20 Nov 2026", estado: "Pendiente", claseBadge: "badge-pendiente" }
                ],
                evaluaciones: [
                    { titulo: "Parcial Integrador: Siglo XX", fecha: "Fecha: 01 Dic 2026", estado: "Próxima", claseBadge: "badge-proximo" }
                ],
                practicos: [
                    { titulo: "TP Grupal: Línea de tiempo Guerra Fría", fecha: "Entrega: 29 Nov 2026", estado: "Pendiente", claseBadge: "badge-pendiente" }
                ],
                material: [
                    { titulo: "Documental y apuntes de cátedra", fecha: "Subido hace 3 días", estado: "Disponible", claseBadge: "badge-proximo" }
                ]
            }
        };

        let cursoActual = null;

        // 3. Cambiar de la cuadrícula de cursos al detalle en la misma ventana
        function abrirDetalleCurso(idCurso) {
            cursoActual = datosCursos[idCurso];
            if (!cursoActual) return;

            document.getElementById('detail-title').textContent = cursoActual.titulo;
            document.getElementById('detail-teacher').textContent = cursoActual.profesor;

            // Ocultar lista y mostrar detalle
            document.getElementById('courses-list-view').classList.add('hidden');
            document.getElementById('course-detail-view').classList.remove('hidden');

            // Activar primera pestaña por defecto ("tareas")
            const botonesTab = document.querySelectorAll('.tab-btn');
            botonesTab.forEach(btn => btn.classList.remove('active'));
            botonesTab[0].classList.add('active');

            renderizarContenidoTab('tareas');
        }

        // 4. Volver a la vista de tarjetas
        function volverACursos() {
            document.getElementById('course-detail-view').classList.add('hidden');
            document.getElementById('courses-list-view').classList.remove('hidden');
        }

        // 5. Cambiar entre pestañas (Tareas, Evaluaciones, TP, Material)
        function cambiarTab(categoria, botonElemento) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            botonElemento.classList.add('active');
            renderizarContenidoTab(categoria);
        }

        function renderizarContenidoTab(categoria) {
            const contenedor = document.getElementById('tab-content-container');
            const items = cursoActual[categoria] || [];

            if (items.length === 0) {
                contenedor.innerHTML = `<p style="color:#64748b; padding: 15px 0;">No hay elementos registrados en esta sección.</p>`;
                return;
            }

            contenedor.innerHTML = items.map(item => `
                <div class="activity-item">
                    <div class="activity-info">
                        <h4>${item.titulo}</h4>
                        <span>${item.fecha}</span>
                    </div>
                    <span class="badge ${item.claseBadge}">${item.estado}</span>
                </div>
            `).join('');
        }

        // 6. Buscador en tiempo real para las tarjetas
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const texto = e.target.value.toLowerCase();
                document.querySelectorAll('.course-card').forEach(card => {
                    const titulo = card.querySelector('h3').textContent.toLowerCase();
                    const profe = card.querySelector('.teacher-name').textContent.toLowerCase();
                    card.style.display = (titulo.includes(texto) || profe.includes(texto)) ? '' : 'none';
                });
            });
        }
    </script>
</body>
</html>


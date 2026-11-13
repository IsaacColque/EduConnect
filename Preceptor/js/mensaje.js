document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar el Sidebar único dinámicamente
    fetch('sidebar.html')
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el sidebar.html");
            return response.text();
        })
        .then(data => {
            const container = document.getElementById('sidebar-container');
            if (container) {
                container.outerHTML = data; // Reemplaza el contenedor con el <aside class="sidebar">
            }

            // 2. Activar el botón hamburguesa y la funcionalidad del sidebar
            const menuBtn = document.getElementById('menu-btn');
            const sidebar = document.getElementById('sidebar');

            if (menuBtn && sidebar) {
                menuBtn.addEventListener('click', () => {
                    sidebar.classList.toggle('collapsed');
                });
            }

            // 3. Marcar automáticamente la pestaña actual como activa en el menú lateral
            const rutaActual = window.location.pathname.split("/").pop();
            const itemsMenu = document.querySelectorAll('.menu li');
            itemsMenu.forEach(li => {
                const link = li.querySelector('a');
                if (link && link.getAttribute('href') === rutaActual) {
                    document.querySelectorAll('.menu li').forEach(el => el.classList.remove('activo'));
                    li.classList.add('activo');
                }
            });
        })
        .catch(error => console.error("Error al cargar el sidebar:", error));

    // 4. Lógica interactiva para enviar mensajes en el chat de la preceptoría
    const enviarBtn = document.getElementById('enviar-btn');
    const mensajeInput = document.getElementById('mensaje-input');
    const chatMessages = document.getElementById('chat-messages');

    function enviarMensaje() {
        const texto = mensajeInput.value.trim();
        if (texto === "") return;

        // Crear burbuja de mensaje enviado
        const nuevoMensaje = document.createElement('div');
        nuevoMensaje.classList.add('mensaje', 'mensaje-enviado');
        
        const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        nuevoMensaje.innerHTML = `
            <p>${texto}</p>
            <span class="mensaje-hora">${horaActual}</span>
        `;

        chatMessages.appendChild(nuevoMensaje);
        mensajeInput.value = "";
        
        // Auto-scroll hacia el último mensaje
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (enviarBtn && mensajeInput) {
        enviarBtn.addEventListener('click', enviarMensaje);
        mensajeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                enviarMensaje();
            }
        });
    }
});
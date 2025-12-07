// 
// VALIDACIÓN DE FORMULARIOS Y FUNCIONES DE ACCESIBILIDAD
// 

document.addEventListener('DOMContentLoaded', function() {

    /* FUNCIÓN ARIA-LIVE PARA ANUNCIOS ACCESIBLES */

    let regionLive = document.getElementById('region-live');
    if (!regionLive) {
        regionLive = document.createElement('div');
        regionLive.id = 'region-live';
        regionLive.className = 'visually-hidden';
        regionLive.setAttribute('aria-live', 'polite');
        regionLive.setAttribute('aria-atomic', 'true');
        document.body.appendChild(regionLive);
    }

    function anunciar(mensaje) {
        regionLive.innerText = mensaje;
        setTimeout(() => { regionLive.innerText = ""; }, 2000);
    }


    /* MODO ALTO CONTRASTE */

    const botonContraste = document.getElementById('altoContraste');
    if (botonContraste) {
        botonContraste.addEventListener('click', function() {
            document.body.classList.toggle('alto-contraste');

            const activo = document.body.classList.contains('alto-contraste');
            const icono = this.querySelector('.material-icons');

            this.setAttribute('aria-label', activo ? 'Desactivar alto contraste' : 'Activar alto contraste');
            icono.textContent = activo ? 'invert_colors' : 'contrast';

            localStorage.setItem('altoContraste', activo);
            anunciar(activo ? 'Modo alto contraste activado' : 'Modo alto contraste desactivado');
        });

        if (localStorage.getItem('altoContraste') === 'true') {
            document.body.classList.add('alto-contraste');
            const icono = botonContraste.querySelector('.material-icons');
            botonContraste.setAttribute('aria-label', 'Desactivar alto contraste');
            icono.textContent = 'invert_colors';
        }
    }


    /* MODO DISLEXIA */

    const botonDislexia = document.getElementById('modoDislexia');
    if (botonDislexia) {
        botonDislexia.addEventListener('click', function() {
            document.body.classList.toggle('fuente-dislexia');

            const activo = document.body.classList.contains('fuente-dislexia');
            this.setAttribute('aria-label', activo ? 'Desactivar modo dislexia' : 'Activar modo dislexia');

            localStorage.setItem('modoDislexia', activo);
            anunciar(activo ? 'Modo dislexia activado' : 'Modo dislexia desactivado');
        });

        if (localStorage.getItem('modoDislexia') === 'true') {
            document.body.classList.add('fuente-dislexia');
            botonDislexia.setAttribute('aria-label', 'Desactivar modo dislexia');
        }
    }


    /* REDUCIR ANIMACIONES */

    const botonAnimaciones = document.getElementById('reducirAnimaciones');
    if (botonAnimaciones) {
        botonAnimaciones.addEventListener('click', function() {
            document.body.classList.toggle('reducir-animaciones');

            const activo = document.body.classList.contains('reducir-animaciones');
            this.setAttribute('aria-label', activo ? 'Restaurar animaciones' : 'Reducir animaciones');

            localStorage.setItem('reducirAnimaciones', activo);
            anunciar(activo ? 'Animaciones reducidas' : 'Animaciones restauradas');
        });

        if (localStorage.getItem('reducirAnimaciones') === 'true') {
            document.body.classList.add('reducir-animaciones');
            botonAnimaciones.setAttribute('aria-label', 'Restaurar animaciones');
        }
    }


    /* ZOOM DE TEXTO */

    const botonZoom = document.getElementById('zoomTexto');
    if (botonZoom) {
        botonZoom.addEventListener('click', function() {
            document.body.classList.toggle('texto-zoom');

            const activo = document.body.classList.contains('texto-zoom');
            this.setAttribute('aria-label', activo ? 'Desactivar zoom de texto' : 'Aumentar tamaño del texto');

            localStorage.setItem('zoomTexto', activo);
            anunciar(activo ? 'Zoom de texto activado' : 'Zoom de texto desactivado');
        });

        if (localStorage.getItem('zoomTexto') === 'true') {
            document.body.classList.add('texto-zoom');
            botonZoom.setAttribute('aria-label', 'Desactivar zoom de texto');
        }
    }


    /* VALIDACIÓN DE FORMULARIO DE CONTACTO */

    const formulario = document.getElementById('formularioContacto');
    if (formulario) {

        formulario.addEventListener('submit', function(event) {
            event.preventDefault();

            let errores = [];

            /* Validar nombre */
            const nombre = document.getElementById('nombre');
            validarCampo(nombre, "Por favor, ingresa tu nombre completo", errores);

            /* Validar email */
            const email = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!email.value.trim()) {
                mostrarError(email, "Por favor, ingresa tu correo electrónico");
                errores.push("El campo email es obligatorio");
            } else if (!emailRegex.test(email.value)) {
                mostrarError(email, "Correo electrónico inválido");
                errores.push("Formato de email incorrecto");
            } else {
                limpiarError(email);
            }

            /* Validar teléfono */
            const telefono = document.getElementById('telefono');
            if (telefono.value.trim() && !/^[\d\s\-\+\(\)]+$/.test(telefono.value)) {
                mostrarError(telefono, "Formato de teléfono inválido");
                errores.push("El teléfono no tiene un formato válido");
            } else {
                limpiarError(telefono);
            }

            /* Validar mensaje */
            const mensaje = document.getElementById('mensaje');
            validarCampo(mensaje, "Por favor, ingresa tu mensaje", errores);

            const salida = document.getElementById('mensajeFormulario');

            // --- Cuando NO hay errores ---
            if (errores.length === 0) {

                salida.innerHTML = `
                    <div class="alert alert-success" role="alert">
                        <h4 class="alert-heading">¡Gracias por contactarnos!</h4>
                        <p>Tu mensaje fue enviado correctamente.</p>
                        <hr>
                        <p class="mb-0">Te responderemos al correo <strong>${email.value}</strong> en un plazo máximo de 48 horas.</p>
                    </div>
                `;

                salida.scrollIntoView({ behavior: "smooth" });
                anunciar("Formulario enviado correctamente");

                setTimeout(() => formulario.reset(), 2000);

            } else {
                // --- Cuando SÍ hay errores ---
                salida.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        <h4 class="alert-heading">Corrige los siguientes errores:</h4>
                        <ul>${errores.map(e => `<li>${e}</li>`).join('')}</ul>
                    </div>
                `;

                salida.scrollIntoView({ behavior: "smooth" });
                anunciar("Errores en el formulario");
            }

            salida.setAttribute("tabindex", "-1");
            salida.focus();
        });


        /* -------- FUNCIONES DE APOYO -------- */

        function validarCampo(elemento, mensaje, lista) {
            if (!elemento.value.trim()) {
                mostrarError(elemento, mensaje);
                lista.push(mensaje);
            } else {
                limpiarError(elemento);
            }
        }

        function mostrarError(elemento, mensaje) {
            elemento.classList.remove("is-valid");
            elemento.classList.add("is-invalid");

            let feedback = elemento.nextElementSibling;
            if (!feedback || !feedback.classList.contains("invalid-feedback")) {
                feedback = document.createElement("div");
                feedback.className = "invalid-feedback";
                elemento.after(feedback);
            }
            feedback.textContent = mensaje;
        }

        function limpiarError(elemento) {
            elemento.classList.remove("is-invalid");
            if (elemento.value.trim() !== "") {
                elemento.classList.add("is-valid");
            }
            const feedback = elemento.nextElementSibling;
            if (feedback && feedback.classList.contains("invalid-feedback")) {
                feedback.remove();
            }
        }
    }


    /* ATAJOS DE TECLADO ACCESIBLES */

   document.addEventListener('keydown', function(event) {
    if (event.altKey) {
        switch (event.key) {
            case '1':
                const nav = document.querySelector('nav');
                if (nav) nav.focus();
                break;

            case '2':
                const main = document.querySelector('main');
                if (main) main.focus();
                break;

            case '3':
                const footer = document.querySelector('footer');
                if (footer) footer.focus();
                break;

            case 'c':
                const botonContraste = document.getElementById('altoContraste');
                if (botonContraste) botonContraste.click();
                break;
        }
    }
});


    setTimeout(() => {
        anunciar(
            "Atajos activos: Alt + 1 navegación, Alt + 2 contenido, Alt + 3 pie de página, Alt + C activar contraste."
        );
    }, 1000);

});

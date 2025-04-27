//buscar-pacientes.js
var botonBuscar = document.querySelector('#buscar-paciente');
botonBuscar.addEventListener('click', function () {
	// Mostrar indicador de carga
	botonBuscar.disabled = true;
	botonBuscar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Importando...';

	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://alura-es-cursos.github.io/api-pacientes/pacientes.json');

	// Establecer un tiempo de espera de 5 segundos
	xhr.timeout = 5000;

	xhr.addEventListener('load', function () {
		var errorAjax = document.querySelector('#error-ajax');
		if (xhr.status == 200) {
			errorAjax.classList.add('invisible');
			var respuesta = xhr.responseText;
			var pacientes = JSON.parse(respuesta);

			// Contador para pacientes añadidos
			var pacientesAgregados = 0;

			pacientes.forEach(function (paciente) {
				// Verificar si el paciente ya existe (comparando por nombre)
				if (!pacienteExiste(paciente.nombre)) {
					adicionarPacienteEnLaTabla(paciente);
					pacientesAgregados++;
				}
			});

			// Save the patients to localStorage
			guardarPacientesLocal();

			// Mostrar mensaje de éxito con el número de pacientes importados
			var mensaje =
				pacientesAgregados > 0
					? `Se importaron ${pacientesAgregados} pacientes correctamente`
					: 'No hay nuevos pacientes para importar';
			mostrarMensajeExito(mensaje);
		} else {
			errorAjax.classList.remove('invisible');
		}
		// Restaurar el botón
		restaurarBoton();
	});

	xhr.addEventListener('error', function () {
		var errorAjax = document.querySelector('#error-ajax');
		errorAjax.textContent = 'Error de conexión. Verifique su conexión a internet.';
		errorAjax.classList.remove('invisible');
		restaurarBoton();
	});

	xhr.addEventListener('timeout', function () {
		var errorAjax = document.querySelector('#error-ajax');
		errorAjax.textContent = 'La solicitud ha tardado demasiado. Intente nuevamente.';
		errorAjax.classList.remove('invisible');
		restaurarBoton();
	});

	xhr.send();
});

function pacienteExiste(nombre) {
	var pacientes = document.querySelectorAll('.paciente');
	for (var i = 0; i < pacientes.length; i++) {
		var pacienteNombre = pacientes[i].querySelector('.info-nombre').textContent;
		if (pacienteNombre === nombre) {
			return true;
		}
	}
	return false;
}

function restaurarBoton() {
	var botonBuscar = document.querySelector('#buscar-paciente');
	botonBuscar.disabled = false;
	botonBuscar.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Importar Pacientes';
}

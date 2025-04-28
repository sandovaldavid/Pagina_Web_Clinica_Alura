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
					? `Se importaron ${pacientesAgregados} pacientes con éxito.`
					: 'No se encontraron nuevos pacientes para importar.';

			if (pacientesAgregados > 0) {
				showSuccessNotification(mensaje);
			} else {
				showAlertNotification(mensaje);
			}
		} else {
			showErrorNotification(
				'Error al buscar pacientes: ' + xhr.status + ' - ' + xhr.statusText
			);
		}

		// Restaurar el botón a su estado original
		botonBuscar.disabled = false;
		botonBuscar.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Importar Pacientes';
	});

	xhr.addEventListener('error', function () {
		showErrorNotification('Error de red. Compruebe su conexión a Internet.');

		// Restaurar el botón a su estado original
		botonBuscar.disabled = false;
		botonBuscar.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Importar Pacientes';
	});

	xhr.addEventListener('timeout', function () {
		showAlertNotification(
			'La solicitud ha excedido el tiempo de espera. Inténtelo de nuevo más tarde.'
		);

		// Restaurar el botón a su estado original
		botonBuscar.disabled = false;
		botonBuscar.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Importar Pacientes';
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

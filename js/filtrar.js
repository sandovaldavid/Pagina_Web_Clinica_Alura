var campoFiltro = document.querySelector('#filtrar-tabla');

campoFiltro.addEventListener('input', function () {
	var pacientes = document.querySelectorAll('.paciente');
	var pacientesVisibles = 0;

	if (this.value.length > 0) {
		for (var i = 0; i < pacientes.length; i++) {
			var paciente = pacientes[i];
			var tdNombre = paciente.querySelector('.info-nombre');
			var nombre = tdNombre.textContent;

			var expresion = new RegExp(this.value, 'i'); // expresiones regulares javascrip buscar documentacion!!!!!

			if (!expresion.test(nombre)) {
				paciente.classList.add('invisible');
			} else {
				paciente.classList.remove('invisible');
				pacientesVisibles++;
			}
		}

		// Mostrar notificación si no se encuentran resultados
		if (pacientesVisibles === 0 && window.showAlertNotification) {
			showAlertNotification(
				`No se encontraron pacientes con el término "${this.value}"`,
				'Sin resultados',
				3000
			);
		}
	} else {
		for (var i = 0; i < pacientes.length; i++) {
			var paciente = pacientes[i];
			paciente.classList.remove('invisible');
		}
	}
});

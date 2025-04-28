var pacientes = document.querySelectorAll('.paciente');

var tabla = document.querySelector('#tabla-pacientes');
tabla.addEventListener('dblclick', function (event) {
	// Verificar que se hizo clic en un TD dentro de una fila de paciente
	// Ignorar si se hizo clic en la celda de acciones
	if (
		event.target.tagName === 'TD' &&
		!event.target.classList.contains('acciones-paciente') &&
		!event.target.closest('.acciones-paciente')
	) {
		var fila = event.target.parentNode;
		var nombrePaciente = fila.querySelector('.info-nombre').textContent;

		// Add class to the row for animation
		fila.classList.add('paciente-eliminado');

		// Eliminar después de completar la animación
		setTimeout(function () {
			fila.remove();

			// Update local storage after deletion
			guardarPacientesLocal();

			// Usar la nueva notificación de tipo delete
			showDeleteNotification(`Paciente ${nombrePaciente} eliminado correctamente`);
		}, 500);
	}
});

// Añadir tooltip informativo a las filas de pacientes
function mostrarTooltipEliminacion() {
	var filasPacientes = document.querySelectorAll('.paciente');
	filasPacientes.forEach(function (fila) {
		fila.setAttribute('title', 'Doble clic para eliminar paciente');
	});
}

// Llamar a la función cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
	mostrarTooltipEliminacion();

	// Actualizar tooltips cuando se añaden nuevos pacientes (usando MutationObserver)
	var tablaCuerpo = document.querySelector('#tabla-pacientes');
	var observador = new MutationObserver(function (mutaciones) {
		mostrarTooltipEliminacion();
	});

	observador.observe(tablaCuerpo, { childList: true });
});

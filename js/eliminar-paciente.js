var pacientes = document.querySelectorAll('.paciente');

var tabla = document.querySelector('#tabla-pacientes');
tabla.addEventListener('dblclick', function (event) {
	// Verificar que se hizo clic en un TD dentro de una fila de paciente
	if (event.target.tagName === 'TD') {
		var fila = event.target.parentNode;
		var nombrePaciente = fila.querySelector('.info-nombre').textContent;

		// Añadir efecto visual de desvanecer
		fila.classList.add('fadeOut');

		// Eliminar después de completar la animación
		setTimeout(function () {
			fila.remove();

			// Mostrar mensaje de confirmación
			mostrarMensajeExito(`Paciente ${nombrePaciente} eliminado correctamente`);
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

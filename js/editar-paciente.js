/*
 * Módulo para la edición de pacientes existentes
 * Permite editar los datos de cada paciente en la tabla
 */

// Referencia al modal/form de edición que añadiremos al HTML
let modalEdicion = null;
let pacienteEnEdicion = null;
let indiceFilaEnEdicion = -1;

// Variables globales para el paciente a eliminar
let pacienteAEliminar = null;

// Inicializar módulo de edición
document.addEventListener('DOMContentLoaded', function () {
	// Crear y añadir el modal de edición al DOM
	crearModalEdicion();

	// Crear y añadir el modal de confirmación para eliminar
	crearModalConfirmacion();

	// Configurar tooltips y detectar cambios en la tabla
	configurarTooltipsEditarEliminar();

	// Observar cambios para los nuevos pacientes que se añadan
	const tablaPacientes = document.querySelector('#tabla-pacientes');
	const observer = new MutationObserver(function () {
		configurarTooltipsEditarEliminar();
	});

	observer.observe(tablaPacientes, { childList: true });
});

// Crear e insertar el modal de edición en el DOM
function crearModalEdicion() {
	// Crear el contenedor principal del modal
	modalEdicion = document.createElement('div');
	modalEdicion.id = 'modal-edicion';
	modalEdicion.className = 'modal';
	modalEdicion.innerHTML = `
        <div class="modal-contenido">
            <div class="modal-header">
                <h3><i class="fas fa-user-edit"></i> Editar Paciente</h3>
                <button id="cerrar-modal" class="boton-cerrar"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <form id="form-editar">
                    <div class="form-row">
                        <div class="grupo">
                            <label for="editar-nombre">Nombre:</label>
                            <input id="editar-nombre" name="nombre" type="text" placeholder="Nombre completo" class="campo">
                        </div>
                        <div class="grupo">
                            <label for="editar-peso">Peso:</label>
                            <input id="editar-peso" name="peso" type="number" step="0.1" min="0" max="1000" placeholder="Peso en kg" class="campo campo-medio">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="grupo">
                            <label for="editar-altura">Altura:</label>
                            <input id="editar-altura" name="altura" type="number" step="0.01" min="0" max="3" placeholder="Altura en metros" class="campo campo-medio">
                        </div>
                        <div class="grupo">
                            <label for="editar-gordura">% de Gordura:</label>
                            <input id="editar-gordura" name="gordura" type="number" step="0.1" min="0" max="100" placeholder="Porcentaje de gordura" class="campo campo-medio">
                        </div>
                    </div>
                    <div id="editar-mensajes-errores" class="mensajes-errores"></div>
                </form>
            </div>
            <div class="modal-footer">
                <button id="editar-cancelar" class="boton bto-secundario">
                    <i class="fas fa-times"></i> Cancelar
                </button>
                <button id="editar-guardar" class="boton bto-principal">
                    <i class="fas fa-save"></i> Guardar Cambios
                </button>
            </div>
        </div>
    `;

	// Añadir el modal al body
	document.body.appendChild(modalEdicion);

	// Configurar eventos del modal
	const btnCerrar = document.querySelector('#cerrar-modal');
	const btnCancelar = document.querySelector('#editar-cancelar');
	const btnGuardar = document.querySelector('#editar-guardar');

	// Cerrar modal
	btnCerrar.addEventListener('click', cerrarModal);
	btnCancelar.addEventListener('click', cerrarModal);

	// También cerrar al hacer clic fuera del modal
	modalEdicion.addEventListener('click', function (event) {
		if (event.target === modalEdicion) {
			cerrarModal();
		}
	});

	// Guardar cambios
	btnGuardar.addEventListener('click', guardarCambiosPaciente);
}

// Crear el modal de confirmación para eliminar pacientes
function crearModalConfirmacion() {
	// Crear el contenedor principal del modal
	const modalConfirmacion = document.createElement('div');
	modalConfirmacion.id = 'modal-confirmacion';
	modalConfirmacion.className = 'modal';
	modalConfirmacion.innerHTML = `
        <div class="modal-contenido modal-confirmacion">
            <div class="modal-header">
                <h3><i class="fas fa-exclamation-triangle"></i> Confirmar eliminación</h3>
                <button id="cerrar-modal-confirmacion" class="boton-cerrar"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <p id="mensaje-confirmacion" class="mensaje-confirmacion">
                    ¿Estás seguro de que deseas eliminar este paciente?
                </p>
            </div>
            <div class="modal-footer">
                <button id="cancelar-eliminacion" class="boton bto-secundario">
                    <i class="fas fa-times"></i> Cancelar
                </button>
                <button id="confirmar-eliminacion" class="boton bto-error">
                    <i class="fas fa-trash-alt"></i> Eliminar
                </button>
            </div>
        </div>
    `;

	// Añadir el modal al body
	document.body.appendChild(modalConfirmacion);

	// Configurar eventos del modal
	const btnCerrar = document.querySelector('#cerrar-modal-confirmacion');
	const btnCancelar = document.querySelector('#cancelar-eliminacion');

	// Cerrar modal al hacer clic en el botón cerrar o cancelar
	btnCerrar.addEventListener('click', cerrarModalConfirmacion);
	btnCancelar.addEventListener('click', cerrarModalConfirmacion);

	// Cerrar al hacer clic fuera del modal
	modalConfirmacion.addEventListener('click', function (event) {
		if (event.target === modalConfirmacion) {
			cerrarModalConfirmacion();
		}
	});
}

// Configurar tooltips y eventos para editar y eliminar
function configurarTooltipsEditarEliminar() {
	// Seleccionar todas las filas de pacientes
	const filasPacientes = document.querySelectorAll('#tabla-pacientes .paciente');

	filasPacientes.forEach(function (fila, indice) {
		// Verificar si la fila ya tiene los botones de acción
		if (!fila.querySelector('.acciones-paciente')) {
			// Crear celda de acciones
			const tdAcciones = document.createElement('td');
			tdAcciones.className = 'acciones-paciente';

			// Botón de editar
			const btnEditar = document.createElement('button');
			btnEditar.className = 'boton-accion editar-btn';
			btnEditar.innerHTML = '<i class="fas fa-edit"></i>';
			btnEditar.title = 'Editar paciente';
			btnEditar.addEventListener('click', function () {
				abrirEdicion(fila, indice);
			});

			// Botón de eliminar
			const btnEliminar = document.createElement('button');
			btnEliminar.className = 'boton-accion eliminar-btn';
			btnEliminar.innerHTML = '<i class="fas fa-trash-alt"></i>';
			btnEliminar.title = 'Eliminar paciente';
			btnEliminar.addEventListener('click', function () {
				eliminarPaciente(fila);
			});

			// Añadir botones a la celda
			tdAcciones.appendChild(btnEditar);
			tdAcciones.appendChild(btnEliminar);

			// Añadir celda a la fila
			fila.appendChild(tdAcciones);
		}
	});
}

// Abrir el modal de edición para un paciente específico
function abrirEdicion(fila, indice) {
	// Guardar referencia al paciente que estamos editando
	pacienteEnEdicion = fila;
	indiceFilaEnEdicion = indice;

	// Obtener los datos actuales del paciente
	const nombre = fila.querySelector('.info-nombre').textContent;
	const peso = fila.querySelector('.info-peso').textContent;
	const altura = fila.querySelector('.info-altura').textContent;
	const gordura = fila.querySelector('.info-gordura').textContent;

	// Llenar el formulario con los datos actuales
	document.querySelector('#editar-nombre').value = nombre;
	document.querySelector('#editar-peso').value = peso;
	document.querySelector('#editar-altura').value = altura;
	document.querySelector('#editar-gordura').value = gordura;

	// Limpiar mensajes de error previos
	document.querySelector('#editar-mensajes-errores').innerHTML = '';

	// Mostrar el modal
	modalEdicion.style.display = 'flex';
}

// Cerrar el modal de edición
function cerrarModal() {
	// Agregar clase para animación de salida
	modalEdicion.classList.add('modal-salida');

	// Esperar a que termine la animación antes de ocultar
	setTimeout(function () {
		modalEdicion.style.display = 'none';
		modalEdicion.classList.remove('modal-salida');
		pacienteEnEdicion = null;
		indiceFilaEnEdicion = -1;
	}, 300);
}

// Guardar los cambios del paciente
function guardarCambiosPaciente() {
	// Validar que tengamos un paciente en edición
	if (!pacienteEnEdicion) return;

	// Obtener los valores actuales del paciente (antes de la edición)
	const pesoActual = pacienteEnEdicion.querySelector('.info-peso').textContent;
	const alturaActual = pacienteEnEdicion.querySelector('.info-altura').textContent;

	// Obtener los valores del formulario (nuevos valores)
	const nombreNuevo = document.querySelector('#editar-nombre').value;
	const pesoNuevo = document.querySelector('#editar-peso').value;
	const alturaNuevo = document.querySelector('#editar-altura').value;
	const gorduraNuevo = document.querySelector('#editar-gordura').value;

	// Crear objeto paciente para validación
	const paciente = {
		nombre: nombreNuevo,
		peso: pesoNuevo,
		altura: alturaNuevo,
		gordura: gorduraNuevo,
	};

	// Validar los datos
	const errores = validarPaciente(paciente);

	if (errores.length > 0) {
		// Mostrar errores
		mostrarErroresEdicion(errores);
		return;
	}

	// Actualizar la fila con los nuevos datos
	pacienteEnEdicion.querySelector('.info-nombre').textContent = nombreNuevo;
	pacienteEnEdicion.querySelector('.info-peso').textContent = pesoNuevo;
	pacienteEnEdicion.querySelector('.info-altura').textContent = alturaNuevo;
	pacienteEnEdicion.querySelector('.info-gordura').textContent = gorduraNuevo;

	// Verificar si cambió algún dato que afecte el IMC (peso o altura)
	const cambioRelevante = pesoActual !== pesoNuevo || alturaActual !== alturaNuevo;

	if (cambioRelevante) {
		actualizarPaciente(pacienteEnEdicion);
		mostrarMensajeExito('Paciente actualizado y se recalculó el IMC');
	} else {
		mostrarMensajeExito('Paciente actualizado correctamente');
	}

	// Guardar cambios en localStorage
	guardarPacientesLocal();

	// Cerrar modal
	cerrarModal();

	// Efecto visual para mostrar que se actualizó
	pacienteEnEdicion.classList.add('paciente-actualizado');
	setTimeout(function () {
		pacienteEnEdicion.classList.remove('paciente-actualizado');
	}, 1500);
}

// Mostrar errores en el formulario de edición
function mostrarErroresEdicion(errores) {
	const ul = document.querySelector('#editar-mensajes-errores');
	ul.innerHTML = '';

	errores.forEach(function (error) {
		const li = document.createElement('li');
		li.textContent = error;
		ul.appendChild(li);
	});
}

// Función para mostrar el modal de confirmación de eliminación
function mostrarModalConfirmacion(fila) {
	// Asignar la fila a la variable global pacienteAEliminar
	pacienteAEliminar = fila;
	const nombrePaciente = pacienteAEliminar.querySelector('.info-nombre').textContent;

	// Actualizar el mensaje con el nombre del paciente
	document.querySelector(
		'#mensaje-confirmacion'
	).textContent = `¿Estás seguro de que deseas eliminar al paciente ${nombrePaciente}?`;

	// Configurar el botón de confirmar
	const btnConfirmar = document.querySelector('#confirmar-eliminacion');

	// Eliminar cualquier event listener anterior para evitar múltiples llamadas
	if (btnConfirmar.onclick) {
		btnConfirmar.onclick = null;
	}

	// Asignar nuevo event listener
	btnConfirmar.onclick = function () {
		ejecutarEliminacion();
	};

	// Mostrar el modal
	const modalConfirmacion = document.querySelector('#modal-confirmacion');
	modalConfirmacion.style.display = 'flex';
}

// Función para cerrar el modal de confirmación
function cerrarModalConfirmacion() {
	const modalConfirmacion = document.querySelector('#modal-confirmacion');

	// Añadir animación de salida
	modalConfirmacion.classList.add('modal-salida');

	// Esperar a que termine la animación antes de ocultar
	setTimeout(function () {
		modalConfirmacion.style.display = 'none';
		modalConfirmacion.classList.remove('modal-salida');
		pacienteAEliminar = null;
	}, 300);
}

// Función para ejecutar la eliminación del paciente
function ejecutarEliminacion() {
	if (!pacienteAEliminar) {
		console.error('Error: No hay paciente seleccionado para eliminar');
		return;
	}

	// Obtener el nombre del paciente para el mensaje
	const nombrePaciente = pacienteAEliminar.querySelector('.info-nombre').textContent;

	// Guardar referencia local a pacienteAEliminar antes de cerrarlo
	const pacienteParaEliminar = pacienteAEliminar;

	// Cerrar el modal de confirmación
	cerrarModalConfirmacion();

	// Aplicar la animación mejorada
	pacienteParaEliminar.classList.add('paciente-eliminado');

	// Eliminar después de completar la animación
	setTimeout(function () {
		// Verificar que el paciente todavía existe en el DOM
		if (pacienteParaEliminar && pacienteParaEliminar.parentNode) {
			pacienteParaEliminar.remove();

			// Actualizar almacenamiento local
			guardarPacientesLocal();

			// Mostrar mensaje de confirmación
			mostrarMensajeExito(`Paciente ${nombrePaciente} eliminado correctamente`);
		} else {
			console.error(
				'Error: El paciente ya no existe en el DOM o fue eliminado por otro método'
			);
		}
	}, 500);
}

// Eliminar paciente con modal de confirmación
function eliminarPaciente(fila) {
	mostrarModalConfirmacion(fila);
}

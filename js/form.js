var botonAdicionar = document.querySelector('#adicionar-paciente');

botonAdicionar.addEventListener('click', function (event) {
	event.preventDefault(); // Prevenir comportamiento por defecto

	var form = document.querySelector('#form-adicionar');
	var paciente = capturarDatosPaciente(form);

	var errores = validarPaciente(paciente);

	if (errores.length > 0) {
		exhibirMensajesErrores(errores);
		return;
	}

	adicionarPacienteEnLaTabla(paciente);
	form.reset();

	// Limpiar mensajes de error y mostrar mensaje de éxito
	var mensajesErrores = document.querySelector('#mensajes-errores');
	mensajesErrores.innerHTML = '';

	// Mostrar mensaje de éxito
	mostrarMensajeExito('Paciente añadido con éxito');
});

function adicionarPacienteEnLaTabla(paciente) {
	var pacienteTr = construirTr(paciente);
	var tabla = document.querySelector('#tabla-pacientes');
	tabla.appendChild(pacienteTr);

	// Actualizar el paciente recién añadido para calcular su IMC y estado
	actualizarPaciente(pacienteTr);
}

function capturarDatosPaciente(form) {
	//capturando los datos del formulario
	var paciente = {
		nombre: form.nombre.value,
		peso: form.peso.value,
		altura: form.altura.value,
		gordura: form.gordura.value,
		imc: calcularIMC(form.peso.value, form.altura.value),
	};
	return paciente;
}

function construirTr(paciente) {
	var pacienteTr = document.createElement('tr');
	pacienteTr.classList.add('paciente');

	pacienteTr.appendChild(construirTd(paciente.nombre, 'info-nombre'));
	pacienteTr.appendChild(construirTd(paciente.peso, 'info-peso'));
	pacienteTr.appendChild(construirTd(paciente.altura, 'info-altura'));
	pacienteTr.appendChild(construirTd(paciente.gordura, 'info-gordura'));
	pacienteTr.appendChild(construirTd(paciente.imc, 'info-imc'));
	pacienteTr.appendChild(construirTd('', 'info-estado estado-imc'));

	// Añadir efecto visual al añadir nuevo paciente
	pacienteTr.style.opacity = '0';
	setTimeout(function () {
		pacienteTr.style.transition = 'opacity 0.5s ease';
		pacienteTr.style.opacity = '1';
	}, 10);

	return pacienteTr;
}

function construirTd(dato, clase) {
	var td = document.createElement('td');
	td.classList.add(...clase.split(' '));
	td.textContent = dato;
	return td;
}

function validarPaciente(paciente) {
	var errores = [];

	if (paciente.nombre.length == 0) {
		errores.push('El nombre no puede estar vacío');
	}
	if (paciente.peso.length == 0) {
		errores.push('El peso no puede estar vacío');
	}
	if (paciente.altura.length == 0) {
		errores.push('La altura no puede estar vacía');
	}
	if (paciente.gordura.length == 0) {
		errores.push('El %gordura no puede estar vacío');
	}
	if (!validarPeso(paciente.peso)) {
		errores.push('El peso es incorrecto (debe estar entre 0 y 1000 kg)');
	}
	if (!validarAltura(paciente.altura)) {
		errores.push('La altura es incorrecta (debe estar entre 0 y 3.0 m)');
	}
	return errores;
}

function exhibirMensajesErrores(errores) {
	var ul = document.querySelector('#mensajes-errores');
	ul.innerHTML = ''; // accede al contenido interno de una etiqueta

	// Destacar visualmente el área de mensajes
	ul.classList.add('error-active');
	setTimeout(function () {
		ul.classList.remove('error-active');
	}, 100);

	errores.forEach(function (error) {
		var li = document.createElement('li');
		li.textContent = error;
		ul.appendChild(li);
	});
}

function mostrarMensajeExito(mensaje) {
	var successMessage = document.querySelector('#success-message');
	successMessage.textContent = mensaje;
	successMessage.classList.remove('invisible');

	// Ocultar el mensaje después de 3 segundos
	setTimeout(function () {
		successMessage.classList.add('invisible');
	}, 3000);
}

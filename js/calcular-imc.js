var pacientes = document.querySelectorAll('.paciente');

// Inicializar los IMCs de los pacientes existentes
inicializarPacientes();

function inicializarPacientes() {
	for (var i = 0; i < pacientes.length; i++) {
		var paciente = pacientes[i];
		actualizarPaciente(paciente);
	}
}

function actualizarPaciente(paciente) {
	var tdPeso = paciente.querySelector('.info-peso');
	var peso = tdPeso.textContent;

	var tdAltura = paciente.querySelector('.info-altura');
	var altura = tdAltura.textContent;

	var tdIMC = paciente.querySelector('.info-imc');

	// Validar datos
	pesoEsValido = validarPeso(peso);
	alturaEsValida = validarAltura(altura);

	// Resetear clases de error si existen
	paciente.classList.remove('paciente-incorrecto');

	if (!pesoEsValido) {
		console.log('Peso incorrecto');
		tdIMC.textContent = 'Peso incorrecto';
		pesoEsValido = false;
		paciente.classList.add('paciente-incorrecto');
	}

	if (!alturaEsValida) {
		console.log('Altura incorrecta');
		tdIMC.textContent = 'Altura incorrecta';
		alturaEsValida = false;
		paciente.classList.add('paciente-incorrecto');
	}

	if (pesoEsValido && alturaEsValida) {
		var imc = calcularIMC(peso, altura);
		tdIMC.textContent = imc;

		// Añadir columna de estado si no existe
		if (!paciente.querySelector('.info-estado')) {
			var tdEstado = document.createElement('td');
			tdEstado.classList.add('info-estado', 'estado-imc');
			paciente.appendChild(tdEstado);
		} else {
			var tdEstado = paciente.querySelector('.info-estado');
		}

		// Actualizar el estado según el IMC
		actualizarEstadoIMC(tdEstado, imc);
	}
}

function calcularIMC(peso, altura) {
	var imc = peso / (altura * altura);
	return imc.toFixed(2);
}

function validarPeso(peso) {
	if (peso >= 0 && peso < 1000) {
		return true;
	} else {
		return false;
	}
}

function validarAltura(altura) {
	if (altura >= 0 && altura < 3.0) {
		return true;
	} else {
		return false;
	}
}

function actualizarEstadoIMC(tdEstado, imc) {
	// Resetear clases de estado
	tdEstado.classList.remove('peso-bajo', 'peso-normal', 'sobrepeso', 'obesidad');

	var valorIMC = parseFloat(imc);
	var textoEstado = '';
	var claseEstado = '';

	if (valorIMC < 18.5) {
		textoEstado = 'Bajo peso';
		claseEstado = 'peso-bajo';
	} else if (valorIMC >= 18.5 && valorIMC < 25) {
		textoEstado = 'Normal';
		claseEstado = 'peso-normal';
	} else if (valorIMC >= 25 && valorIMC < 30) {
		textoEstado = 'Sobrepeso';
		claseEstado = 'sobrepeso';
	} else {
		textoEstado = 'Obesidad';
		claseEstado = 'obesidad';
	}

	tdEstado.textContent = textoEstado;
	tdEstado.classList.add(claseEstado);
}

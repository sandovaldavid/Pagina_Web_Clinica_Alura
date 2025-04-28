/*
 * Módulo para generar y actualizar gráficos estadísticos
 */

let graficoIMC = null;
let graficoPeso = null;
let graficoGordura = null;

// Estado de ordenación por defecto
const estadoOrdenacion = {
	imc: { campo: 'nombre', ascendente: true },
	peso: { campo: 'nombre', ascendente: true },
	gordura: { campo: 'nombre', ascendente: true },
};

document.addEventListener('DOMContentLoaded', function () {
	configurarTabs();
	configurarOrdenamiento();
	generarGraficos();
	observarCambiosPacientes();
});

// Configuración de las pestañas
function configurarTabs() {
	const tabButtons = document.querySelectorAll('.tab-btn');

	tabButtons.forEach((button) => {
		button.addEventListener('click', () => {
			document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('active'));
			document
				.querySelectorAll('.tab-content')
				.forEach((content) => content.classList.remove('active'));

			button.classList.add('active');

			const tabId = button.getAttribute('data-tab');
			document.getElementById(`${tabId}-tab`).classList.add('active');
		});
	});
}

// Configurar botones de ordenamiento
function configurarOrdenamiento() {
	const botonesOrden = document.querySelectorAll('.orden-btn');

	botonesOrden.forEach((boton) => {
		boton.addEventListener('click', (e) => {
			const tipoGrafico = boton.getAttribute('data-grafico');
			const campoOrden = boton.getAttribute('data-orden');

			if (estadoOrdenacion[tipoGrafico].campo === campoOrden) {
				estadoOrdenacion[tipoGrafico].ascendente =
					!estadoOrdenacion[tipoGrafico].ascendente;
			} else {
				estadoOrdenacion[tipoGrafico].campo = campoOrden;
				estadoOrdenacion[tipoGrafico].ascendente = true;
			}

			actualizarIconosOrdenamiento(tipoGrafico);
			generarGraficos();
		});
	});
}

// Actualizar iconos de ordenamiento
function actualizarIconosOrdenamiento(tipoGrafico) {
	const botonesGrafico = document.querySelectorAll(`.orden-btn[data-grafico="${tipoGrafico}"]`);

	botonesGrafico.forEach((boton) => {
		const campoBoton = boton.getAttribute('data-orden');
		const iconoEl = boton.querySelector('i');

		iconoEl.className = '';

		if (estadoOrdenacion[tipoGrafico].campo === campoBoton) {
			boton.classList.add('orden-activo');
			if (estadoOrdenacion[tipoGrafico].ascendente) {
				iconoEl.className = 'fas fa-sort-up';
			} else {
				iconoEl.className = 'fas fa-sort-down';
			}
		} else {
			boton.classList.remove('orden-activo');
			iconoEl.className = 'fas fa-sort';
		}
	});
}

// Función principal para generar/actualizar gráficos
function generarGraficos() {
	const pacientes = obtenerDatosPacientes();

	if (pacientes.length === 0) {
		mostrarPlaceholders();
		showInfoNotification('No hay pacientes para generar estadísticas', 'Estadísticas');
		return;
	}

	if (pacientes.length < 3) {
		showWarningNotification(
			'Se recomienda tener al menos 3 pacientes para estadísticas más precisas',
			'Pocos datos',
			6000
		);
	}

	generarGraficoIMC(pacientes);
	generarGraficoPeso(pacientes);
	generarGraficoGordura(pacientes);
}

// Mostrar gráficos placeholder cuando no hay datos
function mostrarPlaceholders() {
	const placeholderOpts = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			title: {
				display: true,
				text: 'No hay datos disponibles',
				font: {
					size: 18,
				},
			},
			subtitle: {
				display: true,
				text: 'Agrega pacientes para visualizar estadísticas',
				padding: {
					bottom: 10,
				},
			},
		},
	};

	// Placeholder para IMC
	const ctxIMC = document.getElementById('grafico-imc').getContext('2d');
	if (graficoIMC) graficoIMC.destroy();
	graficoIMC = new Chart(ctxIMC, {
		type: 'bar',
		data: { datasets: [{ data: [] }] },
		options: placeholderOpts,
	});

	// Placeholder para Peso
	const ctxPeso = document.getElementById('grafico-peso').getContext('2d');
	if (graficoPeso) graficoPeso.destroy();
	graficoPeso = new Chart(ctxPeso, {
		type: 'line',
		data: { datasets: [{ data: [] }] },
		options: placeholderOpts,
	});

	// Placeholder para Gordura
	const ctxGordura = document.getElementById('grafico-gordura').getContext('2d');
	if (graficoGordura) graficoGordura.destroy();
	graficoGordura = new Chart(ctxGordura, {
		type: 'pie',
		data: { datasets: [{ data: [] }] },
		options: placeholderOpts,
	});

	// Actualizar estadísticas con valores vacíos
	document.getElementById('imc-promedio').textContent = '0.00';
	document.getElementById('imc-maximo').textContent = '0.00';
	document.getElementById('imc-minimo').textContent = '0.00';
	document.getElementById('peso-promedio').textContent = '0.0';
	document.getElementById('peso-maximo').textContent = '0.0';
	document.getElementById('peso-minimo').textContent = '0.0';
	document.getElementById('gordura-promedio').textContent = '0.0';
	document.getElementById('gordura-maximo').textContent = '0.0';
	document.getElementById('gordura-minimo').textContent = '0.0';
}

// Obtener datos de los pacientes desde la tabla
function obtenerDatosPacientes() {
	const filasPacientes = document.querySelectorAll('#tabla-pacientes .paciente');
	let pacientes = [];

	filasPacientes.forEach((fila) => {
		const nombre = fila.querySelector('.info-nombre').textContent;
		const peso = parseFloat(fila.querySelector('.info-peso').textContent);
		const altura = parseFloat(fila.querySelector('.info-altura').textContent);
		const gordura = parseFloat(fila.querySelector('.info-gordura').textContent);
		let imc = parseFloat(fila.querySelector('.info-imc').textContent);

		// Si el IMC no es válido, calcularlo
		if (isNaN(imc)) {
			if (!isNaN(peso) && !isNaN(altura)) {
				imc = calcularIMC(peso, altura);
			} else {
				imc = 0;
			}
		}

		// Verificar que todos los datos sean válidos
		if (nombre && !isNaN(peso) && !isNaN(altura) && !isNaN(gordura) && !isNaN(imc)) {
			pacientes.push({
				nombre,
				peso,
				altura,
				gordura,
				imc,
			});
		}
	});

	return pacientes;
}

// Ordenar pacientes según el criterio actual
function ordenarPacientes(pacientes, tipoGrafico) {
	const { campo, ascendente } = estadoOrdenacion[tipoGrafico];

	return [...pacientes].sort((a, b) => {
		if (campo === 'nombre') {
			return ascendente ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre);
		}

		return ascendente ? a[campo] - b[campo] : b[campo] - a[campo];
	});
}

// Generar gráfico de IMC
function generarGraficoIMC(pacientes) {
	const pacientesOrdenados = ordenarPacientes(pacientes, 'imc');

	// Calcular estadísticas de IMC
	const imcs = pacientes.map((p) => p.imc);
	const imcPromedio = calcularPromedio(imcs).toFixed(2);
	const imcMaximo = Math.max(...imcs).toFixed(2);
	const imcMinimo = Math.min(...imcs).toFixed(2);

	// Actualizar elementos HTML con las estadísticas
	document.getElementById('imc-promedio').textContent = imcPromedio;
	document.getElementById('imc-maximo').textContent = imcMaximo;
	document.getElementById('imc-minimo').textContent = imcMinimo;

	// Procesar datos para el gráfico
	const nombres = pacientesOrdenados.map((p) => p.nombre);
	const valores = pacientesOrdenados.map((p) => p.imc);

	// Colores según categoría IMC con mejor accesibilidad
	const colores = valores.map((imc) => {
		if (imc < 18.5) return 'rgba(255, 193, 7, 0.85)'; // Bajo peso - Amarillo más contrastante
		if (imc < 25) return 'rgba(40, 167, 69, 0.85)'; // Normal - Verde
		if (imc < 30) return 'rgba(255, 152, 0, 0.85)'; // Sobrepeso - Naranja
		return 'rgba(220, 53, 69, 0.85)'; // Obesidad - Rojo
	});

	// Obtener el contexto del canvas
	const ctx = document.getElementById('grafico-imc').getContext('2d');

	// Destruir gráfico anterior si existe
	if (graficoIMC) {
		graficoIMC.destroy();
	}

	// Crear nuevo gráfico
	graficoIMC = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: nombres,
			datasets: [
				{
					label: 'IMC',
					data: valores,
					backgroundColor: colores,
					borderColor: colores.map((c) => c.replace('0.85', '1')),
					borderWidth: 1,
					borderRadius: 4,
					barThickness: 'flex',
					maxBarThickness: 35,
					minBarLength: 5,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: {
				duration: 1000,
				easing: 'easeOutQuart',
			},
			plugins: {
				title: {
					display: true,
					text: 'Índice de Masa Corporal por Paciente',
					font: {
						size: 16,
						weight: 'bold',
					},
					padding: {
						top: 10,
						bottom: 15,
					},
				},
				legend: {
					display: false,
				},
				tooltip: {
					backgroundColor: 'rgba(0, 0, 0, 0.8)',
					padding: 12,
					titleFont: {
						size: 14,
						weight: 'bold',
					},
					bodyFont: {
						size: 13,
					},
					cornerRadius: 6,
					callbacks: {
						title: function (context) {
							return context[0].label;
						},
						label: function (context) {
							return `IMC: ${context.raw.toFixed(2)}`;
						},
						afterLabel: function (context) {
							const imc = context.raw;
							let estado = '';
							if (imc < 18.5) estado = 'Bajo peso';
							else if (imc < 25) estado = 'Normal';
							else if (imc < 30) estado = 'Sobrepeso';
							else estado = 'Obesidad';
							return 'Estado: ' + estado;
						},
					},
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					title: {
						display: true,
						text: 'IMC',
						font: {
							weight: 'bold',
						},
					},
					grid: {
						display: true,
						color: 'rgba(0, 0, 0, 0.05)',
					},
					ticks: {
						font: {
							size: 11,
						},
					},
				},
				x: {
					ticks: {
						font: {
							size: 11,
						},
						maxRotation: 45,
						minRotation: 45,
					},
					grid: {
						display: false,
					},
				},
			},
		},
	});
}

// Generar gráfico de Peso
function generarGraficoPeso(pacientes) {
	const pacientesOrdenados = ordenarPacientes(pacientes, 'peso');

	// Calcular estadísticas de peso
	const pesos = pacientes.map((p) => p.peso);
	const pesoPromedio = calcularPromedio(pesos).toFixed(1);
	const pesoMaximo = Math.max(...pesos).toFixed(1);
	const pesoMinimo = Math.min(...pesos).toFixed(1);

	// Actualizar elementos HTML con las estadísticas
	document.getElementById('peso-promedio').textContent = pesoPromedio;
	document.getElementById('peso-maximo').textContent = pesoMaximo;
	document.getElementById('peso-minimo').textContent = pesoMinimo;

	const nombres = pacientesOrdenados.map((p) => p.nombre);
	const valores = pacientesOrdenados.map((p) => p.peso);

	const ctx = document.getElementById('grafico-peso').getContext('2d');

	// Destruir gráfico anterior si existe
	if (graficoPeso) {
		graficoPeso.destroy();
	}

	// Crear nuevo gráfico
	graficoPeso = new Chart(ctx, {
		type: 'line',
		data: {
			labels: nombres,
			datasets: [
				{
					label: 'Peso (kg)',
					data: valores,
					backgroundColor: 'rgba(54, 162, 235, 0.3)',
					borderColor: 'rgba(54, 162, 235, 1)',
					borderWidth: 2.5,
					tension: 0.3,
					pointBackgroundColor: 'rgba(54, 162, 235, 1)',
					pointBorderColor: '#fff',
					pointBorderWidth: 2,
					pointRadius: 5,
					pointHoverRadius: 7,
					pointHoverBorderWidth: 3,
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
					fill: true,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: {
				duration: 1200,
				easing: 'easeOutQuart',
			},
			interaction: {
				mode: 'index',
				intersect: false,
			},
			plugins: {
				title: {
					display: true,
					text: 'Distribución de Peso por Paciente',
					font: {
						size: 16,
						weight: 'bold',
					},
					padding: {
						top: 10,
						bottom: 15,
					},
				},
				tooltip: {
					backgroundColor: 'rgba(0, 0, 0, 0.8)',
					padding: 12,
					titleFont: {
						size: 14,
						weight: 'bold',
					},
					bodyFont: {
						size: 13,
					},
					cornerRadius: 6,
					callbacks: {
						title: function (context) {
							return context[0].label;
						},
						label: function (context) {
							return `Peso: ${context.raw.toFixed(1)} kg`;
						},
					},
				},
			},
			scales: {
				y: {
					beginAtZero: false,
					suggestedMin: Math.max(0, pesoMinimo * 0.9), // Empezar en 0 o un poco menos del mínimo
					title: {
						display: true,
						text: 'Peso (kg)',
						font: {
							weight: 'bold',
						},
					},
					grid: {
						display: true,
						color: 'rgba(0, 0, 0, 0.05)',
					},
					ticks: {
						font: {
							size: 11,
						},
					},
				},
				x: {
					ticks: {
						font: {
							size: 11,
						},
						maxRotation: 45,
						minRotation: 45,
					},
					grid: {
						display: false,
					},
				},
			},
		},
	});
}

// Generar gráfico de Gordura
function generarGraficoGordura(pacientes) {
	// Calcular estadísticas de gordura
	const gorduras = pacientes.map((p) => p.gordura);
	const gorduraPromedio = calcularPromedio(gorduras).toFixed(1);
	const gorduraMaxima = Math.max(...gorduras).toFixed(1);
	const gorduraMinima = Math.min(...gorduras).toFixed(1);

	// Actualizar elementos HTML con las estadísticas
	document.getElementById('gordura-promedio').textContent = gorduraPromedio;
	document.getElementById('gordura-maximo').textContent = gorduraMaxima;
	document.getElementById('gordura-minimo').textContent = gorduraMinima;

	// Obtener el contexto del canvas
	const ctx = document.getElementById('grafico-gordura').getContext('2d');

	// Destruir gráfico anterior si existe
	if (graficoGordura) {
		graficoGordura.destroy();
	}

	// Agrupar pacientes por rangos de gordura para un gráfico de pastel
	const rangos = {
		'Menos de 15%': 0,
		'15% - 20%': 0,
		'20% - 25%': 0,
		'25% - 30%': 0,
		'Más de 30%': 0,
	};

	pacientes.forEach((p) => {
		if (p.gordura < 15) rangos['Menos de 15%']++;
		else if (p.gordura < 20) rangos['15% - 20%']++;
		else if (p.gordura < 25) rangos['20% - 25%']++;
		else if (p.gordura < 30) rangos['25% - 30%']++;
		else rangos['Más de 30%']++;
	});

	// Colores para los rangos (colores más accesibles)
	const colores = [
		'rgba(75, 192, 192, 0.9)', // Verde azulado
		'rgba(54, 162, 235, 0.9)', // Azul
		'rgba(255, 205, 86, 0.9)', // Amarillo
		'rgba(255, 159, 64, 0.9)', // Naranja
		'rgba(255, 99, 132, 0.9)', // Rojo
	];

	// Crear gráfico
	graficoGordura = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: Object.keys(rangos),
			datasets: [
				{
					data: Object.values(rangos),
					backgroundColor: colores,
					borderColor: '#fff',
					borderWidth: 2,
					hoverOffset: 15,
					hoverBorderWidth: 3,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: {
				duration: 1400,
				animateRotate: true,
				animateScale: true,
			},
			plugins: {
				title: {
					display: true,
					text: 'Distribución por % de Gordura',
					font: {
						size: 16,
						weight: 'bold',
					},
					padding: {
						top: 10,
						bottom: 15,
					},
				},
				legend: {
					position: 'right',
					labels: {
						font: {
							size: 12,
						},
						padding: 15,
						usePointStyle: true,
						pointStyle: 'circle',
					},
				},
				tooltip: {
					backgroundColor: 'rgba(0, 0, 0, 0.8)',
					padding: 12,
					titleFont: {
						size: 14,
						weight: 'bold',
					},
					bodyFont: {
						size: 13,
					},
					cornerRadius: 6,
					callbacks: {
						title: function (context) {
							return context[0].label;
						},
						label: function (context) {
							const valor = context.raw;
							const total = context.dataset.data.reduce((a, b) => a + b, 0);
							const porcentaje = Math.round((valor / total) * 100);
							return `${valor} paciente${valor !== 1 ? 's' : ''} (${porcentaje}%)`;
						},
					},
				},
			},
			layout: {
				padding: {
					left: 10,
					right: 10,
				},
			},
		},
	});
}

// Función auxiliar para calcular promedio
function calcularPromedio(valores) {
	if (valores.length === 0) return 0;
	return valores.reduce((a, b) => a + b, 0) / valores.length;
}

// Observar cambios en la tabla de pacientes para actualizar gráficos
function observarCambiosPacientes() {
	const tablaPacientes = document.querySelector('#tabla-pacientes');

	const observer = new MutationObserver(function () {
		generarGraficos();
	});

	observer.observe(tablaPacientes, { childList: true, subtree: true });

	// También actualizar gráficos cuando se edite un paciente
	document.addEventListener('pacienteActualizado', function () {
		generarGraficos();
	});

	// Escuchar evento de eliminación de paciente
	document.addEventListener('pacienteEliminado', function (e) {
		showInfoNotification(
			`Actualizando gráficos tras eliminar a ${e.detail.nombre}`,
			'Gráficos actualizados',
			3000
		);
		generarGraficos();
	});
}

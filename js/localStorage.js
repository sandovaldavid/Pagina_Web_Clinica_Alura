/*
 * Module to manage local storage of patients
 * Allows data persistence between browser sessions
 * @module localStorage
 */

// Key for saving data in localStorage
const STORAGE_KEY = 'buonavita_pacientes';

// Function to save all patients in localStorage
function guardarPacientesLocal() {
	const tabla = document.querySelector('#tabla-pacientes');
	const pacientes = tabla.querySelectorAll('.paciente');

	const pacientesData = [];

	// To search each patient in the table and get their data
	pacientes.forEach((paciente) => {
		const pacienteData = {
			nombre: paciente.querySelector('.info-nombre').textContent,
			peso: paciente.querySelector('.info-peso').textContent,
			altura: paciente.querySelector('.info-altura').textContent,
			gordura: paciente.querySelector('.info-gordura').textContent,
		};
		pacientesData.push(pacienteData);
	});

	// Convert the data to JSON and save it in localStorage
	localStorage.setItem(STORAGE_KEY, JSON.stringify(pacientesData));

	// Show success message
	mostrarMensajeExito('Datos guardados localmente');

	return pacientesData.length; // Return the number of patients saved
}

// Function to check if a patient already exists in the table
function cargarPacientesLocal() {
	// Check if there are saved data
	if (!localStorage.getItem(STORAGE_KEY)) {
		console.log('No hay datos guardados en localStorage');
		return 0;
	}

	try {
		// Parse the data from localStorage
		const pacientesData = JSON.parse(localStorage.getItem(STORAGE_KEY));
		const tabla = document.querySelector('#tabla-pacientes');

		// Clear the table before loading new data
		tabla.innerHTML = '';

		// Load each patient into the table
		let contador = 0;
		pacientesData.forEach((pacienteData) => {
			// Check if the patient already exists in the table
			if (!pacienteExiste(pacienteData.nombre)) {
				adicionarPacienteEnLaTabla(pacienteData);
				contador++;
			}
		});

		// Show success message if patients were loaded
		if (contador > 0) {
			console.log(`Se cargaron ${contador} pacientes desde almacenamiento local`);
		}

		return contador; // Return the number of patients loaded
	} catch (error) {
		console.error('Error al cargar datos desde localStorage:', error);
		return 0;
	}
}

// Function to clear all data from localStorage
function limpiarDatosLocal() {
	localStorage.removeItem(STORAGE_KEY);
	mostrarMensajeExito('Almacenamiento local limpiado');
}

// Verify if there are data when loading the page
document.addEventListener('DOMContentLoaded', function () {
	const pacientesCargados = cargarPacientesLocal();

	if (pacientesCargados > 0) {
		mostrarMensajeExito(`Se cargaron ${pacientesCargados} pacientes guardados`);
	}

	// setting up auto-save when the page loads
	setupAutoSave();
});

// Setting up auto-save
function setupAutoSave() {
	// Hear changes in the patient table (additions or deletions)
	const tablaPacientes = document.querySelector('#tabla-pacientes');

	// Using MutationObserver to detect changes in the DOM
	const observer = new MutationObserver(function (mutations) {
		guardarPacientesLocal();
	});

	// Observe the table for changes in its children
	observer.observe(tablaPacientes, { childList: true });
}

// Add event listener for the clear storage button
document.addEventListener('DOMContentLoaded', function () {
	// Configuration for the button to clear data
	const botonLimpiar = document.querySelector('#limpiar-storage');
	if (botonLimpiar) {
		botonLimpiar.addEventListener('click', function () {
			if (
				confirm(
					'¿Estás seguro que deseas borrar todos los datos guardados? Esta acción no se puede deshacer.'
				)
			) {
				// Clear local storage
				limpiarDatosLocal();

				// Clean the patient table
				if (confirm('¿Deseas también limpiar la tabla de pacientes?')) {
					const tabla = document.querySelector('#tabla-pacientes');
					tabla.innerHTML = '';
					mostrarMensajeExito('Se han eliminado todos los pacientes');
				}
			}
		});
	}
});

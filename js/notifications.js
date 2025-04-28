/*
 * Modulo de notificaciones
 */

// Crear el contenedor principal para las notificaciones si no existe
if (!document.querySelector('.notification-container')) {
	const container = document.createElement('div');
	container.className = 'notification-container';
	document.body.appendChild(container);
}

// Contador para IDs únicos de notificaciones
let notificationIdCounter = 0;

/**
 * @param {string} message - El mensaje a mostrar
 * @param {string} type - El tipo de notificación: 'success', 'error', 'warning', 'info', 'delete', 'update', 'alert'
 * @param {string} title - El título de la notificación (opcional)
 * @param {number} duration - Duración en ms antes de desaparecer (por defecto 5000ms, 0 para no desaparecer)
 * @returns {string} - ID de la notificación creada
 */
function showNotification(message, type = 'info', title = '', duration = 5000) {
	const container = document.querySelector('.notification-container');
	const id = `notification-${notificationIdCounter++}`;

	// Iconos según el tipo de notificación
	const icons = {
		success: '<i class="fas fa-check-circle"></i>',
		error: '<i class="fas fa-times-circle"></i>',
		warning: '<i class="fas fa-exclamation-triangle"></i>',
		info: '<i class="fas fa-info-circle"></i>',
		delete: '<i class="fas fa-trash-alt"></i>',
		update: '<i class="fas fa-sync-alt"></i>',
		alert: '<i class="fas fa-bell"></i>',
	};

	// Títulos predeterminados si no se especifica uno
	const defaultTitles = {
		success: 'Éxito',
		error: 'Error',
		warning: 'Advertencia',
		info: 'Información',
		delete: 'Eliminación',
		update: 'Actualización',
		alert: 'Aviso',
	};

	// Usar título predeterminado si no se proporciona uno
	const notificationTitle = title || defaultTitles[type] || 'Notificación';

	// Crear elemento de notificación
	const notification = document.createElement('div');
	notification.className = `notification ${type}`;
	notification.id = id;

	// Estructura HTML de la notificación
	notification.innerHTML = `
        <div class="icon">${icons[type] || icons.info}</div>
        <div class="content">
            <div class="title">${notificationTitle}</div>
            <div class="message">${message}</div>
        </div>
        <button class="close">&times;</button>
        <div class="progress">
            <div class="progress-bar"></div>
        </div>
    `;

	// Agregar al contenedor
	container.appendChild(notification);

	// Aplicar animación de entrada después de un pequeño retraso (para que se active la transición)
	setTimeout(() => {
		notification.classList.add('show');
	}, 10);

	// Configurar la barra de progreso si hay duración
	const progressBar = notification.querySelector('.progress-bar');
	if (duration > 0 && progressBar) {
		progressBar.style.animation = `progress ${duration / 1000}s linear forwards`;
	}

	// Configurar el cierre automático
	let timeoutId;
	if (duration > 0) {
		timeoutId = setTimeout(() => {
			closeNotification(id);
		}, duration);
	}

	// Evento para cerrar manualmente
	const closeButton = notification.querySelector('.close');
	if (closeButton) {
		closeButton.addEventListener('click', () => {
			clearTimeout(timeoutId);
			closeNotification(id);
		});
	}

	return id;
}

/**
 * * Cierre de una notificación específica
 * @param {string} id - ID de la notificación a cerrar
 */
function closeNotification(id) {
	const notification = document.getElementById(id);
	if (notification) {
		notification.classList.add('hide');
		notification.classList.remove('show');

		// Eliminar del DOM después de la animación
		setTimeout(() => {
			if (notification.parentNode) {
				notification.parentNode.removeChild(notification);
			}
		}, 300);
	}
}

/**
 * * Muestra una notificación de éxito
 * @param {string} message - Mensaje a mostrar
 * @param {string} title - Título opcional
 * @param {number} duration - Duración en ms
 */
function showSuccessNotification(message, title = '', duration = 5000) {
	return showNotification(message, 'success', title, duration);
}

/**
 * * Muestra una notificación de error
 * @param {string} message - Mensaje a mostrar
 * @param {string} title - Título opcional
 * @param {number} duration - Duración en ms
 */
function showErrorNotification(message, title = '', duration = 5000) {
	return showNotification(message, 'error', title, duration);
}

/**
 * * Muestra una notificación de advertencia
 * @param {string} message - Mensaje a mostrar
 * @param {string} title - Título opcional
 * @param {number} duration - Duración en ms
 */
function showWarningNotification(message, title = '', duration = 5000) {
	return showNotification(message, 'warning', title, duration);
}

/**
 * * Muestra una notificación informativa
 * @param {string} message - Mensaje a mostrar
 * @param {string} title - Título opcional
 * @param {number} duration - Duración en ms
 */
function showInfoNotification(message, title = '', duration = 5000) {
	return showNotification(message, 'info', title, duration);
}

/**
 * * Muestra una notificación de eliminación
 * @param {string} message - Mensaje a mostrar
 * @param {string} title - Título opcional
 * @param {number} duration - Duración en ms
 */
function showDeleteNotification(message, title = '', duration = 5000) {
	return showNotification(message, 'delete', title, duration);
}

/**
 * * Muestra una notificación de actualización
 * @param {string} message - Mensaje a mostrar
 * @param {string} title - Título opcional
 * @param {number} duration - Duración en ms
 */
function showUpdateNotification(message, title = '', duration = 5000) {
	return showNotification(message, 'update', title, duration);
}

/**
 * * Muestra una notificación de aviso
 * @param {string} message - Mensaje a mostrar
 * @param {string} title - Título opcional
 * @param {number} duration - Duración en ms
 */
function showAlertNotification(message, title = '', duration = 5000) {
	return showNotification(message, 'alert', title, duration);
}

/*
 * Cierra todas las notificaciones activas
 */
function closeAllNotifications() {
	const notifications = document.querySelectorAll('.notification');
	notifications.forEach((notification) => {
		if (notification.id) {
			closeNotification(notification.id);
		}
	});
}

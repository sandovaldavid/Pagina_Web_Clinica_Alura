const CACHE_NAME = 'buonavita-cache-v2.1.0';

// Archivos a cachear para funcionamiento offline
const CACHE_ASSETS = [
	'/',
	'/index.html',
	'/manifest.json',
	'/css/reset.css',
	'/css/index.css',
	'/css/footer.css',
	'/css/graphics.css',
	'/css/notifications.css',
	'/js/calcular-imc.js',
	'/js/notifications.js',
	'/js/form.js',
	'/js/eliminar-paciente.js',
	'/js/filtrar.js',
	'/js/buscar_pacientes.js',
	'/js/localStorage.js',
	'/js/editar-paciente.js',
	'/js/graphics.js',
	'/images/icons/favicon-16x16.png',
	'/images/icons/favicon-32x32.png',
	'/images/icons/apple-touch-icon.png',
	'/images/icons/android-chrome-192x192.png',
	'/images/icons/android-chrome-512x512.png',
	'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
	'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
	'https://cdn.jsdelivr.net/npm/chart.js',
];

// Instalar el service worker y cachear archivos estáticos
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then((cache) => {
				console.log('Cacheando archivos estáticos');
				return cache.addAll(CACHE_ASSETS);
			})
			.then(() => self.skipWaiting())
	);
});

// Activar y limpiar caches obsoletos
self.addEventListener('activate', (event) => {
	const cacheWhitelist = [CACHE_NAME];

	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames.map((cacheName) => {
						if (!cacheWhitelist.includes(cacheName)) {
							console.log('Eliminando caché obsoleto:', cacheName);
							return caches.delete(cacheName);
						}
					})
				);
			})
			.then(() => self.clients.claim())
	);
});

// Estrategia de caché: Network first, luego cache (para contenido que cambia)
self.addEventListener('fetch', (event) => {
	event.respondWith(
		fetch(event.request)
			.then((response) => {
				if (response && response.status === 200 && response.type === 'basic') {
					const responseToCache = response.clone();
					caches.open(CACHE_NAME).then((cache) => {
						cache.put(event.request, responseToCache);
					});
				}
				return response;
			})
			.catch(() => {
				return caches.match(event.request).then((cachedResponse) => {
					if (cachedResponse) {
						return cachedResponse;
					}

					// Para solicitudes de navegación (HTML), mostrar página offline
					if (event.request.mode === 'navigate') {
						return caches.match('/index.html');
					}

					// Si no hay respuesta en caché, devolver un error
					return new Response('No hay conexión a internet', {
						status: 503,
						statusText: 'Service Unavailable',
						headers: new Headers({
							'Content-Type': 'text/plain',
						}),
					});
				});
			})
	);
});

/* carrusel */
document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const deleteImageBtn = document.getElementById('deleteImageBtn');
    const carouselInner = document.querySelector('#carouselExampleAutoplaying .carousel-inner');

    // Función para inicializar el carrusel
    const initializeCarousel = () => {
        const carousel = new bootstrap.Carousel(document.querySelector('#carouselExampleAutoplaying'), {
            interval: 5000, // Intervalo de 5 segundos
            ride: 'carousel'
        });
    };

    // Cargar imágenes iniciales desde la API
    fetch('/images')
        .then(response => response.json())
        .then(images => {
            images.forEach((src, index) => {
                const newImage = document.createElement('div');
                newImage.classList.add('carousel-item');
                if (index === 0) {
                    newImage.classList.add('active');
                    newImage.innerHTML = `<img src="${src}" class="d-block w-100" alt="..." rel="preload">`;
                } else {
                    newImage.innerHTML = `<img src="${src}" class="d-block w-100" alt="..." loading="lazy">`;
                }
                carouselInner.appendChild(newImage);
            });

            // Inicializar el carrusel después de cargar las imágenes
            initializeCarousel();
        });

    imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const newImage = document.createElement('div');
                newImage.classList.add('carousel-item');
                newImage.innerHTML = `<img src="${e.target.result}" class="d-block w-100" alt="..." loading="lazy">`;
                carouselInner.appendChild(newImage);

                // Guardar imagen en la API
                fetch('/images', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image: e.target.result })
                }).then(response => response.json()).then(() => {
                    const items = carouselInner.querySelectorAll('.carousel-item');
                    if (items.length === 1) {
                        items[0].classList.add('active');
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    });

    deleteImageBtn.addEventListener('click', function() {
        const activeItem = carouselInner.querySelector('.carousel-item.active');
        if (!activeItem) return;

        const items = carouselInner.querySelectorAll('.carousel-item');
        if (items.length > 1) {
            const activeIndex = Array.from(items).indexOf(activeItem);

            fetch(`/images/${activeIndex}`, {
                method: 'DELETE'
            }).then(() => {
                activeItem.remove();
                const remainingItems = carouselInner.querySelectorAll('.carousel-item');
                if (activeIndex >= remainingItems.length) {
                    remainingItems[remainingItems.length - 1].classList.add('active');
                } else {
                    remainingItems[activeIndex].classList.add('active');
                }
            });
        } else {
            alert('No se puede eliminar la única imagen.');
        }
    });
});

/* Menu hamburguesa */
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navegacion = document.querySelector('.navegacion');

    menuToggle.addEventListener('click', function() {
        navegacion.classList.toggle('show');
    });
});

// Inciar sesion
function login() {
    const predefinedUsername = 'cristian';
    const predefinedPassword = '12345';

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === predefinedUsername && password === predefinedPassword) {
        alert('Inicio de sesión exitoso');
        localStorage.setItem('loggedIn', 'true'); // Guardar el estado de la sesión
        window.location.href = 'index-admin.html';
    } else {
        alert('Nombre de usuario o contraseña incorrectos');
    }
}

// Verificar si el usuario ha iniciado sesión
function checkLoginStatus() {
    if (localStorage.getItem('loggedIn') !== 'true') {
        alert('Debe iniciar sesión para acceder a esta página.');
        window.location.href = 'sesion.html'; // Redirigir a la página de inicio de sesión
    }
}

// Ejecutar la verificación de sesión solo en index-admin.html y menus.html
if (window.location.pathname.endsWith('index-admin.html') || window.location.pathname.endsWith('menu-admin.html') || window.location.pathname.endsWith('index-admin') || window.location.pathname.endsWith('menu-admin')) {
    checkLoginStatus();
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('loggedIn'); // Eliminar el estado de la sesión
}
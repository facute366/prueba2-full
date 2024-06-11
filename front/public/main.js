/* carrusel */
document.addEventListener('DOMContentLoaded', () => {
    const imageInput = document.getElementById('imageInput');
    const deleteImageBtn = document.getElementById('deleteImageBtn');
    const carouselInner = document.querySelector('#carouselExampleAutoplaying .carousel-inner');
    const apiUrl = 'https://probando-back-1.onrender.com'; // URL del backend

    // Función para inicializar el carrusel
    const initializeCarousel = () => {
        const carousel = new bootstrap.Carousel(document.querySelector('#carouselExampleAutoplaying'), {
            interval: 5000, // Intervalo de 5 segundos
            ride: 'carousel'
        });
    };

    // Cargar imágenes iniciales desde la API
    fetch(`${apiUrl}/images`)
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
                fetch(`${apiUrl}/images`, {
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

            fetch(`${apiUrl}/images/${activeIndex}`, {
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


//footer
let mainFooter = document.querySelector(".nav-footer"),
contactFooter = document.querySelector(".contact-footer");

function eliminarElementosEnResponsive(mediaQuery) {
    if (mediaQuery.matches) {
        // Agregar la clase "none" si el ancho de la ventana es igual o menor a 768px
        mainFooter.classList.add("none");
        contactFooter.classList.add("none");
    } else {
        // Quitar la clase "none" si el ancho de la ventana es mayor a 768px
        mainFooter.classList.remove("none");
        contactFooter.classList.remove("none");
    }
}
// Crear una instancia de MediaQueryList con la consulta para 768px o menos
let mediaQuery = window.matchMedia("(max-width: 768px)");

// Llamar a la función para verificar el estado inicial
eliminarElementosEnResponsive(mediaQuery);

// Agregar un listener para verificar si cambia el estado de la ventana
mediaQuery.addListener(eliminarElementosEnResponsive);

//funciones para el menu-admin 
/*
let categoryCount = 0;
let subcategoryCount = 0;

document.addEventListener("DOMContentLoaded", function() {
    loadFromLocalStorage();
});




let categoryCount = 0;
let subcategoryCount = 0;

document.addEventListener("DOMContentLoaded", function() {
    loadFromLocalStorage();
});

function addCategory() {
    const categoryTitle = prompt("Nombre de la categoría:");
    if (categoryTitle) {
        const categoryId = `category-${categoryCount}`;
        createCategoryElement(categoryId, categoryTitle);
        saveCategoryToLocalStorage(categoryId, categoryTitle);
        categoryCount++;
    }
}

function addSubcategory(categoryId) {
    const subcategoryTitle = prompt("Nombre de la subcategoría:");
    if (subcategoryTitle) {
        const subcategoryId = `subcategory-${subcategoryCount}`;
        createSubcategoryElement(categoryId, subcategoryId, subcategoryTitle);
        saveSubcategoryToLocalStorage(categoryId, subcategoryId, subcategoryTitle);
        subcategoryCount++;
    }
}

function addProduct(subcategoryId) {
    const productName = prompt("Nombre del producto:");
    const productDescription = prompt("Descripción del producto:");
    const productPrice = prompt("Precio del producto:");
    if (productName && productDescription && productPrice) {
        createProductElement(subcategoryId, productName, productDescription, productPrice);
        saveProductToLocalStorage(subcategoryId, productName, productDescription, productPrice);
    }
}

function editCategory(categoryId) {
    const categoryTitle = prompt("Nuevo nombre de la categoría:");
    if (categoryTitle) {
        document.querySelector(`#${categoryId} h2`).textContent = categoryTitle;
        updateCategoryInLocalStorage(categoryId, categoryTitle);
    }
}

function deleteCategory(categoryId) {
    document.getElementById(categoryId).remove();
    removeCategoryFromLocalStorage(categoryId);
}

function editSubcategory(categoryId, subcategoryId) {
    const subcategoryTitle = prompt("Nuevo nombre de la subcategoría:");
    if (subcategoryTitle) {
        document.querySelector(`#${subcategoryId} h3`).textContent = subcategoryTitle;
        updateSubcategoryInLocalStorage(categoryId, subcategoryId, subcategoryTitle);
    }
}

function deleteSubcategory(categoryId, subcategoryId) {
    document.getElementById(subcategoryId).remove();
    removeSubcategoryFromLocalStorage(categoryId, subcategoryId);
}

function editProduct(subcategoryId, productIndex) {
    const productName = prompt("Nuevo nombre del producto:");
    const productDescription = prompt("Nueva descripción del producto:");
    const productPrice = prompt("Nuevo precio del producto:");
    if (productName && productDescription && productPrice) {
        const product = { name: productName, description: productDescription, price: productPrice };
        updateProductElement(subcategoryId, productIndex, product);
        updateProductInLocalStorage(subcategoryId, productIndex, product);
    }
}

function deleteProduct(subcategoryId, productIndex) {
    document.querySelector(`#products-${subcategoryId}`).children[productIndex].remove();
    removeProductFromLocalStorage(subcategoryId, productIndex);
}

function createCategoryElement(categoryId, categoryTitle) {
    const carta = document.getElementById('carta');
    const categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.id = categoryId;

    categoryDiv.innerHTML = `
        <h2>${categoryTitle}</h2>
        <button class="btn-menu" onclick="editCategory('${categoryId}')">Editar Categoría</button>
        <button class="btn-menu" onclick="deleteCategory('${categoryId}')">Eliminar Categoría</button>
        <button class="btn-menu" onclick="addSubcategory('${categoryId}')">Agregar Subcategoría</button>
        <div id="subcategories-${categoryId}" class="subcategories"></div>
    `;

    carta.appendChild(categoryDiv);
}

function createSubcategoryElement(categoryId, subcategoryId, subcategoryTitle) {
    const subcategoriesDiv = document.getElementById(`subcategories-${categoryId}`);
    const subcategoryDiv = document.createElement('div');
    subcategoryDiv.classList.add('subcategory');
    subcategoryDiv.id = subcategoryId;

    subcategoryDiv.innerHTML = `
        <h3>${subcategoryTitle}</h3>
        <button class="btn-menu" onclick="editSubcategory('${categoryId}', '${subcategoryId}')">Editar Subcategoría</button>
        <button class="btn-menu" onclick="deleteSubcategory('${categoryId}', '${subcategoryId}')">Eliminar Subcategoría</button>
        <button class="btn-menu" onclick="addProduct('${subcategoryId}')">Agregar Producto</button>
        <div id="products-${subcategoryId}" class="products-row"></div>
    `;

    subcategoriesDiv.appendChild(subcategoryDiv);
}

function createProductElement(subcategoryId, productName, productDescription, productPrice, productIndex) {
    const productsDiv = document.getElementById(`products-${subcategoryId}`);
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    const currentProductIndex = productIndex !== undefined ? productIndex : productsDiv.children.length;

    productDiv.innerHTML = `
        <p><strong>Nombre:</strong> ${productName}</p>
        <p><strong>Descripción:</strong> ${productDescription}</p>
        <p><strong>Precio:</strong> $${productPrice}</p>
        <button class="btn-menu" onclick="editProduct('${subcategoryId}', ${currentProductIndex})">Editar Producto</button>
        <button class="btn-menu" onclick="deleteProduct('${subcategoryId}', ${currentProductIndex})">Eliminar Producto</button>
    `;

    productsDiv.appendChild(productDiv);
}

function updateProductElement(subcategoryId, productIndex, product) {
    const productDiv = document.querySelector(`#products-${subcategoryId}`).children[productIndex];
    productDiv.innerHTML = `
        <p><strong>Nombre:</strong> ${product.name}</p>
        <p><strong>Descripción:</strong> ${product.description}</p>
        <p><strong>Precio:</strong> $${product.price}</p>
        <button class="btn-menu" onclick="editProduct('${subcategoryId}', ${productIndex})">Editar Producto</button>
        <button class="btn-menu" onclick="deleteProduct('${subcategoryId}', ${productIndex})">Eliminar Producto</button>
    `;
}

function saveCategoryToLocalStorage(categoryId, categoryTitle) {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    categories.push({ id: categoryId, title: categoryTitle });
    localStorage.setItem('categories', JSON.stringify(categories));
}

function saveSubcategoryToLocalStorage(categoryId, subcategoryId, subcategoryTitle) {
    const subcategories = JSON.parse(localStorage.getItem('subcategories')) || {};
    if (!subcategories[categoryId]) {
        subcategories[categoryId] = [];
    }
    subcategories[categoryId].push({ id: subcategoryId, title: subcategoryTitle });
    localStorage.setItem('subcategories', JSON.stringify(subcategories));
}

function saveProductToLocalStorage(subcategoryId, productName, productDescription, productPrice) {
    const products = JSON.parse(localStorage.getItem('products')) || {};
    if (!products[subcategoryId]) {
        products[subcategoryId] = [];
    }
    products[subcategoryId].push({
        name: productName,
        description: productDescription,
        price: productPrice
    });
    localStorage.setItem('products', JSON.stringify(products));
}

function updateCategoryInLocalStorage(categoryId, categoryTitle) {
    const categories = JSON.parse(localStorage.getItem('categories'));
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
        category.title = categoryTitle;
        localStorage.setItem('categories', JSON.stringify(categories));
    }
}

function updateSubcategoryInLocalStorage(categoryId, subcategoryId, subcategoryTitle) {
    const subcategories = JSON.parse(localStorage.getItem('subcategories'));
    const subcategory = subcategories[categoryId].find(sub => sub.id === subcategoryId);
    if (subcategory) {
        subcategory.title = subcategoryTitle;
        localStorage.setItem('subcategories', JSON.stringify(subcategories));
    }
}

function removeCategoryFromLocalStorage(categoryId) {
    let categories = JSON.parse(localStorage.getItem('categories'));
    categories = categories.filter(cat => cat.id !== categoryId);
    localStorage.setItem('categories', JSON.stringify(categories));

    const subcategories = JSON.parse(localStorage.getItem('subcategories'));
    delete subcategories[categoryId];
    localStorage.setItem('subcategories', JSON.stringify(subcategories));

    const products = JSON.parse(localStorage.getItem('products'));
    for (const subcategoryId in products) {
        if (products.hasOwnProperty(subcategoryId) && subcategoryId.startsWith(categoryId)) {
            delete products[subcategoryId];
        }
    }
    localStorage.setItem('products', JSON.stringify(products));
}

function removeSubcategoryFromLocalStorage(categoryId, subcategoryId) {
    const subcategories = JSON.parse(localStorage.getItem('subcategories'));
    subcategories[categoryId] = subcategories[categoryId].filter(sub => sub.id !== subcategoryId);
    localStorage.setItem('subcategories', JSON.stringify(subcategories));

    const products = JSON.parse(localStorage.getItem('products'));
    delete products[subcategoryId];
    localStorage.setItem('products', JSON.stringify(products));
}

function updateProductInLocalStorage(subcategoryId, productIndex, product) {
    const products = JSON.parse(localStorage.getItem('products'));
    if (products[subcategoryId]) {
        products[subcategoryId][productIndex] = product;
        localStorage.setItem('products', JSON.stringify(products));
    }
}

function removeProductFromLocalStorage(subcategoryId, productIndex) {
    const products = JSON.parse(localStorage.getItem('products'));
    if (products[subcategoryId]) {
        products[subcategoryId].splice(productIndex, 1);
        localStorage.setItem('products', JSON.stringify(products));
    }
}

function loadFromLocalStorage() {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const subcategories = JSON.parse(localStorage.getItem('subcategories')) || {};
    const products = JSON.parse(localStorage.getItem('products')) || {};

    categories.forEach(category => {
        createCategoryElement(category.id, category.title);

        if (subcategories[category.id]) {
            subcategories[category.id].forEach(subcategory => {
                createSubcategoryElement(category.id, subcategory.id, subcategory.title);

                if (products[subcategory.id]) {
                    products[subcategory.id].forEach((product, index) => {
                        createProductElement(subcategory.id, product.name, product.description, product.price, index);
                    });
                }
                subcategoryCount++;
            });
        }
        categoryCount++;
    });
}*/

//funciones para el menu del cliente 
/* 
document.addEventListener('DOMContentLoaded', () => {
    function productosJSON(){
        fetch('./productos.json')
                .then(response => response.json())
                .then(data => {
                    const panaderiaData = data.Bakery.Panaderia;
                    const desayunoMerienda = data.Gourmet["Desayuno / Merienda"];
                    const almuerzoCena = data.Gourmet["Almuerzo / Cena"];
                    const bebidasData = data.Bebidas;

                    // Panadería
                    const panaderia = document.getElementById('panaderia');
                    if (panaderia) {
                        for (const categoria in panaderiaData) {
                            panaderiaData[categoria].forEach(producto => {
                                panaderia.innerHTML += `
                                    <div class="card">
                                        <img src="${producto.img}" alt="${producto.titulo}">
                                        <h3>${producto.titulo}</h3>
                                        <p>${producto.descripcion}</p>
                                        <p>Precio: $${producto.precio}</p>
                                    </div>
                                `;
                            });
                        }
                    }

                    // Desayuno / Merienda
                    const desayuno = document.getElementById('desayuno');
                    if (desayuno) {
                        for (const key in desayunoMerienda) {
                            if (Array.isArray(desayunoMerienda[key])) {
                                desayunoMerienda[key].forEach(producto => {
                                    desayuno.innerHTML += `
                                        <div class="card">
                                            <img src="${producto.imagen}" alt="${producto.titulo}">
                                            <h3>${producto.titulo}</h3>
                                            <p>${producto.descripcion}</p>
                                            <p>Precio: ${producto.precio}</p>
                                        </div>
                                    `;
                                });
                            } else {
                                const producto = desayunoMerienda[key];
                                desayuno.innerHTML += `
                                    <div class="card">
                                        <img src="${producto.imagen}" alt="${producto.titulo}">
                                        <h3>${producto.titulo}</h3>
                                        <p>${producto.descripcion}</p>
                                        <p>Precio: ${producto.precio}</p>
                                    </div>
                                `;
                            }
                        }
                    }

                    // Almuerzo / Cena
                    const almuerzo = document.getElementById('almuerzo');
                    if (almuerzo) {
                        for (const key in almuerzoCena) {
                            if (Array.isArray(almuerzoCena[key])) {
                                almuerzoCena[key].forEach(producto => {
                                    almuerzo.innerHTML += `
                                        <div class="card">
                                            <img src="${producto.imagen}" alt="${producto.titulo}">
                                            <h3>${producto.titulo}</h3>
                                            <p>${producto.descripcion}</p>
                                            <p>Precio: ${producto.precio}</p>
                                        </div>
                                    `;
                                });
                            } else {
                                const producto = almuerzoCena[key];
                                almuerzo.innerHTML += `
                                    <div class="card">
                                        <img src="${producto.imagen}" alt="${producto.titulo}">
                                        <h3>${producto.titulo}</h3>
                                        <p>${producto.descripcion}</p>
                                        <p>Precio: ${producto.precio}</p>
                                    </div>
                                `;
                            }
                        }
                    }

                    // Bebidas
                    const bebidas = document.getElementById('bebidas');
                    if (bebidas) {
                        for (const categoria in bebidasData) {
                            bebidasData[categoria].forEach(producto => {
                                bebidas.innerHTML += `
                                    <div class="card">
                                        <img src="${producto.imagen}" alt="${producto.titulo}">
                                        <h3>${producto.titulo}</h3>
                                        <p>${producto.descripcion}</p>
                                        <p>Precio: ${producto.precio}</p>
                                    </div>
                                `;
                            });
                        }
                    }
                })
                .catch(error => {
                    console.error('Error al cargar el archivo JSON:', error);
                });
    }

    productosJSON();
});*/

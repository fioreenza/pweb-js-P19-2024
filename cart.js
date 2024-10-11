console.log("Application initialized");

let cart = [];
const totalProducts = 200;
const productsPerPage = 20;
const totalPages = Math.ceil(totalProducts / productsPerPage);
let currentPage = 1;

async function fetchProducts(page) {
    const response = await fetch(`https://dummyjson.com/products?limit=${productsPerPage}&skip=${(page - 1) * productsPerPage}`);
    const data = await response.json();
    return data.products;
}

async function displayProducts(page) {
    const products = await fetchProducts(page);
    const menuGrid = document.querySelector('.menu-grid');
    menuGrid.innerHTML = '';

    products.forEach(product => {
        const menuItem = document.createElement('div');
        menuItem.classList.add('menu-item');

        menuItem.innerHTML = `
            <img src="${product.thumbnail}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p> $ ${product.price}</p>
            <button class="add-to-cart-btn" data-id="${product.id}" data-stock="${product.stock}">Add to Cart</button>
        `;

        menuGrid.appendChild(menuItem);
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

function setupPagination() {
    const paginationContainer = document.querySelector('.pagination');
    paginationContainer.innerHTML = '';

    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = page;
        pageButton.classList.add('page-btn');
        pageButton.dataset.page = page;

        pageButton.addEventListener('click', () => {
            currentPage = page;
            displayProducts(currentPage);
            updatePaginationButtons();
        });

        paginationContainer.appendChild(pageButton);
    }
}

function updatePaginationButtons() {
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.page == currentPage) {
            button.classList.add('active');
        }
    });
}

async function init() {
    await displayProducts(currentPage);
    setupPagination();
}

init();

function addToCart(event) {
    const productId = event.target.dataset.id;
    const productStock = parseInt(event.target.dataset.stock);
    const existingProduct = cart.find(item => item.id == productId);

    if (existingProduct) {
        if (existingProduct.quantity < productStock) {
            existingProduct.quantity++;
        }
    } else {
        const productElement = event.target.parentElement;
        const productTitle = productElement.querySelector('h3').textContent;
        const productPrice = productElement.querySelector('p').textContent;
        const productThumbnail = productElement.querySelector('img').src;

        cart.push({
            id: productId,
            title: productTitle,
            price: productPrice,
            thumbnail: productThumbnail,
            quantity: 1,
            stock: productStock
        });
    }

    event.target.style.display = 'none';
    const quantityControls = document.createElement('div');
    quantityControls.classList.add('quantity-controls');
    quantityControls.innerHTML = `
        <button class="decrease-btn" data-id="${productId}">-</button>
        <p class="quantity-cont"><span class="quantity">1</span></p>
        <button class="increase-btn" data-id="${productId}">+</button>
    `;
    event.target.parentElement.appendChild(quantityControls);

    document.querySelectorAll('.decrease-btn').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });

    updateCartDisplay();
}

function updateCartDisplay() {
    const cartContainer = document.querySelector('.cart-container');
    cartContainer.innerHTML = '';

    if (cart.length > 0) {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <div class="img-cart">
                    <img src="${item.thumbnail}" alt="${item.title}">
                    <div class="cart-cont">
                        <h4>${item.title}</h4>
                        <p>${item.price}</p>
                    </div>
                </div>
                <div class="cart-btn-section">
                    <div class="quant-control">
                        <button class="decrease-btn-cart" data-id="${item.id}">-</button>
                        <p class="quantity-cont"><span class="quantity">${item.quantity}</span></p>
                        <button class="increase-btn-cart" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        });

        document.querySelectorAll('.decrease-btn-cart').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });
        document.querySelectorAll('.increase-btn-cart').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });
    } else {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    }

    calculateTotal(); // Call calculateTotal to recalculate total products and prices
}

function removeQuantityControls(productId) {
    const catalogItem = document.querySelector(`[data-id="${productId}"]`);

    if (catalogItem) {
        const quantityControls = catalogItem.parentElement.querySelector('.quantity-controls');
        const addToCartButton = catalogItem.parentElement.querySelector('.add-to-cart-btn');

        if (quantityControls) {
            quantityControls.remove();
        }

        if (addToCartButton) {
            addToCartButton.style.display = 'block';
        }
    }
}

function decreaseQuantity(event) {
    const productId = event.target.dataset.id;
    const existingProduct = cart.find(item => item.id == productId);

    if (existingProduct) {
        existingProduct.quantity--;

        const cartQuantitySpan = event.target.parentElement.querySelector('.quantity');
        const catalogQuantitySpan = document.querySelector(`.menu-item [data-id="${productId}"]`)
            ?.parentElement.querySelector('.quantity-cont .quantity');

        if (existingProduct.quantity <= 0) {
            cart = cart.filter(item => item.id != productId);
            removeQuantityControls(productId);
        } else {
            cartQuantitySpan.textContent = existingProduct.quantity;
            if (catalogQuantitySpan) catalogQuantitySpan.textContent = existingProduct.quantity;
        }

        if (existingProduct.quantity <= 0) {
            removeQuantityControls(productId);
        }
    }

    updateCartDisplay();
}

function increaseQuantity(event) {
    const productId = event.target.dataset.id;
    const existingProduct = cart.find(item => item.id == productId);

    if (existingProduct && existingProduct.quantity < existingProduct.stock) {
        existingProduct.quantity++;

        const cartQuantitySpan = event.target.parentElement.querySelector('.quantity');
        const catalogQuantitySpan = document.querySelector(`.menu-item [data-id="${productId}"]`)
            ?.parentElement.querySelector('.quantity-cont .quantity');

        cartQuantitySpan.textContent = existingProduct.quantity;
        if (catalogQuantitySpan) catalogQuantitySpan.textContent = existingProduct.quantity;
    }

    updateCartDisplay();
}

function calculateTotal() {
    let totalProducts = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalProducts += item.quantity;
        totalPrice += item.quantity * parseFloat(item.price.replace('$', ''));
    });

    document.querySelector('.total-products').textContent = `Total Products: ${totalProducts}`;
    document.querySelector('.total-price').textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}

function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartDisplay();
    calculateTotal();
}

document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("cart-modal");
    const cartIcon = document.getElementById("cart-icon");
    const closeModal = document.getElementById("close-modal");

    cartIcon.onclick = function() {
        modal.style.display = "block";
        updateCartDisplay();
    }

    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

console.log("Application initialized");

// Cart array to store cart items
let cart = [];

// Fetch product data from API
fetch('https://dummyjson.com/products')
    .then(res => res.json())
    .then(data => {
        const menuGrid = document.querySelector('.menu-grid');
        data.products.forEach(product => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');

            menuItem.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>Rp. ${product.price}</p>
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            `;
            
            menuGrid.appendChild(menuItem);
        });

        // Add event listeners to 'Add to Cart' buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', addToCart);
        });

        // Add event listeners to 'Remove from Cart' buttons
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

function addToCart(event) {
    const productId = event.target.dataset.id;

    const existingProduct = cart.find(item => item.id == productId);

    if (existingProduct) {
        existingProduct.quantity++;
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
            quantity: 1
        });
    }

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
                <img src="${item.thumbnail}" alt="${item.title}">
                <h4>${item.title}</h4>
                <p>${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
            `;
            cartContainer.appendChild(cartItem);
        });
    } else {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Get the modal and elements
    const modal = document.getElementById("cart-modal");
    const cartIcon = document.getElementById("cart-icon");
    const closeModal = document.getElementById("close-modal");

    // When the cart icon is clicked, show the modal
    cartIcon.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks the close button (X), hide the modal
    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks outside the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

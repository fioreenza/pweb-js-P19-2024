console.log("Category module initialized");

async function fetchCategories() {
    try {
        const response = await fetch('https://dummyjson.com/products/categories');
        const categories = await response.json();
        return categories;  
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

async function displayCategories() {
    const categories = await fetchCategories();
    const dropdown = document.querySelector('#category-dropdown');
    dropdown.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Category';
    dropdown.appendChild(defaultOption);

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.slug;  
        option.textContent = category.name; 
        dropdown.appendChild(option);
    });

    dropdown.addEventListener('change', () => {
        const selectedCategory = dropdown.value;
        if (selectedCategory) {
            filterByCategory(selectedCategory);
        }
    });
}

async function filterByCategory(categorySlug) {
    try {
        const response = await fetch(`https://dummyjson.com/products/category/${categorySlug}?limit=${productsPerPage}`);
        const data = await response.json();
        const products = data.products;

        const menuGrid = document.querySelector('.menu-grid');
        menuGrid.innerHTML = '';

        products.forEach(product => {
            const menuItem = document.createElement('div');
            menuItem.classList.add('menu-item');

            menuItem.innerHTML = `
                <img src="${product.thumbnail}" alt="${product.title}">
                <h3>${product.title}</h3>
                <p>$ ${product.price}</p>
                <button class="add-to-cart-btn" data-id="${product.id}" data-stock="${product.stock}">Add to Cart</button>
            `;

            menuGrid.appendChild(menuItem);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    displayCategories();
});



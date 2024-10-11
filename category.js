console.log("Category module initialized");

async function fetchCategories() {
    try {
        const response = await fetch('https://dummyjson.com/products/categories');
        const categories = await response.json();
        return categories;  // Pastikan ini array dengan objek kategori
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

async function displayCategories() {
    const categories = await fetchCategories();
    const dropdown = document.querySelector('#category-dropdown');
    dropdown.innerHTML = '';

    // Tambahkan opsi default
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Category';
    dropdown.appendChild(defaultOption);

    // Menambahkan kategori ke dalam dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.slug;  // Gunakan 'slug' sebagai nilai
        option.textContent = category.name;  // Tampilkan nama kategori
        dropdown.appendChild(option);
    });

    // Event listener untuk perubahan dropdown
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

        // Tambahkan event listener untuk tombol "Add to Cart"
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', addToCart);
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
    }
}

// Inisialisasi kategori ketika halaman siap
document.addEventListener("DOMContentLoaded", function() {
    displayCategories();
});



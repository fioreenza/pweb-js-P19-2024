let categories = [];
let selectedCategory = 'all';
let currentPage = 1;
const productsPerPage = 10; // Add product limit per page

// Function to fetch categories
async function fetchCategories() {
    try {
        const response = await fetch('https://dummyjson.com/products/categories');
        categories = await response.json();
        displayCategories();
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

// Function to display categories
function displayCategories() {
    const categoryContainer = document.querySelector('.category-container');
    categoryContainer.innerHTML = '<button class="category-btn active" data-category="all">All</button>';
    categories.forEach(category => {
        const categoryButton = document.createElement('button');
        categoryButton.classList.add('category-btn');
        categoryButton.textContent = category;
        categoryButton.dataset.category = category;
        categoryButton.addEventListener('click', () => filterByCategory(category));
        categoryContainer.appendChild(categoryButton);
    });
}

// Function to filter by category
function filterByCategory(category) {
    selectedCategory = category;
    currentPage = 1;
    displayProducts(currentPage);
    updateCategoryButtons();
}

// Function to update active category buttons
function updateCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.category === selectedCategory);
    });
}

// Function to fetch products based on page and category
async function fetchProducts(page) {
    const limit = productsPerPage;
    const skip = (page - 1) * productsPerPage;
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    
    if (selectedCategory !== 'all') {
        url = `https://dummyjson.com/products/category/${selectedCategory}?limit=${limit}&skip=${skip}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Function to display products (simple example for displaying products)
async function displayProducts(page) {
    const products = await fetchProducts(page);
    const productContainer = document.querySelector('.product-container');
    productContainer.innerHTML = ''; // Clear the product container

    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.textContent = product.title; // Just an example, you can add other elements as needed
        productContainer.appendChild(productElement);
    });
}

// Start by fetching categories and displaying the first page of products
fetchCategories();
displayProducts(currentPage);

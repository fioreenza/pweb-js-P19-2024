let categories = [];
let selectedCategory = 'all';

async function fetchCategories() {
    try {
        const response = await fetch('https://dummyjson.com/products/categories');
        categories = await response.json();
        displayCategories();
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
}

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

function filterByCategory(category) {
    selectedCategory = category;
    currentPage = 1;
    displayProducts(currentPage);
    updateCategoryButtons();
}

function updateCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.category === selectedCategory);
    });
}

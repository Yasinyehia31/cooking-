// favorites.js
document.addEventListener('DOMContentLoaded', () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const container = document.getElementById('favorites-container');

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500 text-lg">You haven't saved any favorite recipes yet.</p>
                <a href="recipes.html" class="inline-block mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
                    Browse Recipes
                </a>
            </div>
        `;
        return;
    }

    
    loadFavoriteRecipes(favorites, container);
});

function loadFavoriteRecipes(favorites, container) {
   
    favorites.forEach(recipeId => {
        
    });
}
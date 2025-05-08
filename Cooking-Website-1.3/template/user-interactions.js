// user-interactions.js
class RecipeInteractions {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.initializeRatings();
        this.initializeComments();
        this.initializeFavorites();
        this.initializeSharing();
        this.initializePrinting();
    }

    initializeRatings() {
        const ratingContainers = document.querySelectorAll('.rating-container');
        ratingContainers.forEach(container => {
            const stars = container.querySelectorAll('.star');
            const recipeId = container.dataset.recipeId;
            const savedRating = localStorage.getItem(`rating-${recipeId}`);

            if (savedRating) {
                this.updateStars(stars, savedRating);
            }

            stars.forEach((star, index) => {
                star.addEventListener('click', () => {
                    const rating = index + 1;
                    this.updateStars(stars, rating);
                    this.saveRating(recipeId, rating);
                });
            });
        });
    }

    updateStars(stars, rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('text-yellow-400');
                star.classList.remove('text-gray-300');
            } else {
                star.classList.add('text-gray-300');
                star.classList.remove('text-yellow-400');
            }
        });
    }

    saveRating(recipeId, rating) {
        localStorage.setItem(`rating-${recipeId}`, rating);
        this.showToast('Rating saved!');
    }

    initializeComments() {
        const commentForms = document.querySelectorAll('.comment-form');
        commentForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const recipeId = form.dataset.recipeId;
                const comment = form.querySelector('textarea').value;
                this.saveComment(recipeId, comment);
                form.querySelector('textarea').value = '';
            });
        });
    }

    saveComment(recipeId, comment) {
        const comments = JSON.parse(localStorage.getItem(`comments-${recipeId}`) || '[]');
        comments.push({
            text: comment,
            date: new Date().toISOString(),
            author: 'Anonymous User'
        });
        localStorage.setItem(`comments-${recipeId}`, JSON.stringify(comments));
        this.updateCommentsList(recipeId);
        this.showToast('Comment posted!');
    }

    updateCommentsList(recipeId) {
        const commentsContainer = document.querySelector(`#comments-${recipeId}`);
        const comments = JSON.parse(localStorage.getItem(`comments-${recipeId}`) || '[]');
        
        commentsContainer.innerHTML = comments.map(comment => `
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
                <p class="text-gray-800 mb-2">${comment.text}</p>
                <div class="flex justify-between text-sm text-gray-500">
                    <span>${comment.author}</span>
                    <span>${new Date(comment.date).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');
    }

    initializeFavorites() {
        const favoriteButtons = document.querySelectorAll('.favorite-button');
        favoriteButtons.forEach(button => {
            const recipeId = button.dataset.recipeId;
            this.updateFavoriteButton(button, recipeId);

            button.addEventListener('click', () => {
                this.toggleFavorite(recipeId);
                this.updateFavoriteButton(button, recipeId);
            });
        });
    }

    toggleFavorite(recipeId) {
        const index = this.favorites.indexOf(recipeId);
        if (index === -1) {
            this.favorites.push(recipeId);
            this.showToast('Recipe added to favorites!');
        } else {
            this.favorites.splice(index, 1);
            this.showToast('Recipe removed from favorites!');
        }
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    updateFavoriteButton(button, recipeId) {
        const isFavorite = this.favorites.includes(recipeId);
        button.innerHTML = isFavorite ? '❤️' : '🤍';
    }

    initializeSharing() {
        const shareButtons = document.querySelectorAll('.share-button');
        shareButtons.forEach(button => {
            button.addEventListener('click', () => {
                const recipeId = button.dataset.recipeId;
                const recipeUrl = `${window.location.origin}/recipes.html#${recipeId}`;
                
                if (navigator.share) {
                    navigator.share({
                        title: 'Check out this recipe!',
                        url: recipeUrl
                    });
                } else {
                    navigator.clipboard.writeText(recipeUrl);
                    this.showToast('Recipe link copied to clipboard!');
                }
            });
        });
    }

    initializePrinting() {
        const printButtons = document.querySelectorAll('.print-button');
        printButtons.forEach(button => {
            button.addEventListener('click', () => {
                const recipeId = button.dataset.recipeId;
                this.printRecipe(recipeId);
            });
        });
    }

    printRecipe(recipeId) {
        const recipeContent = document.querySelector(`#recipe-${recipeId}`).cloneNode(true);
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Recipe</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    img { max-width: 100%; height: auto; }
                    @media print {
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                ${recipeContent.innerHTML}
                <script>window.onload = () => window.print();</script>
            </body>
            </html>
        `);
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RecipeInteractions();
});

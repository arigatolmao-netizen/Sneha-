// Random Joke Generator using External API

class JokeGenerator {
    constructor() {
        this.currentJoke = '';
        this.favorites = [];
        this.apiUrl = 'https://v2.jokeapi.dev/joke/';
        this.init();
    }

    init() {
        this.loadFavorites();
        this.setupEventListeners();
        this.displayFavorites();
    }

    setupEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => this.getJoke());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareJoke());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyJoke());
        document.getElementById('clearFavBtn').addEventListener('click', () => this.clearFavorites());
        document.getElementById('categorySelect').addEventListener('change', () => this.getJoke());
    }

    async getJoke() {
        const category = document.getElementById('categorySelect').value;
        const endpoint = category === 'any' ? 'Any' : category;
        
        this.showLoading(true);
        this.hideError();

        try {
            // Fetch from JokeAPI
            const response = await fetch(`${this.apiUrl}${endpoint}?format=json`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch joke');
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.message || 'Could not fetch joke');
            }

            // Format the joke
            if (data.type === 'twopart') {
                this.currentJoke = `${data.setup}\n\n${data.delivery}`;
            } else {
                this.currentJoke = data.joke;
            }

            this.displayJoke(this.currentJoke);
            this.showLoading(false);

        } catch (error) {
            console.error('Error:', error);
            this.showError(`Oops! ${error.message}. Please try again!`);
            this.showLoading(false);
        }
    }

    displayJoke(joke) {
        const jokeText = document.getElementById('jokeText');
        jokeText.textContent = joke;
        
        // Add animation
        const jokeDisplay = document.getElementById('jokeDisplay');
        jokeDisplay.style.animation = 'none';
        setTimeout(() => {
            jokeDisplay.style.animation = 'fadeIn 0.5s ease-out';
        }, 10);
    }

    shareJoke() {
        if (!this.currentJoke) {
            this.showError('Get a joke first!');
            return;
        }

        // Add to favorites
        this.addToFavorites(this.currentJoke);
        
        // Try to share via Web Share API
        if (navigator.share) {
            navigator.share({
                title: '😂 Joke Generator',
                text: this.currentJoke,
                url: window.location.href
            }).catch(err => console.log('Share failed:', err));
        } else {
            // Fallback: Copy to clipboard
            this.copyJoke();
        }
    }

    copyJoke() {
        if (!this.currentJoke) {
            this.showError('Get a joke first!');
            return;
        }

        navigator.clipboard.writeText(this.currentJoke).then(() => {
            const btn = document.getElementById('copyBtn');
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.showError('Failed to copy joke');
        });
    }

    addToFavorites(joke) {
        if (!this.favorites.includes(joke)) {
            this.favorites.unshift(joke);
            if (this.favorites.length > 10) {
                this.favorites.pop();
            }
            this.saveFavorites();
            this.displayFavorites();
        }
    }

    removeFavorite(index) {
        this.favorites.splice(index, 1);
        this.saveFavorites();
        this.displayFavorites();
    }

    displayFavorites() {
        const favoritesList = document.getElementById('favoritesList');
        favoritesList.innerHTML = '';

        if (this.favorites.length === 0) {
            favoritesList.innerHTML = '<div class="empty-state">No favorites yet. Share a joke to add it!</div>';
            return;
        }

        this.favorites.forEach((joke, index) => {
            const div = document.createElement('div');
            div.className = 'favorite-item';
            div.innerHTML = `
                <p>${this.escapeHtml(joke)}</p>
                <button class="remove-fav" onclick="jokeApp.removeFavorite(${index})">Remove</button>
            `;
            favoritesList.appendChild(div);
        });
    }

    clearFavorites() {
        if (this.favorites.length > 0 && confirm('Are you sure you want to clear all favorites?')) {
            this.favorites = [];
            this.saveFavorites();
            this.displayFavorites();
        }
    }

    saveFavorites() {
        localStorage.setItem('jokesFavorites', JSON.stringify(this.favorites));
    }

    loadFavorites() {
        const stored = localStorage.getItem('jokesFavorites');
        this.favorites = stored ? JSON.parse(stored) : [];
    }

    showLoading(show) {
        document.getElementById('loading').classList.toggle('show', show);
    }

    showError(message) {
        const errorMsg = document.getElementById('errorMsg');
        errorMsg.textContent = message;
        errorMsg.classList.add('show');
        setTimeout(() => {
            errorMsg.classList.remove('show');
        }, 4000);
    }

    hideError() {
        document.getElementById('errorMsg').classList.remove('show');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app
const jokeApp = new JokeGenerator();

// Load a joke on page load
window.addEventListener('load', () => {
    jokeApp.getJoke();
});

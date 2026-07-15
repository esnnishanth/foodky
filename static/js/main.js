const searchInput = document.getElementById('searchInput');
const clearBtn = document.getElementById('clearBtn');
const autocomplete = document.getElementById('autocomplete');
const resultsSection = document.getElementById('results');
const resultsGrid = document.getElementById('resultsGrid');
const resultCount = document.getElementById('resultCount');
const foodModal = document.getElementById('foodModal');
const modalBody = document.getElementById('modalBody');
const popularTags = document.getElementById('popularTags');
const categoriesGrid = document.getElementById('categoriesGrid');

let searchTimeout;
const popularFoods = ['Biryani', 'Butter Chicken', 'Pizza', 'Momos', 'Gulab Jamun', 'Sushi', 'Pav Bhaji', 'Fried Chicken', 'Ice Cream', 'Noodles'];

document.addEventListener('DOMContentLoaded', () => {
    renderPopularTags();
    setupCategoryListeners();
    setupModalListeners();
});

function renderPopularTags() {
    const shuffled = [...popularFoods].sort(() => Math.random() - 0.5).slice(0, 6);
    popularTags.innerHTML = shuffled.map(f => `<button class="food-tag" data-food="${f}">${f}</button>`).join('');
    popularTags.addEventListener('click', (e) => {
        if (e.target.classList.contains('food-tag')) {
            searchInput.value = e.target.dataset.food;
            performSearch(e.target.dataset.food);
        }
    });
}

searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    clearBtn.style.display = q ? 'flex' : 'none';

    clearTimeout(searchTimeout);
    if (q.length < 2) {
        autocomplete.style.display = 'none';
        return;
    }

    searchTimeout = setTimeout(() => fetchAutocomplete(q), 200);
});

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    autocomplete.style.display = 'none';
    resultsSection.style.display = 'none';
    searchInput.focus();
});

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const q = searchInput.value.trim();
        if (q) {
            autocomplete.style.display = 'none';
            performSearch(q);
        }
    }
    if (e.key === 'Escape') {
        autocomplete.style.display = 'none';
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        autocomplete.style.display = 'none';
    }
});

async function fetchAutocomplete(q) {
    try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        renderAutocomplete(data);
    } catch {
        autocomplete.style.display = 'none';
    }
}

function renderAutocomplete(items) {
    if (!items.length) {
        autocomplete.style.display = 'none';
        return;
    }

    autocomplete.innerHTML = items.map(item => `
        <div class="autocomplete-item" data-id="${item.id}">
            <span class="food-name">${highlightMatch(item.name, searchInput.value)}</span>
            <span class="food-category">${item.category}</span>
        </div>
    `).join('');

    autocomplete.style.display = 'block';

    autocomplete.querySelectorAll('.autocomplete-item').forEach(el => {
        el.addEventListener('click', () => {
            const id = parseInt(el.dataset.id);
            autocomplete.style.display = 'none';
            openModal(id);
        });
    });
}

function highlightMatch(text, query) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return text.slice(0, idx) + '<strong>' + text.slice(idx, idx + query.length) + '</strong>' + text.slice(idx + query.length);
}

async function performSearch(q) {
    try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        renderResults(data, q);
    } catch {
        resultsGrid.innerHTML = '<p style="color: var(--text-muted);">Something went wrong. Please try again.</p>';
        resultsSection.style.display = 'block';
    }
}

function renderResults(items, query) {
    if (!items.length) {
        resultsGrid.innerHTML = `<div class="no-results"><p>No results found for "<strong>${query}</strong>"</p><p style="color:var(--text-muted);font-size:14px;margin-top:8px;">Try searching for a different dish or ingredient.</p></div>`;
        resultCount.textContent = '0 found';
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
    }

    resultsGrid.innerHTML = items.map(item => `
        <div class="result-card" data-id="${item.id}">
            <div class="food-name">${highlightMatch(item.name, query)}</div>
            <div class="food-category">${item.category}</div>
            <div class="shelf-summary">
                <span class="shelf-tag room">RT: ${item.shelf_life.room_temp}</span>
                <span class="shelf-tag fridge">Fridge: ${item.shelf_life.refrigerated}</span>
                <span class="shelf-tag frozen">Freezer: ${item.shelf_life.frozen}</span>
            </div>
        </div>
    `).join('');

    resultCount.textContent = `${items.length} found`;
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    resultsGrid.querySelectorAll('.result-card').forEach(el => {
        el.addEventListener('click', () => {
            openModal(parseInt(el.dataset.id));
        });
    });
}

async function openModal(id) {
    try {
        const res = await fetch(`/api/food/${id}`);
        const food = await res.json();
        if (food.error) return;

        modalBody.innerHTML = `
            <h2>${food.name}</h2>
            <span class="food-category-label">${food.category}</span>

            <div class="info-grid">
                <div class="info-card">
                    <h3>Food Life Span</h3>
                    <div class="shelf-grid">
                        <div class="shelf-item room">
                            <div class="label">Room Temp</div>
                            <div class="value">${food.shelf_life.room_temp}</div>
                        </div>
                        <div class="shelf-item fridge">
                            <div class="label">Refrigerated</div>
                            <div class="value">${food.shelf_life.refrigerated}</div>
                        </div>
                        <div class="shelf-item frozen">
                            <div class="label">Frozen</div>
                            <div class="value">${food.shelf_life.frozen}</div>
                        </div>
                    </div>
                </div>

                <div class="info-card">
                    <h3>Preservative Methods</h3>
                    <div class="methods-list">
                        ${food.preservative_methods.map(m => `<span class="method-badge">${m}</span>`).join('')}
                    </div>
                </div>

                <div class="info-card">
                    <h3>Optimal Temperature</h3>
                    <div class="temp-list">
                        <span class="temp-badge">${food.optimal_temp}</span>
                    </div>
                </div>
            </div>

            <div class="tips-box">
                <h3>Pro Tip</h3>
                <p>${food.tips}</p>
            </div>
        `;

        foodModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    } catch {
        console.error('Failed to load food details');
    }
}

function setupModalListeners() {
    foodModal.querySelector('.modal-close').addEventListener('click', closeModal);
    foodModal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function closeModal() {
    foodModal.style.display = 'none';
    document.body.style.overflow = '';
}

function setupCategoryListeners() {
    categoriesGrid.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', async () => {
            const cat = card.dataset.category;
            const catName = card.querySelector('.category-name').textContent;
            searchInput.value = catName;
            performSearch(catName);
        });
    });
}

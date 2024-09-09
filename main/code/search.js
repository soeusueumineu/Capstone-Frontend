function openSearchWindow() {
    const searchQuery = document.getElementById('search-bar').value;
    if (searchQuery.trim() !== '') {
        const searchUrl = `search_results.html?query=${encodeURIComponent(searchQuery)}`;
        window.location.href = searchUrl;
    }
}

function renderResults(data, query) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    data.data.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');

        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.itemName}">
            <h2>${item.itemName}</h2>
            <p>Price: ${item.price}원</p>
            <p>Company: ${item.company}</p>
            <p>Size: ${item.size}</p>
        `;

        resultsContainer.appendChild(itemElement);
    });

    // 페이지 정보 렌더링
    const pageInfo = data.pageInfo;
    const totalPages = Math.ceil(data.pageInfo.totalElements / data.pageInfo.size);
    const pagination = document.createElement('div');
    pagination.classList.add('pagination');

    if (pageInfo.page > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => searchItems(query, pageInfo.page - 1));
        pagination.appendChild(prevButton);
    }

    if (pageInfo.page < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => searchItems(query, pageInfo.page + 1));
        pagination.appendChild(nextButton);
    }

    resultsContainer.appendChild(pagination);
}

async function searchItems(query, page) {
    try {
        const response = await fetch(`http://localhost:8080/api/search?content=${encodeURIComponent(query)}&page=${page}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        renderResults(data, query);
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');

    if (query) {
        searchItems(query, 1);
    }
});
let currentPage = 1;

async function loadProducts(page) {
    try {
        const response = await fetch('http://localhost:8080/api/recommend', {
            method: 'GET',
            credentials: 'include', // 세션 쿠키를 요청에 포함
            // headers: {
            //     'Content-Type': 'application/json'
            // }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // 데이터가 배열인지 확인
        if (!Array.isArray(data.data)) {
            throw new Error('Unexpected response format');
        }

        const productList = document.getElementById('productList');
        // productList가 존재하는지 확인
        if (!productList) {
            throw new Error('Product list element not found');
        }

        productList.innerHTML = '';

        data.data.forEach(product => {
            const listItem = document.createElement('li');
            listItem.id = `product${product.id}`;

            listItem.innerHTML = `
                <div class="img" style="position: relative;">
                    <button type="button" name="button" class="heart" onclick="toggleButton('${listItem.id}', this)"></button>
                    <a href="product.html?productId=${product.id}" class="producta">
                        <img src="${product.image}" alt="Product Image" class="productimg">
                    </a>
                </div>
                <div class="spacer"></div>
                <div class="text-max">
                    <div class="text_wrap">
                        <div class="brand">${product.company}</div>
                    </div>
                    <div class="spacer1"></div>
                    <div class="size">${product.size}</div>
                    <div class="spacer1"></div>
                    <div class="manual">${product.itemName}</div>
                    <div class="spacer1"></div>
                    <div class="price">
                        <span class="base_price">${product.price}원</span>
                    </div>
                </div>
            `;
            productList.appendChild(listItem);
        });

        loadButtonStates();

    } catch (error) {
        console.error('Failed to load products:', error);
        showErrorMessage(error.message);
    }
}

function showErrorMessage(message) {
    const errorContainer = document.getElementById('errorContainer');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    } else {
        console.error('Error container element not found');
    }
}

function toggleHeart(button, isActive) {
    if (isActive) {
        button.classList.add('clicked');
    } else {
        button.classList.remove('clicked');
    }
}

function toggleButton(productId, button) {
    if (!isLoggedIn()) {
        alert('로그인 후 이용해주세요.');
        window.location.href = 'join.html';
        return;
    }

    const productDiv = document.getElementById(productId);
    const productHTML = productDiv.innerHTML;

    let likedProducts = localStorage.getItem('likedProducts');
    likedProducts = likedProducts ? JSON.parse(likedProducts) : [];

    const index = likedProducts.findIndex(product => product.id === productId);
    if (index === -1) {
        likedProducts.push({ id: productId, html: productHTML });
        localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
        alert('위시리스트에 추가되었습니다.');
    } else {
        likedProducts.splice(index, 1);
        localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
        alert('위시리스트에서 제거되었습니다.');
    }

    toggleHeart(button, index === -1);
    saveButtonState(productId, index === -1);
}

function saveButtonState(productId, isActive) {
    let buttonStates = localStorage.getItem('buttonStates');
    buttonStates = buttonStates ? JSON.parse(buttonStates) : {};
    buttonStates[productId] = isActive;
    localStorage.setItem('buttonStates', JSON.stringify(buttonStates));
}

function loadButtonStates() {
    let buttonStates = localStorage.getItem('buttonStates');
    buttonStates = buttonStates ? JSON.parse(buttonStates) : {};
    for (const [productId, isActive] of Object.entries(buttonStates)) {
        const button = document.querySelector(`#${productId} .heart`);
        if (button) {
            toggleHeart(button, isActive);
        }
    }
}

function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

window.onload = function() {
    loadProducts(currentPage);
}


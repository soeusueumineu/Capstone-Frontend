let currentPage = 1;
const itemsPerPage = 12;
let totalPages = 4;

async function loadProducts(page) {
    try {
        const response = await fetch(`http://localhost:8080/api/women?page=${page}`);
        const data = await response.json();

        const productList = document.getElementById('productList');
        productList.innerHTML = '';

        data.data.forEach(product => { 
            const listItem = document.createElement('li');
            listItem.id = `product${product.id}`;

            listItem.innerHTML = `
                <div class="img" style="position: relative;">
                    <button type="button" name="button" class="heart" onclick="toggleButton('${listItem.id}', this)"></button>
                    <a href="product.html?productId=${product.id}" class="producta">
                        <img src="${product.image}" alt="Product Image" class="productimg">
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
                </a>
            `;
            productList.appendChild(listItem);
        });

        loadButtonStates();
        
        // API 응답에서 totalPages 업데이트
        totalPages = data.pageInfo.totalPages;
        updatePagination(page);

    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

async function changePage(page) {
    if (page < 1 || page > totalPages) {
        return;
    }
    currentPage = page;
    await loadProducts(page);
}

function updatePagination(page) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (page > 1) {
        const prevGroup = document.createElement('button');
        prevGroup.innerText = '<';
        prevGroup.onclick = () => changePage(currentPage - 1);
        pagination.appendChild(prevGroup);
    }

    const maxVisiblePages = 10;
    const startPage = Math.floor((page - 1) / maxVisiblePages) * maxVisiblePages + 1;
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === page) {
            pageButton.classList.add('active');
        }
        pageButton.onclick = () => changePage(i);
        pagination.appendChild(pageButton);
    }

    if (page < totalPages) {
        const nextGroup = document.createElement('button');
        nextGroup.innerText = '>';
        nextGroup.onclick = () => changePage(currentPage + 1);
        pagination.appendChild(nextGroup);
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

    // 로그인 확인 코드
    // if (!isLoggedIn()) {
    //     alert('로그인 후 이용해주세요.');
    //     window.location.href = 'join.html';
    //     return;
    // }

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


window.onload = function() {
    loadProducts(currentPage);
}

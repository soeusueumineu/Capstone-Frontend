// 세션 유효성 확인
fetch('http://localhost:8080/session-check', {
    method: 'GET',
    credentials: 'include'
})
.then(response => {
    if (!response.ok) {
        // 유효하지 않은 세션인 경우 로그인 페이지로 이동
        window.location.href = 'login.html';
       
    } else {
        // 유효한 세션인 경우 window.onload에 함수를 설정
        window.onload = function() {
            const likedProducts = JSON.parse(localStorage.getItem('likedProducts'));
            const likedProductsDiv = document.getElementById('likedProducts');
            if (likedProducts) {
                likedProducts.forEach(product => {
                    // 각 제품에 대한 div 생성
                    const productDiv = document.createElement('div');
                    productDiv.innerHTML = product.html;
                    // 클론된 HTML에서 버튼 요소 제거
                    const button = productDiv.querySelector('button');
                    if (button) {
                        button.remove();
                    }
                    likedProductsDiv.appendChild(productDiv);
                });
            }
        };
    }
})
.catch(error => {
    console.error('세션 체크 중 오류 발생:', error);
    // 에러 발생 시 로그인 페이지로 이동
    window.location.href = 'login.html';
});

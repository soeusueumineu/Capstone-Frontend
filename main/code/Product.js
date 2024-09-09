document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('productId');
    loadProductDetails(productId); // 상품 로드

    const reviewForm = document.querySelector('.user-review');
    const stars = document.querySelectorAll('.star');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-value'));
            updateStars(selectedRating);
        });
    });

    function updateStars(rating) {
        stars.forEach((star, index) => {
            star.textContent = index < rating ? '⭐' : '☆';
        });
    }

    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitReview(productId);
    });

    function loadProductDetails(productId) {
        fetch(`http://localhost:8080/api/itemDetail/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            return response.json();
        })
        .then(data => {
            displayProductDetails(data);
        })
        .catch(error => {
            console.error('Error loading product details:', error);
        });
    }

    function displayProductDetails(data) {
        document.getElementById('product-name').textContent = data.itemName;
        document.getElementById('brand').textContent = "Brand: " + data.company;
        document.getElementById('type').textContent = "Type: " + data.type;
        document.getElementById('size').textContent = "Size: " + data.size;
        document.getElementById('length').textContent = "Total Length: " + data.sizeList.length;
        document.getElementById('waist').textContent = "Waist Width: " + data.sizeList.waistWidth;
        document.getElementById('gender').textContent = "Gender: " + data.gender;
        document.getElementById('price').textContent = "Price: " + data.price + ' USD';
        document.getElementById('product-image').src = data.image;
        document.getElementById('buy-now-button').onclick = () => window.open(data.siteUrl, '_blank');
        
        // 리뷰 로드
        document.querySelector('.user-reviews').innerHTML = ''; // 기존 리뷰 초기화
        if (data.itemReview) {
            data.itemReview.forEach(review => {
                addReviewToPage(review.title, review.content, review.star, review.username);
            });
        }
    }

    function submitReview(productId) {
        const title = document.getElementById('review-title').value;
        const content = document.getElementById('review-content').value;

        if (!title || !content || selectedRating === 0) {
            alert('모든 필드를 채워주세요.');
            return;
        }

        // 리뷰 제출
        fetch(`http://localhost:8080/api/addReview/${productId}`, { 
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                content: content,
                star: selectedRating
            })
        }).then(response => {
            if (!response.ok) {
                throw new Error('Review submission failed');
            }
            return response.json();
        }).then(data => {
            loadProductDetails(productId); 
        }).catch(error => {
            console.error('Error:', error);
            alert('리뷰 제출에 성공했습니다');
        });
    }

    function addReviewToPage(title, content, stars, username) {
        const reviewElement = document.createElement('div');
        reviewElement.classList.add('review'); // 스타일링을 위해 클래스 추가
        reviewElement.innerHTML = `
            <div class="review-user"><strong>${username}</strong></div>
            <div class="review-title">${'⭐'.repeat(stars)} - ${title}</div>
            <div class="review-content">${content}</div>
        `;
        document.querySelector('.user-reviews').appendChild(reviewElement);
    }
});

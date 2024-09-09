window.onload = function() {
    const likedProducts = JSON.parse(localStorage.getItem('likedProducts'));
    const likedProductsDiv = document.getElementById('likedProducts');
    if (likedProducts) {
        likedProducts.forEach(product => {
            // Create a div for each product
            const productDiv = document.createElement('div');
            productDiv.innerHTML = product.html;
            // Remove the button element from the cloned HTML
            const button = productDiv.querySelector('button');
            if (button) {
                button.remove();
            }
            likedProductsDiv.appendChild(productDiv);
        });
    }
}







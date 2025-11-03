const cart = [];

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
    }
}

function getCartItems() {
    return cart;
}

function clearCart() {
    cart.length = 0;
}

function getCartTotal() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

module.exports = {
    addToCart,
    removeFromCart,
    getCartItems,
    clearCart,
    getCartTotal
};
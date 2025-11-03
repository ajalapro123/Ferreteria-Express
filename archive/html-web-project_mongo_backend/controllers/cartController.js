const cartService = require('../services/cartService');

exports.addToCart = (req, res) => {
    const { userId, productId, quantity } = req.body;
    cartService.addItemToCart(userId, productId, quantity)
        .then(cart => res.status(200).json(cart))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.removeFromCart = (req, res) => {
    const { userId, productId } = req.params;
    cartService.removeItemFromCart(userId, productId)
        .then(cart => res.status(200).json(cart))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.getCart = (req, res) => {
    const { userId } = req.params;
    cartService.getCartByUserId(userId)
        .then(cart => res.status(200).json(cart))
        .catch(err => res.status(500).json({ error: err.message }));
};

exports.clearCart = (req, res) => {
    const { userId } = req.params;
    cartService.clearCart(userId)
        .then(() => res.status(204).send())
        .catch(err => res.status(500).json({ error: err.message }));
};
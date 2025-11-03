// This file handles order-related functionalities, including fetching order history and tracking.

document.addEventListener('DOMContentLoaded', function() {
    const orderHistoryContainer = document.getElementById('order-history');
    const orderTrackingContainer = document.getElementById('order-tracking');

    // Fetch order history
    function fetchOrderHistory() {
        fetch('/api/orders/history')
            .then(response => response.json())
            .then(data => {
                displayOrderHistory(data);
            })
            .catch(error => console.error('Error fetching order history:', error));
    }

    // Display order history
    function displayOrderHistory(orders) {
        if (orders.length === 0) {
            orderHistoryContainer.innerHTML = '<p>No orders found.</p>';
            return;
        }
        orders.forEach(order => {
            const orderElement = document.createElement('div');
            orderElement.classList.add('order');
            orderElement.innerHTML = `
                <h3>Order #${order.id}</h3>
                <p>Date: ${new Date(order.date).toLocaleDateString()}</p>
                <p>Total: $${order.total.toFixed(2)}</p>
                <p>Status: ${order.status}</p>
            `;
            orderHistoryContainer.appendChild(orderElement);
        });
    }

    // Fetch order tracking information
    function fetchOrderTracking(orderId) {
        fetch(`/api/orders/tracking/${orderId}`)
            .then(response => response.json())
            .then(data => {
                displayOrderTracking(data);
            })
            .catch(error => console.error('Error fetching order tracking:', error));
    }

    // Display order tracking information
    function displayOrderTracking(trackingInfo) {
        orderTrackingContainer.innerHTML = `
            <h3>Tracking Information for Order #${trackingInfo.orderId}</h3>
            <p>Status: ${trackingInfo.status}</p>
            <p>Estimated Delivery: ${new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}</p>
        `;
    }

    // Initialize functions
    fetchOrderHistory();
});
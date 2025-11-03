# HTML Web Project

## Overview
This project is a web application that provides a comprehensive product catalog, shopping cart functionality, user registration and login, order history, contact and support options, and order tracking. It is designed following a multi-tier architecture to ensure scalability and maintainability.

## Features
- **Product Catalog**: Users can browse through a variety of products with images and prices.
- **Shopping Cart**: Users can add products to their cart and proceed to checkout.
- **User Registration/Login**: New users can register, and existing users can log in to their accounts.
- **Order History**: Users can view their past purchases.
- **Order Tracking**: Users can track the status of their orders.
- **Contact and Support**: Users can reach out for inquiries and access support options.

## Project Structure
```
html-web-project
├── src
│   ├── index.html
│   ├── catalog
│   │   └── catalog.html
│   ├── cart
│   │   └── cart.html
│   ├── user
│   │   ├── login.html
│   │   ├── register.html
│   │   └── profile.html
│   ├── orders
│   │   ├── history.html
│   │   └── tracking.html
│   ├── contact
│   │   └── contact.html
│   ├── support
│   │   └── support.html
│   ├── assets
│   │   ├── css
│   │   │   └── styles.css
│   │   └── js
│   │       ├── catalog.js
│   │       ├── cart.js
│   │       ├── user.js
│   │       ├── orders.js
│   │       ├── contact.js
│   │       └── support.js
├── backend
│   ├── services
│   │   ├── productService.js
│   │   ├── cartService.js
│   │   ├── userService.js
│   │   ├── orderService.js
│   │   └── supportService.js
│   ├── controllers
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── userController.js
│   │   ├── orderController.js
│   │   └── supportController.js
│   └── models
│       ├── product.js
│       ├── cart.js
│       ├── user.js
│       ├── order.js
│       └── support.js
├── package.json
└── README.md
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Install the necessary dependencies by running `npm install`.
4. Start the backend server and frontend application as per the provided instructions in the respective directories.

## Technologies Used
- HTML, CSS, JavaScript for the frontend.
- Node.js and Express for the backend services.
- MongoDB or any other database for data storage (as per your choice).

## Contribution
Feel free to fork the repository and submit pull requests for any improvements or features you would like to add.
// This file manages user authentication, including login and registration processes.

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const profileForm = document.getElementById('profileForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(loginForm);
            fetch('/api/login', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/user/profile.html';
                } else {
                    alert(data.message);
                }
            });
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(registerForm);
            fetch('/api/register', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Registration successful! Please log in.');
                    window.location.href = '/user/login.html';
                } else {
                    alert(data.message);
                }
            });
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(profileForm);
            fetch('/api/updateProfile', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Profile updated successfully!');
                } else {
                    alert(data.message);
                }
            });
        });
    }
});
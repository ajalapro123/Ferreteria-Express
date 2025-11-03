document.addEventListener("DOMContentLoaded", function() {
    const contactForm = document.getElementById("contact-form");
    
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            message: formData.get("message")
        };

        // Validate form data
        if (validateForm(data)) {
            // Send data to backend service
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (response.ok) {
                    alert("Your message has been sent successfully!");
                    contactForm.reset();
                } else {
                    alert("There was an error sending your message. Please try again.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("There was an error sending your message. Please try again.");
            });
        } else {
            alert("Please fill in all fields correctly.");
        }
    });

    function validateForm(data) {
        return data.name && data.email && data.message;
    }
});
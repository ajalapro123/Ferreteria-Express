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
                    Swal.fire({ icon: 'success', title: 'Enviado', text: 'Tu mensaje ha sido enviado correctamente.' });
                    contactForm.reset();
                } else {
                    Swal.fire({ icon: 'error', title: 'Error', text: 'Hubo un error al enviar tu mensaje. Intenta de nuevo.' });
                }
            })
            .catch(error => {
                console.error("Error:", error);
                Swal.fire({ icon: 'error', title: 'Error', text: 'Hubo un error al enviar tu mensaje. Intenta de nuevo.' });
            });
        } else {
            Swal.fire({ icon: 'warning', title: 'Formulario incompleto', text: 'Por favor completa todos los campos correctamente.' });
        }
    });

    function validateForm(data) {
        return data.name && data.email && data.message;
    }
});
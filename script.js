document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // 2. Header Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '5px 20px';
            header.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        } else {
            header.style.padding = '15px 20px';
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });

    // 3. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // 4. Scroll Reveal Animation
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 100; // Trigger point before element is fully visible
        
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('active');
            }
        });
    }
    
    // Initial check
    checkReveal();
    // Check on scroll
    window.addEventListener('scroll', checkReveal);

    // 5. WhatsApp Form Submission
    const cotizacionForm = document.getElementById('cotizacionForm');
    if (cotizacionForm) {
        cotizacionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const origen = document.getElementById('origen').value;
            const destino = document.getElementById('destino').value;
            const fecha = document.getElementById('fecha').value;
            const tipo = document.getElementById('tipo').value;
            const detalle = document.getElementById('detalle').value;
            
            // Format WhatsApp Message
            let message = `*NUEVA SOLICITUD DE PRESUPUESTO*\n\n`;
            message += `*Nombre:* ${nombre}\n`;
            message += `*Teléfono:* ${telefono}\n`;
            message += `*Ubicación de Retiro:* ${origen}\n`;
            message += `*Ubicación de Entrega:* ${destino}\n`;
            message += `*Fecha estimada:* ${fecha || 'No especificada'}\n`;
            message += `*Tipo de carga:* ${tipo}\n`;
            message += `*Detalle:* ${detalle}\n\n`;
            message += `Por favor, envíenme una cotización. ¡Gracias!`;
            
            // Encode for URL
            const encodedMessage = encodeURIComponent(message);
            
            // WhatsApp Business Number
            const whatsappNumber = "5493795022721";
            
            // Open WhatsApp in new tab
            window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
            
            // Optional: reset form after submission
            // this.reset();
        });
    }
});

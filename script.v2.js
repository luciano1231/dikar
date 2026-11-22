document.documentElement.classList.add('js-ready');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle (accessible button + keyboard Escape support)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn && navLinks) {
        const setMenuOpen = (isOpen) => {
            navLinks.classList.toggle('active', isOpen);
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
            mobileMenuBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
        };

        mobileMenuBtn.addEventListener('click', () => {
            const expanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            setMenuOpen(!expanded);
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => setMenuOpen(false));
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                setMenuOpen(false);
                mobileMenuBtn.focus();
            }
        });
    }

    // 2. Header Scroll Effect (throttled via class toggle)
    const header = document.getElementById('header');
    if (header) {
        const updateHeader = () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        };
        updateHeader();
        window.addEventListener('scroll', updateHeader, { passive: true });
    }

    // 3. FAQ Accordion with aria-expanded
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (!question) return;
        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherBtn = otherItem.querySelector('.faq-question');
                if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            });
            if (!wasActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 4. Scroll Reveal Animation via IntersectionObserver (respects prefers-reduced-motion)
    const revealElements = document.querySelectorAll('.reveal');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('active'));
    } else if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });

        revealElements.forEach(el => observer.observe(el));
    }

    // 5. Accessible WhatsApp Form Validation & Submission
    const cotizacionForm = document.getElementById('cotizacionForm');
    if (cotizacionForm) {
        const formStatus = document.getElementById('form-status');
        const fields = [
            { id: 'nombre', msg: 'Ingresá tu nombre completo.' },
            { id: 'telefono', msg: 'Ingresá un número de teléfono o WhatsApp válido.' },
            { id: 'origen', msg: 'Indicá la ubicación de retiro.' },
            { id: 'destino', msg: 'Indicá la ubicación de entrega.' },
            { id: 'valor_declarado', msg: 'Indicá el valor declarado en pesos argentinos.' },
            { id: 'detalle', msg: 'Describí brevemente lo que necesitás trasladar.' }
        ];

        const clearErrors = () => {
            if (formStatus) {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }
            fields.forEach(({ id }) => {
                const input = document.getElementById(id);
                const err = document.getElementById(`${id}-error`);
                if (input) input.removeAttribute('aria-invalid');
                if (err) err.textContent = '';
            });
        };

        cotizacionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearErrors();

            let firstInvalid = null;
            fields.forEach(({ id, msg }) => {
                const input = document.getElementById(id);
                const err = document.getElementById(`${id}-error`);
                if (!input) return;
                const val = input.value.trim();
                const isInvalid = !val || (id === 'valor_declarado' && Number(val) < 0);
                if (isInvalid) {
                    input.setAttribute('aria-invalid', 'true');
                    if (err) err.textContent = msg;
                    if (!firstInvalid) firstInvalid = input;
                }
            });

            if (firstInvalid) {
                if (formStatus) {
                    formStatus.textContent = 'Revisá los campos marcados antes de enviar tu cotización.';
                    formStatus.className = 'form-status error';
                }
                firstInvalid.focus();
                return;
            }

            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const origen = document.getElementById('origen').value.trim();
            const destino = document.getElementById('destino').value.trim();
            const fecha = (document.getElementById('fecha')?.value || '').trim();
            const tipo = (document.getElementById('tipo')?.value || '').trim();
            const valor_declarado = document.getElementById('valor_declarado').value.trim();
            const detalle = document.getElementById('detalle').value.trim();

            const lines = [
                '*NUEVA SOLICITUD DE PRESUPUESTO*',
                '',
                `*Nombre:* ${nombre}`,
                `*Teléfono:* ${telefono}`,
                `*Ubicación de Retiro:* ${origen}`,
                `*Ubicación de Entrega:* ${destino}`,
                `*Fecha estimada:* ${fecha || 'No especificada'}`,
                `*Tipo de carga:* ${tipo}`,
                `*Valor declarado:* $${valor_declarado}`,
                `*Detalle:* ${detalle}`,
                '',
                'Por favor, envíenme una cotización. ¡Gracias!'
            ];

            const encodedMessage = encodeURIComponent(lines.join('\n'));
            const whatsappNumber = '5493795022721';
            const url = `https://wa.me/${encodeURIComponent(whatsappNumber)}?text=${encodedMessage}`;

            window.open(url, '_blank', 'noopener,noreferrer');
        });
    }
});

// ============================================
// SCRIPT PRINCIPAL PARA GRUPO MOPAL
// Funcionalidades completas para todo el sitio
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. CONFIGURACIÓN INICIAL
    // ========================================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log(`📄 Página actual: ${currentPage}`);
    
    // ========================================
    // 2. MENÚ MÓVIL
    // ========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Cerrar menú al hacer clic en enlaces
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // ========================================
    // 3. DROPDOWNS EN MÓVIL
    // ========================================
    document.querySelectorAll('.has-dropdown > a').forEach(dropdownToggle => {
        dropdownToggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
    
    // ========================================
    // 4. NAVBAR CON SCROLL
    // ========================================
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // ========================================
    // 5. ACTUALIZAR ENLACE ACTIVO
    // ========================================
    function setActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-menu > li > a:not(.cta-button-nav)');
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === currentPath || (currentPath === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // ========================================
    // 6. SCROLL SUAVE
    // ========================================
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // 7. SLIDER DE SEGURIDAD
    // ========================================
    initSeguridadSlider();
    
    function initSeguridadSlider() {
        const track = document.querySelector('.seguridad-track');
        const slides = document.querySelectorAll('.seguridad-slide');
        const nextBtn = document.querySelector('.next');
        const prevBtn = document.querySelector('.prev');
        
        if (track && slides.length > 0 && nextBtn && prevBtn) {
            let currentIndex = 0;
            
            function getVisibleSlides() {
                if (window.innerWidth <= 768) return 1;
                if (window.innerWidth <= 968) return 2;
                return 3;
            }
            
            function updateSlider() {
                const slideWidth = slides[0].offsetWidth + 30;
                const maxIndex = slides.length - getVisibleSlides();
                
                if (currentIndex > maxIndex) {
                    currentIndex = maxIndex;
                }
                
                track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            }
            
            nextBtn.addEventListener('click', () => {
                const maxIndex = slides.length - getVisibleSlides();
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    updateSlider();
                }
            });
            
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateSlider();
                }
            });
            
            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(updateSlider, 250);
            });
            
            updateSlider();
        }
    }
    
    // ========================================
    // 8. FILTROS DE AUTOS
    // ========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.textContent.trim().toLowerCase();
                filterAutos(filter);
            });
        });
    }
    
    function filterAutos(filter) {
        const autos = document.querySelectorAll('.auto-card');
        
        autos.forEach(auto => {
            const category = auto.dataset.category || '';
            const title = auto.querySelector('.auto-title')?.textContent.toLowerCase() || '';
            
            if (filter === 'todos' || category.includes(filter) || title.includes(filter)) {
                auto.style.display = 'block';
                setTimeout(() => {
                    auto.style.opacity = '1';
                    auto.style.transform = 'scale(1)';
                }, 10);
            } else {
                auto.style.opacity = '0';
                auto.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    auto.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // ========================================
    // 9. COMPARADOR DE AUTOS
    // ========================================
    let comparador = [];
    const MAX_COMPARADOR = 3;
    
    // Crear panel de comparador si no existe
    if (!document.querySelector('.comparador-flotante')) {
        const comparadorHTML = `
            <div class="comparador-flotante">
                <div class="comparador-header">
                    <h4>Comparador <span class="rojo">(0/${MAX_COMPARADOR})</span></h4>
                    <button class="cerrar-comparador"><i class="fas fa-times"></i></button>
                </div>
                <div class="comparador-items"></div>
                <div class="comparador-footer">
                    <a href="comparar.html" class="btn-primary" style="display: none;">Comparar ahora</a>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', comparadorHTML);
    }
    
    const comparadorPanel = document.querySelector('.comparador-flotante');
    const comparadorItems = document.querySelector('.comparador-items');
    const comparadorFooter = document.querySelector('.comparador-footer .btn-primary');
    const comparadorCount = document.querySelector('.comparador-header .rojo');
    
    // Botones de comparar
    document.querySelectorAll('.btn-comparar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const autoCard = this.closest('.auto-card');
            const autoId = autoCard.dataset.id || Math.random().toString(36).substr(2, 9);
            const autoName = autoCard.querySelector('.auto-title').textContent;
            const autoPrice = autoCard.querySelector('.auto-price').textContent;
            
            toggleComparador(autoId, autoName, autoPrice);
        });
    });
    
    function toggleComparador(id, name, price) {
        const existingIndex = comparador.findIndex(item => item.id === id);
        
        if (existingIndex >= 0) {
            // Remover
            comparador.splice(existingIndex, 1);
            showNotification(`${name} removido del comparador`, 'success');
        } else {
            // Agregar
            if (comparador.length < MAX_COMPARADOR) {
                comparador.push({ id, name, price });
                showNotification(`${name} agregado al comparador`, 'success');
            } else {
                showNotification(`Solo puedes comparar hasta ${MAX_COMPARADOR} autos`, 'error');
                return;
            }
        }
        
        actualizarComparador();
    }
    
    function actualizarComparador() {
        // Actualizar contador
        if (comparadorCount) {
            comparadorCount.textContent = `(${comparador.length}/${MAX_COMPARADOR})`;
        }
        
        // Actualizar items
        if (comparadorItems) {
            if (comparador.length === 0) {
                comparadorItems.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No hay autos para comparar</p>';
                comparadorPanel?.classList.remove('active');
                if (comparadorFooter) comparadorFooter.style.display = 'none';
            } else {
                let html = '';
                comparador.forEach(item => {
                    html += `
                        <div class="comparador-item">
                            <span>${item.name}</span>
                            <button onclick="removerComparador('${item.id}')"><i class="fas fa-times"></i></button>
                        </div>
                    `;
                });
                comparadorItems.innerHTML = html;
                comparadorPanel?.classList.add('active');
                if (comparadorFooter) {
                    comparadorFooter.style.display = 'flex';
                    // Guardar datos para la página de comparación
                    localStorage.setItem('comparador', JSON.stringify(comparador));
                }
            }
        }
    }
    
    // Cerrar comparador
    document.querySelector('.cerrar-comparador')?.addEventListener('click', () => {
        comparadorPanel?.classList.remove('active');
    });
    
    // Función global para remover
    window.removerComparador = function(id) {
        comparador = comparador.filter(item => item.id !== id);
        actualizarComparador();
    };
    
    // Cargar comparador guardado
    const savedComparador = localStorage.getItem('comparador');
    if (savedComparador) {
        try {
            comparador = JSON.parse(savedComparador);
            actualizarComparador();
        } catch (e) {
            console.error('Error cargando comparador');
        }
    }
    
    // ========================================
    // 10. NOTIFICACIONES
    // ========================================
    window.showNotification = function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    };
    
    // ========================================
    // 11. FORMULARIOS
    // ========================================
    const cotizacionForm = document.getElementById('form-cotizacion');
    const contactoForm = document.getElementById('form-contacto');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    function validatePhone(phone) {
        return /^[0-9+\-\s]{7,}$/.test(phone);
    }
    
    if (cotizacionForm) {
        cotizacionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = this.querySelector('#nombre')?.value;
            const email = this.querySelector('#email')?.value;
            const telefono = this.querySelector('#telefono')?.value;
            const modelo = this.querySelector('#modelo')?.value;
            
            if (!nombre || !email || !telefono || !modelo) {
                showNotification('Por favor completa todos los campos requeridos', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('Por favor ingresa un email válido', 'error');
                return;
            }
            
            if (!validatePhone(telefono)) {
                showNotification('Por favor ingresa un teléfono válido', 'error');
                return;
            }
            
            // Simular envío
            showNotification('¡Cotización enviada! Un asesor te contactará pronto', 'success');
            this.reset();
        });
    }
    
    if (contactoForm) {
        contactoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = this.querySelector('#nombre')?.value;
            const email = this.querySelector('#email')?.value;
            const mensaje = this.querySelector('#mensaje')?.value;
            
            if (!nombre || !email || !mensaje) {
                showNotification('Por favor completa todos los campos', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('Por favor ingresa un email válido', 'error');
                return;
            }
            
            showNotification('¡Mensaje enviado! Te responderemos a la brevedad', 'success');
            this.reset();
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]')?.value;
            
            if (!email) {
                showNotification('Por favor ingresa tu email', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('Por favor ingresa un email válido', 'error');
                return;
            }
            
            showNotification('¡Gracias por suscribirte!', 'success');
            this.reset();
        });
    }
    
    // ========================================
    // 12. ANIMACIONES SCROLL
    // ========================================
    const animatedElements = document.querySelectorAll('.beneficio-card, .sede-card, .seguridad-card, .auto-card, .servicio-card');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px'
        });
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(element);
        });
    }
    
    // ========================================
    // 13. BÚSQUEDA EN VIVO
    // ========================================
    const searchInput = document.getElementById('search-autos');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const term = this.value.toLowerCase().trim();
            const autos = document.querySelectorAll('.auto-card');
            
            autos.forEach(auto => {
                const title = auto.querySelector('.auto-title').textContent.toLowerCase();
                const specs = auto.querySelector('.auto-specs')?.textContent.toLowerCase() || '';
                
                if (title.includes(term) || specs.includes(term) || term === '') {
                    auto.style.display = 'block';
                } else {
                    auto.style.display = 'none';
                }
            });
        });
    }
    
    // ========================================
    // 14. GALERÍA DE IMÁGENES (para modelo.html)
    // ========================================
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image img');
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').src;
                mainImage.src = imgSrc;
                
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // ========================================
    // 15. PESTAÑAS DE INFORMACIÓN
    // ========================================
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabs.length > 0 && tabContents.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(tabId)?.classList.add('active');
            });
        });
    }
    
    // ========================================
    // 16. PREGUNTAS FRECUENTES (FAQ)
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                faqItems.forEach(i => i.classList.remove('active'));
                
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // ========================================
    // 17. BOTONES DE COTIZACIÓN
    // ========================================
    document.querySelectorAll('.btn-cotizar').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const autoCard = this.closest('.auto-card');
            const autoName = autoCard?.querySelector('.auto-title')?.textContent || 'un Toyota';
            
            showNotification(`Cotización de ${autoName} enviada`, 'success');
            
            // Redirigir a cotizar después de 1 segundo
            setTimeout(() => {
                window.location.href = `cotizar.html?modelo=${encodeURIComponent(autoName)}`;
            }, 1000);
        });
    });
    
    // ========================================
    // 18. MAPA INTERACTIVO
    // ========================================
    const mapButtons = document.querySelectorAll('.sede-link');
    
    if (mapButtons.length > 0) {
        mapButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const sedeCard = this.closest('.sede-card');
                const sedeName = sedeCard?.querySelector('h3')?.textContent || 'la sede';
                
                showNotification(`Abriendo mapa de ${sedeName}`, 'success');
                
                // Aquí iría la integración real con Google Maps
            });
        });
    }
    
    // ========================================
    // 19. CONTADOR DE ESTADÍSTICAS
    // ========================================
    function animateStats() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            if (isNaN(target)) return;
            
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                }
            }, 30);
        });
    }
    
    // Animar stats cuando sean visibles
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(statsSection);
    }
    
    // ========================================
    // 20. MANEJO DE ERRORES
    // ========================================
    window.onerror = function(msg, url, line) {
        console.log('Error detectado pero manejado:', msg);
        return true;
    };
    
    console.log('✅ Script de Grupo Mopal cargado correctamente');
});

// ========================================
// FUNCIONES GLOBALES
// ========================================

// Función para compartir en redes
window.compartirAuto = function(modelo, precio) {
    const texto = `Mira este ${modelo} en Grupo Mopal - ${precio}`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Grupo Mopal - Toyota',
            text: texto,
            url: url,
        });
    } else {
        prompt('Comparte este enlace:', url);
    }
};

// Función para imprimir ficha técnica
window.imprimirFicha = function() {
    window.print();
};

// Función para calcular financiamiento
window.calcularFinanciamiento = function(precio, entrada, meses) {
    const montoFinanciar = precio - entrada;
    const interesAnual = 0.12; // 12% anual
    const interesMensual = interesAnual / 12;
    
    const cuota = montoFinanciar * (interesMensual * Math.pow(1 + interesMensual, meses)) / 
                  (Math.pow(1 + interesMensual, meses) - 1);
    
    return {
        montoFinanciar,
        cuotaMensual: Math.round(cuota),
        totalPagar: Math.round(cuota * meses)
    };
};
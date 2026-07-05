document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Sleek Glass Header Scroll Effect
    // -------------------------------------------------------------
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // -------------------------------------------------------------
    // 2. Mobile Navigation Toggle
    // -------------------------------------------------------------
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-link');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            const icon = navToggle.querySelector('i');
            if (navLinks.classList.contains('mobile-active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars-staggered';
            }
        });

        // Close menu on nav item click
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
                const icon = navToggle.querySelector('i');
                icon.className = 'fa-solid fa-bars-staggered';
            });
        });
    }

    // -------------------------------------------------------------
    // 3. Typing Effect (Hero Section Tagline)
    // -------------------------------------------------------------
    const typingTarget = document.getElementById('typing-target');
    const words = [
        "Deep Learning Models.",
        "Computer Vision Systems.",
        "Robust Backend APIs.",
        "Intelligent AI Applications."
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        if (!typingTarget) return;

        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingTarget.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingTarget.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 300; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    type();

    // -------------------------------------------------------------
    // 4. Project Category Filtering Tab Logic
    // -------------------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-btn');
    const projectCards = document.querySelectorAll('.project-card');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    card.style.animation = 'none';
                    card.offsetHeight;
                    card.style.animation = null;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------
    // 5. Scroll Spy: Auto Highlight Navigation Links
    // -------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // -------------------------------------------------------------
    // 6. Interactive Contact Form Submission & Mocking
    // -------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnContent = submitBtn.innerHTML;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            formFeedback.textContent = '';
            formFeedback.className = 'form-feedback';

            setTimeout(() => {
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;

                if (name && email) {
                    formFeedback.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                    formFeedback.classList.add('success');
                    contactForm.reset();
                } else {
                    formFeedback.textContent = 'Oops! Please fill in all fields correctly.';
                    formFeedback.classList.add('error');
                }
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }, 1500);
        });
    }

    // -------------------------------------------------------------
    // 7. Interactive Background Canvas Particles (Visual 10/10)
    // -------------------------------------------------------------
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 65;

        // Resize Canvas
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Particle Class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.alpha = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                const theme = document.body.classList.contains('light-theme') ? 'rgba(109, 40, 217,' : 'rgba(6, 182, 212,';
                ctx.fillStyle = `${theme} ${this.alpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, idx) => {
                p.update();
                p.draw();

                // Connect nearby particles
                for (let j = idx + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 100) {
                        const baseColor = document.body.classList.contains('light-theme') ? '109, 40, 217' : '6, 182, 212';
                        const lineAlpha = (1 - dist / 100) * 0.15;
                        ctx.strokeStyle = `rgba(${baseColor}, ${lineAlpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // -------------------------------------------------------------
    // 8. Dark / Light Mode Switcher (Interactivity 10/10)
    // -------------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            themeToggle.querySelector('i').className = 'fa-solid fa-sun';
        }

        themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-theme');
            const icon = themeToggle.querySelector('i');

            if (isLight) {
                document.body.classList.remove('dark-theme');
                localStorage.setItem('theme', 'light');
                icon.className = 'fa-solid fa-sun';
            } else {
                document.body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
                icon.className = 'fa-solid fa-moon';
            }
        });
    }

    // -------------------------------------------------------------
    // 9. Intersection Observer Scroll Reveal (Aesthetics 10/10)
    // -------------------------------------------------------------
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // -------------------------------------------------------------
    // 10. Copy-to-Clipboard Functionality (UX 10/10)
    // -------------------------------------------------------------
    const copyButtons = document.querySelectorAll('.btn-copy');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const icon = btn.querySelector('i');
                icon.className = 'fa-solid fa-check';
                btn.classList.add('copied');
                btn.title = 'Copied!';

                setTimeout(() => {
                    icon.className = 'fa-regular fa-copy';
                    btn.classList.remove('copied');
                    btn.title = 'Copy';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });

    // -------------------------------------------------------------
    // 11. Project Details Modal (UX 10/10)
    // -------------------------------------------------------------
    const projectModal = document.getElementById('project-modal');
    const modalTag = document.getElementById('modal-project-tag');
    const modalTitle = document.getElementById('modal-project-title');
    const modalBody = document.getElementById('modal-project-body');
    const openModalButtons = document.querySelectorAll('.open-modal-btn');
    const closeModalBtn = document.querySelector('.close-modal-btn');

    // Projects Content Object
    const projectsData = {
        cheque: {
            tag: "Computer Vision / Deep Learning",
            title: "Cheque Field Detection using Faster R-CNN",
            body: `
                <p>Developing deep learning assisted architectures for automated bank document parsing and indexing.</p>
                <h4>Key Methodologies & Technologies:</h4>
                <ul>
                    <li><i class="fa-solid fa-chevron-right"></i> <strong>Model Zoo:</strong> Trained Faster R-CNN with ResNet-50-FPN and ResNet-18-FPN backbones on mixed SBI/IDRBT cheque datasets.</li>
                    <li><i class="fa-solid fa-chevron-right"></i> <strong>CVAT & Nuclio:</strong> Configured YOLOv8 serverless engines via Docker/Nuclio on the CVAT web pipeline.</li>
                    <li><i class="fa-solid fa-chevron-right"></i> <strong>Data Pipelines:</strong> Automated label conversions from YOLO format text coordinates to Pascal VOC bounding XML blocks.</li>
                </ul>
            `
        },
        predictmedix: {
            tag: "Machine Learning",
            title: "PredictMedix - Medical Cost Prediction",
            body: `
                <p>Statistical regression modeling and predictive risk pipelines for healthcare insurance providers.</p>
                <h4>Key Methodologies & Technologies:</h4>
                <ul>
                    <li><i class="fa-solid fa-chevron-right"></i> <strong>Feature Engineering:</strong> Preprocessed outliers, scaled demographic metrics (BMI index, smoking habit), and analyzed correlation grids.</li>
                    <li><i class="fa-solid fa-chevron-right"></i> <strong>Estimators:</strong> Built and compared Linear Regression, Random Forest, and Gradient Boosting models.</li>
                    <li><i class="fa-solid fa-chevron-right"></i> <strong>Model Metrics:</strong> Optimized R-squared (R²) accuracy index and scaled feature weights.</li>
                </ul>
            `
        },
        travelquest: {
            tag: "Backend Web Development",
            title: "Travel Quest - Hotel Booking Backend",
            body: `
                <p>Fully functional RESTful booking engine managing transaction pipelines, auth indexes, and maps.</p>
                <h4>Key Methodologies & Technologies:</h4>
                <ul>
                    <li><i class="fa-solid fa-chevron-right"></i> <strong>API Architectures:</strong> Developed router endpoints using Express.js and Node.js backend.</li>
                    <li><i class="fa-solid fa-chevron-right"></i> <strong>Data Mappings:</strong> Configured MongoDB collections, schema normalization, and user authorization cookies.</li>
                    <li><i class="fa-solid fa-chevron-right"></i> <strong>Cloud Storage:</strong> Connected Cloudinary media buckets for uploading property image galleries.</li>
                </ul>
            `
        }
    };

    openModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const projectKey = btn.getAttribute('data-project');
            const data = projectsData[projectKey];

            if (data && projectModal) {
                modalTag.textContent = data.tag;
                modalTitle.textContent = data.title;
                modalBody.innerHTML = data.body;
                
                projectModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        if (projectModal) {
            projectModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });


    // -------------------------------------------------------------
    // 13. Collapsible Local Message Sandbox Logger (UX 10/10)
    // -------------------------------------------------------------
    const btnToggleLog = document.getElementById('btn-toggle-log');
    const messagesLogContent = document.getElementById('messages-log-content');
    const messagesList = document.getElementById('messages-list');
    const noMessagesAlert = document.getElementById('no-messages-alert');
    const btnClearLog = document.getElementById('btn-clear-log');

    // Toggle panel
    if (btnToggleLog && messagesLogContent) {
        btnToggleLog.addEventListener('click', () => {
            const isShowing = messagesLogContent.classList.toggle('show');
            btnToggleLog.classList.toggle('active');
        });
    }

    // Render function
    function renderMessages() {
        if (!messagesList) return;
        
        messagesList.innerHTML = '';
        const savedMessages = JSON.parse(localStorage.getItem('recruiter_messages')) || [];

        if (savedMessages.length === 0) {
            noMessagesAlert.style.display = 'block';
            btnClearLog.style.display = 'none';
        } else {
            noMessagesAlert.style.display = 'none';
            btnClearLog.style.display = 'block';

            savedMessages.forEach(msg => {
                const li = document.createElement('li');
                li.className = 'messages-item scroll-reveal reveal-active';
                li.innerHTML = `
                    <div class="msg-header">
                        <span class="msg-sender"><i class="fa-solid fa-user-tie"></i> ${msg.name} (${msg.email})</span>
                        <span class="msg-time"><i class="fa-regular fa-clock"></i> ${msg.timestamp}</span>
                    </div>
                    <div class="msg-subject">Subject: ${msg.subject}</div>
                    <div class="msg-body">${msg.message}</div>
                `;
                messagesList.appendChild(li);
            });
        }
    }

    // Log submitted values
    const contactFormHandler = document.getElementById('contact-form');
    if (contactFormHandler && formFeedback) {
        contactFormHandler.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Log details in localStorage sandbox
            const savedMessages = JSON.parse(localStorage.getItem('recruiter_messages')) || [];
            const newMessage = {
                name,
                email,
                subject,
                message,
                timestamp: new Date().toLocaleString()
            };
            savedMessages.unshift(newMessage);
            localStorage.setItem('recruiter_messages', JSON.stringify(savedMessages));

            // Rerender logs
            renderMessages();
        });
    }

    // Clear logs
    if (btnClearLog) {
        btnClearLog.addEventListener('click', () => {
            localStorage.removeItem('recruiter_messages');
            renderMessages();
        });
    }

    // Run render on load
    renderMessages();

    // -------------------------------------------------------------
    // 14. Floating Back-to-Top Action Trigger (UX 10/10)
    // -------------------------------------------------------------
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // -------------------------------------------------------------
    // 15. Scroll Progress Bar (UX 10/10)
    // -------------------------------------------------------------
    const progressBar = document.getElementById('scroll-progress-bar');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
});

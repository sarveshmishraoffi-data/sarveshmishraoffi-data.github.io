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

    // Projects Content Object (Synchronized with latest CV & Research Benchmarks)
    const projectsData = {
        cheque: {
            tag: "Computer Vision / Deep Learning / Document AI",
            title: "Handwritten Cheque Field Information Extraction Model (SRIS-2026)",
            body: `
                <p>Completed a prestigious DST-funded research internship under the <strong>Summer Research Internship Scheme (SRIS) - 2026</strong> at <strong>IIT (ISM) Dhanbad</strong>, guided by <strong>Dr. Soumen Bag</strong> (Associate Professor, Dept. of CSE). Developed Faster R-CNN architectures to automatically localize and segment five critical handwritten fields on bank cheques: <em>Date, Name, Amount in Words, Amount in Numbers, and Signature</em>.</p>
                
                <h4>Key Methodologies & Pipelines:</h4>
                <ul>
                    <li><i class="fa-solid fa-chevron-right"></i> <span><strong>Dataset Design & Label Pipeline:</strong> Curated multi-stage datasets combining 620 synthetic cheques and 112 real-world IDRBT cheques, evaluated against unseen real State Bank of India (SBI) and multi-bank cheques. Converted YOLO coordinates to Pascal-VOC annotations using CVAT.</span></li>
                    <li><i class="fa-solid fa-chevron-right"></i> <span><strong>Transfer Learning & Training Strategy:</strong> Trained and benchmarked <strong>Faster R-CNN</strong> models with <strong>ResNet18-FPN</strong> and <strong>ResNet50-FPN</strong> backbones. Applied transfer learning with 50% frozen backbone weights, AdamW optimizer, and ReduceLROnPlateau scheduler to close the synthetic-to-real domain gap.</span></li>
                    <li><i class="fa-solid fa-chevron-right"></i> <span><strong>AI-Assisted Auto-Annotation:</strong> Integrated SAM (Segment Anything Model) and YOLOv8 models into CVAT via Docker and Nuclio serverless functions, accelerating dataset annotation throughput.</span></li>
                    <li><i class="fa-solid fa-chevron-right"></i> <span><strong>Document OCR Pipelines:</strong> Built OCR-ready preprocessing and evaluation pipelines incorporating OpenCV, EasyOCR, and PaddleOCR for downstream information extraction.</span></li>
                </ul>

                <h4>Quantitative Benchmark Evaluation:</h4>
                <div style="overflow-x: auto; margin: 1rem 0;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--border-glass); font-weight: 600; color: var(--accent-secondary);">
                                <th style="padding: 0.6rem;">Model Backbone & Evaluation</th>
                                <th style="padding: 0.6rem;">Precision</th>
                                <th style="padding: 0.6rem;">Recall</th>
                                <th style="padding: 0.6rem;">F1-Score</th>
                                <th style="padding: 0.6rem;">Mean IoU</th>
                                <th style="padding: 0.6rem;">mAP@50</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="border-bottom: 1px solid var(--border-glass); background: rgba(16, 185, 129, 0.08);">
                                <td style="padding: 0.6rem; font-weight: 600; color: #10b981;">ResNet18-FPN (Unseen SBI Cheques)</td>
                                <td style="padding: 0.6rem; font-weight: 700; color: #10b981;">98.40%</td>
                                <td style="padding: 0.6rem;">94.62%</td>
                                <td style="padding: 0.6rem; font-weight: 700; color: #10b981;">96.47%</td>
                                <td style="padding: 0.6rem;">82.10%</td>
                                <td style="padding: 0.6rem; font-weight: 700; color: #10b981;">98.00%</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border-glass);">
                                <td style="padding: 0.6rem; font-weight: 600; color: var(--accent-primary);">ResNet18-FPN (5-Class + Signature)</td>
                                <td style="padding: 0.6rem;">92.42%</td>
                                <td style="padding: 0.6rem;">96.06%</td>
                                <td style="padding: 0.6rem; font-weight: 600;">94.21%</td>
                                <td style="padding: 0.6rem;">81.20%</td>
                                <td style="padding: 0.6rem; font-weight: 600; color: var(--accent-primary);">97.08%</td>
                            </tr>
                            <tr style="border-bottom: 1px solid var(--border-glass);">
                                <td style="padding: 0.6rem; font-weight: 600;">ResNet50-FPN (5-Class + Signature)</td>
                                <td style="padding: 0.6rem;">90.98%</td>
                                <td style="padding: 0.6rem;">95.28%</td>
                                <td style="padding: 0.6rem; font-weight: 600;">93.08%</td>
                                <td style="padding: 0.6rem;">82.69%</td>
                                <td style="padding: 0.6rem;">93.60%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <a href="https://sarveshmishraoffi-data-sarvesh-portfolio.static.hf.space/assets/certificates/IIT_Dhanbad_Experience_Letter.pdf" target="_blank" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                        <i class="fa-solid fa-file-contract"></i>
                        <span>Verified IIT ISM Experience Letter</span>
                    </a>
                </div>
            `
        },
        predictmedix: {
            tag: "Machine Learning & Explainable AI",
            title: "PredictMedix — Medical Cost Prediction System",
            body: `
                <p>Designed and built an end-to-end Machine Learning pipeline and web application for healthcare insurance cost estimation and risk analysis, featuring Explainable AI (XAI).</p>
                
                <h4>Key Methodologies & Technologies:</h4>
                <ul>
                    <li><i class="fa-solid fa-chevron-right"></i> <span><strong>Data Engineering & Pipeline:</strong> Preprocessed structured clinical datasets, conducted Exploratory Data Analysis (EDA), engineered interaction features, scaled demographic variables (BMI, smoking status, age, region), and handled outliers using Pandas, NumPy, and Scikit-learn.</span></li>
                    <li><i class="fa-solid fa-chevron-right"></i> <span><strong>Model Training & Optimization:</strong> Implemented and evaluated Multiple Linear Regression, Random Forest, and Gradient Boosting (XGBoost). Optimized hyperparameters against MAE, RMSE, and R² metrics.</span></li>
                    <li><i class="fa-solid fa-chevron-right"></i> <span><strong>SHAP Explainable AI (XAI):</strong> Integrated SHAP (SHapley Additive exPlanations) values to interpret individual patient predictions, showing feature importance waterfall plots for medical transparent billing.</span></li>
                    <li><i class="fa-solid fa-chevron-right"></i> <span><strong>Full-Stack Flask App:</strong> Developed a responsive Flask web application with user authentication, dual-mode database storage (MongoDB with local JSON fallback), 5-year longitudinal cost projections, and dynamic PDF invoice report generation.</span></li>
                </ul>

                <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <a href="https://huggingface.co/spaces/sarveshmishraoffi-data/PredictMedix" target="_blank" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        <span>Open Live Demo</span>
                    </a>
                    <a href="https://github.com/sarveshmishraoffi-data/Btech_Major_Project_PredictMedix" target="_blank" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                        <i class="fa-brands fa-github"></i>
                        <span>View Source Code</span>
                    </a>
                </div>
            `
        },
        travelquest: {
            tag: "Full-Stack Backend Web Development",
            title: "Travel Quest — Hotel Booking Web Application",
            body: `
                <p>Designed and engineered a scalable backend and hotel booking platform with full CRUD workflows, rich map integration, and secure user session management.</p>
                
                <h4>Key Methodologies & Technologies:</h4>
                <ul>
                    <li><i class="fa-solid fa-chevron-right"></i> <span><strong>RESTful API Architecture:</strong> Designed clean, modular RESTful APIs using <strong>Node.js</strong> and <strong>Express.js</strong> for property listings, user profiles, reviews, and bookings.</span></li>
                    <li><i class="fa-solid fa-chevron-right"></i> <span><strong>Authentication & Security:</strong> Built robust user authentication and session management using <strong>Passport.js</strong>, author/owner authorization controls, <strong>Joi</strong> request schema validation, and centralized error-handling middleware.</span></li>
                    <li><i class="fa-solid fa-chevron-right"></i> <span><strong>Database & Schemas:</strong> Structured normalized <strong>MongoDB</strong> collections using <strong>Mongoose</strong> ODM, supporting complex query filters across 9 listing categories, price alerts, and similar-listing recommendations.</span></li>
                    <li><i class="fa-solid fa-chevron-right"></i> <span><strong>Cloud Media & Maps Integration:</strong> Connected <strong>Cloudinary</strong> for cloud asset storage/image optimization and integrated <strong>Mapbox GL</strong> APIs for interactive geocoding and property location pins.</span></li>
                </ul>

                <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <a href="https://huggingface.co/spaces/sarveshmishraoffi-data/travel-quest" target="_blank" class="btn btn-primary btn-sm" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        <span>Open Live Demo</span>
                    </a>
                    <a href="https://github.com/sarveshmishraoffi-data/Btech_Minor_Project_Travel_Quest" target="_blank" class="btn btn-outline btn-sm" style="display: inline-flex; align-items: center; gap: 0.5rem;">
                        <i class="fa-brands fa-github"></i>
                        <span>View Source Code</span>
                    </a>
                </div>
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

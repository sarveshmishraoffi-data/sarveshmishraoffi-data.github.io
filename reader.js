/**
 * Secure Read-Only Book Reader JavaScript Engine
 * Author: Sarvesh Mishra Portfolio
 * DRM & Anti-Theft Protections:
 *   - Zero DOM text layer (Canvas-only rendering)
 *   - Anti-Copy / Anti-Cut / Anti-Select
 *   - Right-click contextmenu interception
 *   - Keyboard shortcut deterrence (Ctrl+C, Ctrl+S, Ctrl+P, F12, PrintScreen)
 *   - Loss-of-focus privacy shield (Snipping Tool & screen capture guard)
 *   - Dynamic indelible canvas watermarking
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. PDF.js Setup & Variables
    // -------------------------------------------------------------------------
    const pdfjsLib = window['pdfjs-dist/build/pdf'];
    if (!pdfjsLib) {
        console.error('PDF.js library failed to load.');
        return;
    }

    // Set worker source matching the loaded version
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    // Primary and CDN Fallback URLs for Book PDF
    const localPdfUrl = 'assets/books/My_Book.pdf';
    const cdnPdfUrl = 'https://sarveshmishraoffi-data-sarvesh-portfolio.static.hf.space/assets/books/My_Book.pdf';

    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;
    let scale = 1.0;
    let fitWidthScale = 1.0;

    // DOM Elements
    const canvas = document.getElementById('pdf-canvas');
    const ctx = canvas.getContext('2d');
    const pageNumInput = document.getElementById('page-input');
    const pageCountElem = document.getElementById('page-count');
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const zoomFitBtn = document.getElementById('zoom-fit-btn');
    const zoomText = document.getElementById('zoom-level-text');
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const loadingOverlay = document.getElementById('loading-overlay');
    const privacyShield = document.getElementById('privacy-shield');
    const btnResume = document.getElementById('btn-resume');
    const toastElem = document.getElementById('security-toast');
    const toastText = document.getElementById('security-toast-text');

    // -------------------------------------------------------------------------
    // 2. Render Page Function with Pixel Watermark
    // -------------------------------------------------------------------------
    function renderPage(num) {
        pageRendering = true;
        updateNavState();

        pdfDoc.getPage(num).then((page) => {
            const viewportArea = document.querySelector('.reader-viewport');
            const availableWidth = Math.max(viewportArea.clientWidth - 64, 320);

            // Compute default fit-to-width scale on first render or fit
            const unscaledViewport = page.getViewport({ scale: 1.0 });
            fitWidthScale = Math.min(availableWidth / unscaledViewport.width, 1.8);
            
            const currentScale = scale * fitWidthScale;
            const viewport = page.getViewport({ scale: currentScale });

            // Set canvas dimensions at high DPI for crisp retina text
            const outputScale = window.devicePixelRatio || 1;
            canvas.width = Math.floor(viewport.width * outputScale);
            canvas.height = Math.floor(viewport.height * outputScale);
            canvas.style.width = Math.floor(viewport.width) + 'px';
            canvas.style.height = Math.floor(viewport.height) + 'px';

            const transform = outputScale !== 1
                ? [outputScale, 0, 0, outputScale, 0, 0]
                : null;

            const renderContext = {
                canvasContext: ctx,
                transform: transform,
                viewport: viewport
            };

            const renderTask = page.render(renderContext);

            renderTask.promise.then(() => {
                // Apply indelible diagonal watermark directly to canvas pixels
                applyCanvasWatermark(viewport.width * outputScale, viewport.height * outputScale);

                pageRendering = false;
                if (loadingOverlay) {
                    loadingOverlay.style.opacity = '0';
                    setTimeout(() => { loadingOverlay.style.display = 'none'; }, 300);
                }

                if (pageNumPending !== null) {
                    renderPage(pageNumPending);
                    pageNumPending = null;
                }
            }).catch((err) => {
                console.error('Page render error:', err);
                pageRendering = false;
            });
        });

        pageNumInput.value = num;
        zoomText.textContent = Math.round(scale * 100) + '%';
    }

    // Dynamic Pixel-Level Watermarking
    function applyCanvasWatermark(width, height) {
        ctx.save();
        ctx.font = `600 ${Math.max(16, Math.round(width / 36))}px Inter, sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const watermarkText = "मनुष्य होने की यात्रा • Sarvesh Mishra • Protected Reader";
        const spacingX = Math.max(300, width / 2.5);
        const spacingY = Math.max(220, height / 5);

        ctx.translate(width / 2, height / 2);
        ctx.rotate(-28 * Math.PI / 180);
        ctx.translate(-width / 2, -height / 2);

        for (let x = -width; x < width * 2; x += spacingX) {
            for (let y = -height; y < height * 2; y += spacingY) {
                ctx.fillText(watermarkText, x, y);
            }
        }
        ctx.restore();
    }

    function queueRenderPage(num) {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPage(num);
        }
    }

    function onPrevPage() {
        if (pageNum <= 1) return;
        pageNum--;
        queueRenderPage(pageNum);
    }

    function onNextPage() {
        if (pageNum >= pdfDoc.numPages) return;
        pageNum++;
        queueRenderPage(pageNum);
    }

    function updateNavState() {
        if (prevBtn) prevBtn.disabled = pageNum <= 1;
        if (nextBtn) nextBtn.disabled = (pdfDoc && pageNum >= pdfDoc.numPages);
    }

    // -------------------------------------------------------------------------
    // 3. Toolbar Event Handlers
    // -------------------------------------------------------------------------
    if (prevBtn) prevBtn.addEventListener('click', onPrevPage);
    if (nextBtn) nextBtn.addEventListener('click', onNextPage);

    if (pageNumInput) {
        pageNumInput.addEventListener('change', () => {
            const val = parseInt(pageNumInput.value, 10);
            if (!isNaN(val) && val >= 1 && val <= pdfDoc.numPages) {
                pageNum = val;
                queueRenderPage(pageNum);
            } else {
                pageNumInput.value = pageNum;
            }
        });
        pageNumInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') pageNumInput.blur();
        });
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', () => {
            if (scale < 2.5) {
                scale = Math.min(2.5, +(scale + 0.2).toFixed(2));
                queueRenderPage(pageNum);
            }
        });
    }

    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', () => {
            if (scale > 0.6) {
                scale = Math.max(0.6, +(scale - 0.2).toFixed(2));
                queueRenderPage(pageNum);
            }
        });
    }

    if (zoomFitBtn) {
        zoomFitBtn.addEventListener('click', () => {
            scale = 1.0;
            queueRenderPage(pageNum);
        });
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
                fullscreenBtn.innerHTML = '<i class="fa-solid fa-compress"></i>';
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                    fullscreenBtn.innerHTML = '<i class="fa-solid fa-expand"></i>';
                }
            }
        });
    }

    // Resize recalculation
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (pdfDoc) queueRenderPage(pageNum);
        }, 200);
    });

    // -------------------------------------------------------------------------
    // 4. Load Document (With Fallback Resilience)
    // -------------------------------------------------------------------------
    function loadPdfDocument(targetUrl) {
        const loadingTask = pdfjsLib.getDocument({
            url: targetUrl,
            cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
            cMapPacked: true,
            disableStream: false,
            disableAutoFetch: false
        });

        loadingTask.promise.then((pdf) => {
            pdfDoc = pdf;
            if (pageCountElem) pageCountElem.textContent = pdfDoc.numPages;
            renderPage(pageNum);
        }).catch((err) => {
            console.warn(`Failed loading from ${targetUrl}, trying fallback CDN...`, err);
            if (targetUrl !== cdnPdfUrl) {
                loadPdfDocument(cdnPdfUrl);
            } else {
                showSecurityToast('Unable to load book stream. Please check connection.');
            }
        });
    }

    // Start initial load
    loadPdfDocument(localPdfUrl);

    // -------------------------------------------------------------------------
    // 5. DRM Security: Multi-Layer Anti-Piracy Protections
    // -------------------------------------------------------------------------
    let toastTimeout;
    function showSecurityToast(msg) {
        if (!toastElem) return;
        toastText.textContent = msg;
        toastElem.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastElem.classList.remove('show');
        }, 2500);
    }

    // A. Disable Context Menu (Right Click)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showSecurityToast('Right-click is disabled on protected publications.');
        return false;
    });

    // B. Disable Selection & Dragging
    document.addEventListener('selectstart', (e) => e.preventDefault());
    document.addEventListener('dragstart', (e) => e.preventDefault());

    // C. Keyboard Shortcuts Interception
    window.addEventListener('keydown', (e) => {
        // Block Arrow Keys navigation
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
            onNextPage();
            return;
        }
        if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            onPrevPage();
            return;
        }

        const isCtrl = e.ctrlKey || e.metaKey;

        // Block Copy, Cut, Select All
        if (isCtrl && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'a' || e.key === 'A')) {
            e.preventDefault();
            showSecurityToast('Text selection and copying are strictly disabled.');
            return false;
        }

        // Block Save Page / Save PDF
        if (isCtrl && (e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            showSecurityToast('Saving is restricted on this document.');
            return false;
        }

        // Block Print
        if (isCtrl && (e.key === 'p' || e.key === 'P')) {
            e.preventDefault();
            showSecurityToast('Printing is strictly prohibited.');
            return false;
        }

        // Block View Source
        if (isCtrl && (e.key === 'u' || e.key === 'U')) {
            e.preventDefault();
            showSecurityToast('Source inspection is restricted.');
            return false;
        }

        // Block Developer Tools (F12, Ctrl+Shift+I/J/C)
        if (e.key === 'F12' || (isCtrl && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c'))) {
            e.preventDefault();
            showSecurityToast('Developer tools access is blocked.');
            return false;
        }

        // PrintScreen Key Handling
        if (e.key === 'PrintScreen' || e.keyCode === 44) {
            e.preventDefault();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText('').catch(() => {});
            }
            triggerPrivacyShield();
            showSecurityToast('Screen capture is restricted on this publication.');
            return false;
        }
    }, true);

    // D. Loss-of-Focus Privacy Shield (Snipping Tool & Window Switch Guard)
    function triggerPrivacyShield() {
        if (privacyShield) privacyShield.classList.add('active');
    }

    function dismissPrivacyShield() {
        if (privacyShield) privacyShield.classList.remove('active');
    }

    window.addEventListener('blur', () => {
        triggerPrivacyShield();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            triggerPrivacyShield();
        }
    });

    if (btnResume) {
        btnResume.addEventListener('click', () => {
            dismissPrivacyShield();
            window.focus();
        });
    }

    if (privacyShield) {
        privacyShield.addEventListener('click', () => {
            dismissPrivacyShield();
            window.focus();
        });
    }

    // Print event blocker
    window.addEventListener('beforeprint', () => {
        triggerPrivacyShield();
    });
});

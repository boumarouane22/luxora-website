// Mobile Sidebar Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const languageSelect = document.getElementById('languageSelect');
    const mobileLanguageSelect = document.getElementById('mobileLanguageSelect');

    // Open sidebar
    function openSidebar() {
        mobileSidebar.classList.add('active');
        mobileOverlay.classList.add('active');
        mobileMenuBtn.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close sidebar
    function closeSidebar() {
        mobileSidebar.classList.remove('active');
        mobileOverlay.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners
    mobileMenuBtn.addEventListener('click', openSidebar);
    mobileCloseBtn.addEventListener('click', closeSidebar);
    mobileOverlay.addEventListener('click', closeSidebar);

    // Close sidebar when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            closeSidebar();
            
            if (targetSection) {
                setTimeout(() => {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        });
    });

    // Sync language selectors
    if (languageSelect && mobileLanguageSelect) {
        languageSelect.addEventListener('change', function() {
            mobileLanguageSelect.value = this.value;
        });

        mobileLanguageSelect.addEventListener('change', function() {
            languageSelect.value = this.value;
            // Trigger change event on main selector to update language
            languageSelect.dispatchEvent(new Event('change'));
            closeSidebar();
        });
    }

    // Close sidebar on window resize if open
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeSidebar();
        }
    });
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("YOUR_PUBLIC_KEY"); // سيتم تحديثه لاحقاً
    
    // Wait for language manager to initialize
    setTimeout(() => {
        // Update success/error messages based on current language
        updateMessageLanguage();
    }, 100);
    
    // Navigation smooth scroll
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Hero buttons smooth scroll
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(52, 73, 94, 0.95) 100%)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)';
            header.style.backdropFilter = 'none';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .contact-item, .form-card, .step-card, .vision-card, .feature-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Form handling
    setupFormHandling();
});

function setupFormHandling() {
    // Job Application Form
    const jobForm = document.getElementById('jobForm');
    if (jobForm) {
        jobForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleJobApplication(this);
        });
    }

    // Investment Form
    const investmentForm = document.getElementById('investmentForm');
    if (investmentForm) {
        investmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleInvestmentApplication(this);
        });
    }
}

function handleJobApplication(form) {
    const formData = new FormData(form);
    const data = {
        name: formData.get('jobName'),
        email: formData.get('jobEmail'),
        phone: formData.get('jobPhone'),
        position: formData.get('jobPosition'),
        experience: formData.get('jobExperience'),
        message: formData.get('jobMessage'),
        cv: formData.get('jobCV')
    };

    // Validate form
    if (!validateJobForm(data)) {
        return;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    const sendingText = window.currentLabels?.sending || 'جاري الإرسال...';
    submitButton.textContent = sendingText;
    submitButton.disabled = true;

    // Send email using EmailJS
    const emailParams = {
        to_email: 'luxora.invest@gmail.com',
        subject: 'طلب عمل جديد - ' + data.position,
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        position: data.position,
        experience: data.experience,
        message: data.message || 'لا توجد رسالة إضافية',
        form_type: 'طلب عمل'
    };

    // Send the email
    sendEmailNotification(emailParams)
        .then(() => {
            const successMsg = window.currentLabels?.jobSuccess || 'تم إرسال طلب العمل بنجاح! سنتواصل معك قريباً.';
            showSuccessMessage(form, successMsg);
            form.reset();
        })
        .catch((error) => {
            console.error('خطأ في إرسال البريد:', error);
            const errorMsg = window.currentLabels?.error || 'حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى.';
            showErrorMessage(form, errorMsg);
        })
        .finally(() => {
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
}

function handleInvestmentApplication(form) {
    const formData = new FormData(form);
    const data = {
        name: formData.get('investorName'),
        email: formData.get('investorEmail'),
        phone: formData.get('investorPhone'),
        type: formData.get('investorType'),
        amount: formData.get('investmentAmount'),
        period: formData.get('investmentPeriod'),
        riskTolerance: formData.get('riskTolerance'),
        message: formData.get('investmentMessage')
    };

    // Validate form
    if (!validateInvestmentForm(data)) {
        return;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    const sendingText = window.currentLabels?.sending || 'جاري الإرسال...';
    submitButton.textContent = sendingText;
    submitButton.disabled = true;

    // Send email using EmailJS
    const emailParams = {
        to_email: 'luxora.invest@gmail.com',
        subject: 'طلب استثمار جديد - ' + data.type,
        from_name: data.name,
        from_email: data.email,
        phone: data.phone,
        investor_type: data.type,
        amount: data.amount,
        period: data.period,
        risk_tolerance: data.riskTolerance,
        message: data.message || 'لا توجد رسالة إضافية',
        form_type: 'طلب استثمار'
    };

    // Send the email
    sendEmailNotification(emailParams)
        .then(() => {
            const successMsg = window.currentLabels?.investmentSuccess || 'تم إرسال طلب الاستثمار بنجاح! سيتم التواصل معك من قبل فريق الاستثمار.';
            showSuccessMessage(form, successMsg);
            form.reset();
        })
        .catch((error) => {
            console.error('خطأ في إرسال البريد:', error);
            const errorMsg = window.currentLabels?.error || 'حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى.';
            showErrorMessage(form, errorMsg);
        })
        .finally(() => {
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
}

function validateJobForm(data) {
    const errors = [];

    if (!data.name || data.name.length < 2) {
        errors.push('يرجى إدخال اسم صحيح');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('يرجى إدخال بريد إلكتروني صحيح');
    }

    if (!data.phone || data.phone.length < 10) {
        errors.push('يرجى إدخال رقم هاتف صحيح');
    }

    if (!data.position) {
        errors.push('يرجى اختيار المنصب المطلوب');
    }

    if (!data.experience) {
        errors.push('يرجى تحديد سنوات الخبرة');
    }

    if (errors.length > 0) {
        showErrorMessage(document.getElementById('jobForm'), errors.join('<br>'));
        return false;
    }

    return true;
}

function validateInvestmentForm(data) {
    const errors = [];

    if (!data.name || data.name.length < 2) {
        errors.push('يرجى إدخال اسم صحيح');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('يرجى إدخال بريد إلكتروني صحيح');
    }

    if (!data.phone || data.phone.length < 10) {
        errors.push('يرجى إدخال رقم هاتف صحيح');
    }

    if (!data.type) {
        errors.push('يرجى اختيار نوع المستثمر');
    }

    if (!data.amount) {
        errors.push('يرجى تحديد مبلغ الاستثمار');
    }

    if (!data.period) {
        errors.push('يرجى اختيار فترة الاستثمار');
    }

    if (!data.riskTolerance) {
        errors.push('يرجى تحديد مستوى تحمل المخاطر');
    }

    if (errors.length > 0) {
        showErrorMessage(document.getElementById('investmentForm'), errors.join('<br>'));
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage(form, message) {
    // Remove any existing messages
    removeMessages(form);

    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.innerHTML = message;
    messageDiv.style.display = 'block';
    
    form.appendChild(messageDiv);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

function showErrorMessage(form, message) {
    // Remove any existing messages
    removeMessages(form);

    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.innerHTML = message;
    messageDiv.style.display = 'block';
    
    form.appendChild(messageDiv);

    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

function removeMessages(form) {
    const existingMessages = form.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => {
        if (msg.parentNode) {
            msg.parentNode.removeChild(msg);
        }
    });
}

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            // Remove all non-digits
            let value = e.target.value.replace(/\D/g, '');
            
            // Add country code if not present and number starts with 5
            if (value.length > 0 && value[0] === '5' && !value.startsWith('966')) {
                value = '966' + value;
            }
            
            // Format the number
            if (value.startsWith('966')) {
                // Saudi format: +966 XX XXX XXXX
                value = value.replace(/^966(\d{2})(\d{3})(\d{4})/, '+966 $1 $2 $3');
            } else if (value.length >= 10) {
                // General format: XXX XXX XXXX
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
            }
            
            e.target.value = value;
        });
    });
});

// File upload handling
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('jobCV');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                if (!allowedTypes.includes(file.type)) {
                    showErrorMessage(document.getElementById('jobForm'), 'يرجى رفع ملف بصيغة PDF أو DOC أو DOCX فقط');
                    e.target.value = '';
                    return;
                }

                // Validate file size (max 5MB)
                const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                if (file.size > maxSize) {
                    showErrorMessage(document.getElementById('jobForm'), 'حجم الملف يجب أن يكون أقل من 5 ميجابايت');
                    e.target.value = '';
                    return;
                }

                console.log('File selected:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
            }
        });
    }
});

// Add loading animation
function addLoadingAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading::after {
            content: '';
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 8px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
    `;
    document.head.appendChild(style);
}

// Initialize loading animation
addLoadingAnimation();

// Counter animation for statistics (if added later)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString('ar-SA');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString('ar-SA');
        }
    }
    
    updateCounter();
}

// Scroll to top functionality
function addScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        background: linear-gradient(45deg, #f39c12, #e67e22);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
    `;

    document.body.appendChild(scrollButton);

    // Show/hide scroll button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });

    // Scroll to top on click
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Hover effect
    scrollButton.addEventListener('mouseenter', () => {
        scrollButton.style.transform = 'translateY(-3px) scale(1.1)';
        scrollButton.style.boxShadow = '0 6px 20px rgba(243, 156, 18, 0.4)';
    });

    scrollButton.addEventListener('mouseleave', () => {
        scrollButton.style.transform = 'translateY(0) scale(1)';
        scrollButton.style.boxShadow = '0 4px 15px rgba(243, 156, 18, 0.3)';
    });
}

// Initialize scroll to top
document.addEventListener('DOMContentLoaded', addScrollToTop);

// Create email body function
function createEmailBody(params) {
    let body = `
طلب جديد من موقع Luxora
========================

المعلومات الأساسية:
- الاسم: ${params.from_name}
- البريد الإلكتروني: ${params.from_email}
- رقم الهاتف: ${params.phone}
- نوع الطلب: ${params.form_type}

`;

    if (params.form_type === 'طلب عمل' || params.form_type === 'Job Application') {
        body += `
تفاصيل طلب العمل:
- المنصب المطلوب: ${params.position}
- سنوات الخبرة: ${params.experience}
`;
    } else if (params.form_type === 'طلب استثمار' || params.form_type === 'Investment Request') {
        body += `
تفاصيل طلب الاستثمار:
- نوع المستثمر: ${params.investor_type}
- مبلغ الاستثمار: ${params.amount}
- فترة الاستثمار: ${params.period}
- مستوى تحمل المخاطر: ${params.risk_tolerance}
`;
    }

    body += `
الرسالة:
${params.message}

========================
تم الإرسال من موقع Luxora
التاريخ: ${new Date().toLocaleDateString('ar-SA')}
الوقت: ${new Date().toLocaleTimeString('ar-SA')}
`;

    return body;
}

// Update message language
function updateMessageLanguage() {
    if (window.languageManager) {
        const currentLang = window.languageManager.getCurrentLanguage();
        
        // Update form labels and placeholders based on language
        updateFormLabels(currentLang);
    }
}

function updateFormLabels(lang) {
    const formLabels = {
        ar: {
            jobName: "الاسم الكامل",
            jobEmail: "البريد الإلكتروني",
            jobPhone: "رقم الهاتف",
            jobPosition: "المنصب المطلوب",
            jobExperience: "سنوات الخبرة",
            jobCV: "رفع السيرة الذاتية",
            jobMessage: "رسالة تعريفية",
            jobSubmit: "إرسال الطلب",
            investorName: "الاسم الكامل",
            investorEmail: "البريد الإلكتروني",
            investorPhone: "رقم الهاتف",
            investorType: "نوع المستثمر",
            investmentAmount: "مبلغ الاستثمار المطلوب (بالريال السعودي)",
            investmentPeriod: "فترة الاستثمار المفضلة",
            riskTolerance: "مستوى تحمل المخاطر",
            investmentMessage: "أهدافك الاستثمارية",
            investmentSubmit: "إرسال طلب الاستثمار",
            sending: "جاري الإرسال...",
            jobSuccess: "تم إرسال طلب العمل بنجاح! سنتواصل معك قريباً.",
            investmentSuccess: "تم إرسال طلب الاستثمار بنجاح! سيتم التواصل معك من قبل فريق الاستثمار.",
            error: "حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى."
        },
        en: {
            jobName: "Full Name",
            jobEmail: "Email",
            jobPhone: "Phone Number",
            jobPosition: "Position Applied For",
            jobExperience: "Years of Experience",
            jobCV: "Upload Resume",
            jobMessage: "Cover Letter",
            jobSubmit: "Submit Application",
            investorName: "Full Name",
            investorEmail: "Email",
            investorPhone: "Phone Number",
            investorType: "Investor Type",
            investmentAmount: "Investment Amount (SAR)",
            investmentPeriod: "Preferred Investment Period",
            riskTolerance: "Risk Tolerance Level",
            investmentMessage: "Investment Objectives",
            investmentSubmit: "Submit Investment Request",
            sending: "Sending...",
            jobSuccess: "Job application sent successfully! We will contact you soon.",
            investmentSuccess: "Investment request sent successfully! Our investment team will contact you.",
            error: "An error occurred while sending. Please try again."
        },
        it: {
            jobName: "Nome Completo",
            jobEmail: "Email",
            jobPhone: "Numero di Telefono",
            jobPosition: "Posizione Richiesta",
            jobExperience: "Anni di Esperienza",
            jobCV: "Carica CV",
            jobMessage: "Lettera di Presentazione",
            jobSubmit: "Invia Candidatura",
            investorName: "Nome Completo",
            investorEmail: "Email",
            investorPhone: "Numero di Telefono",
            investorType: "Tipo di Investitore",
            investmentAmount: "Importo dell'Investimento (SAR)",
            investmentPeriod: "Periodo di Investimento Preferito",
            riskTolerance: "Livello di Tolleranza al Rischio",
            investmentMessage: "Obiettivi di Investimento",
            investmentSubmit: "Invia Richiesta di Investimento",
            sending: "Invio in corso...",
            jobSuccess: "Candidatura inviata con successo! Ti contatteremo presto.",
            investmentSuccess: "Richiesta di investimento inviata con successo! Il nostro team di investimenti ti contatterà.",
            error: "Si è verificato un errore durante l'invio. Riprova."
        }
    };

    const labels = formLabels[lang] || formLabels.ar;
    
    // Update form labels
    document.querySelectorAll('label[for]').forEach(label => {
        const forAttr = label.getAttribute('for');
        if (labels[forAttr]) {
            label.textContent = labels[forAttr];
        }
    });

    // Store current language labels for use in messages
    window.currentLabels = labels;
}

// Email sending function using Formspree
function sendEmailNotification(params) {
    return new Promise((resolve, reject) => {
        // إعداد البيانات للإرسال عبر Formspree
        const formData = new FormData();
        
        // إضافة البيانات الأساسية
        formData.append('_replyto', params.from_email);
        formData.append('_subject', params.subject);
        formData.append('name', params.from_name);
        formData.append('email', params.from_email);
        formData.append('phone', params.phone);
        formData.append('form_type', params.form_type);
        
        // إضافة البيانات حسب نوع النموذج
        if (params.form_type === 'طلب عمل' || params.form_type === 'Job Application') {
            formData.append('position', params.position);
            formData.append('experience', params.experience);
        } else if (params.form_type === 'طلب استثمار' || params.form_type === 'Investment Request') {
            formData.append('investor_type', params.investor_type);
            formData.append('amount', params.amount);
            formData.append('period', params.period);
            formData.append('risk_tolerance', params.risk_tolerance);
        }
        
        formData.append('message', params.message);
        
        // الطريقة الأولى: استخدام Web3Forms مع المفتاح الحقيقي
        const web3FormsData = new FormData();
        
        web3FormsData.append('access_key', 'fec8ce26-4c14-43af-ac55-e0a238054ff4');
        web3FormsData.append('subject', params.subject);
        web3FormsData.append('name', params.from_name);
        web3FormsData.append('email', params.from_email);
        web3FormsData.append('phone', params.phone);
        web3FormsData.append('form_type', params.form_type);
        web3FormsData.append('message', createEmailBody(params));
        
        // إرسال عبر Web3Forms
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: web3FormsData
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                console.log('✅ تم إرسال البريد بنجاح عبر Web3Forms إلى: luxora.invest@gmail.com');
                console.log('📧 البيانات المرسلة:', {
                    الموضوع: params.subject,
                    المرسل: params.from_name,
                    البريد: params.from_email,
                    النوع: params.form_type,
                    الرد: result
                });
                resolve('تم الإرسال بنجاح');
            } else {
                throw new Error(result.message || 'فشل Web3Forms');
            }
        })
        .catch(error => {
            console.error('❌ فشل Web3Forms، جاري المحاولة عبر Formsubmit...');
            
            // الطريقة البديلة: Formsubmit
            const formsubmitData = new FormData();
            formsubmitData.append('_subject', params.subject);
            formsubmitData.append('_captcha', 'false'); 
            formsubmitData.append('_template', 'table');
            formsubmitData.append('name', params.from_name);
            formsubmitData.append('email', params.from_email);
            formsubmitData.append('phone', params.phone);
            formsubmitData.append('form_type', params.form_type);
            formsubmitData.append('message', createEmailBody(params));
            
            fetch('https://formsubmit.co/luxora.invest@gmail.com', {
                method: 'POST',
                body: formsubmitData
            })
            .then(response => {
                if (response.ok) {
                    console.log('✅ تم الإرسال عبر Formsubmit إلى: luxora.invest@gmail.com');
                    resolve('تم الإرسال بنجاح');
                } else {
                    throw new Error('فشل Formsubmit أيضاً');
                }
            })
            .catch(finalError => {
                console.error('❌ فشلت جميع الطرق، فتح تطبيق البريد المحلي...');
                
                // الطريقة الأخيرة: فتح تطبيق البريد المحلي
                const emailBody = createEmailBody(params);
                const subject = encodeURIComponent(params.subject);
                const body = encodeURIComponent(emailBody);
                const mailtoLink = `mailto:luxora.invest@gmail.com?subject=${subject}&body=${body}`;
                
                console.log('📧 فتح تطبيق البريد المحلي...');
                console.log('📋 البيانات:', {
                    إلى: 'luxora.invest@gmail.com',
                    الموضوع: params.subject,
                    المرسل: params.from_name
                });
                
                window.open(mailtoLink, '_blank');
                resolve('تم فتح تطبيق البريد - يرجى إرسالها يدوياً');
            });
        });
    });
}
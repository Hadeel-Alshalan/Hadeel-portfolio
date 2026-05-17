import { createIcons, icons } from 'lucide';
import { gsap } from 'gsap'; 
import { ScrollTrigger } from 'gsap/ScrollTrigger'; 
import { translations } from './translations.js';

// Initialize Icons 
createIcons({ icons }); 

// Register ScrollTrigger 
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  // Cursor Elements
  const cursor = document.getElementById('cursor');
  const spotlight = document.getElementById('spotlight');
  
  // Initialize Neon Trail
  const trails = [];
  const trailCount = 12;
  for (let i = 0; i < trailCount; i++) {
    const div = document.createElement('div');
    div.classList.add('cursor-trail');
    document.body.appendChild(div);
    trails.push({ element: div, x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }

  const magneticLinks = document.querySelectorAll('.magnetic-link, .magnetic-card');

  // Mouse move handler
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if(spotlight) {
      spotlight.style.background = `radial-gradient(circle 400px at ${mouseX}px ${mouseY}px, rgba(0, 255, 255, 0.05), transparent 100%)`;
    }
  });

  gsap.ticker.add(() => {
    // Lerp cursor
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    if(cursor) {
      cursor.style.left = `${cursorX}px`;
      cursor.style.top = `${cursorY}px`;
    }
    
    // Update Neon Trail
    let tx = mouseX;
    let ty = mouseY;
    trails.forEach((trail, index) => {
      trail.x += (tx - trail.x) * 0.3;
      trail.y += (ty - trail.y) * 0.3;
      trail.element.style.left = `${trail.x}px`;
      trail.element.style.top = `${trail.y}px`;
      trail.element.style.opacity = (1 - (index / trailCount)) * 0.8;
      trail.element.style.transform = `translate(-50%, -50%) scale(${1 - (index / trailCount)})`;
      tx = trail.x;
      ty = trail.y;
    });
  });

  // Magnetic Effect for Buttons and Links
  magneticLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      if(cursor) cursor.classList.add('active');
    });
    
    link.addEventListener('mouseleave', () => {
      if(cursor) cursor.classList.remove('active');
      gsap.to(link, { x: 0, y: 0, duration: 0.3 });
    });

    link.addEventListener('mousemove', (e) => {
      const rect = link.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(link, { x: x * 0.2, y: y * 0.2, duration: 0.3 });
    });
  });

  // --- Scroll Animations with GSAP ---

  // Hero Section
  gsap.to('.animate-up', { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 });
  gsap.to('.animate-up-delay-1', { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.4 });
  gsap.to('.animate-up-delay-2', { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.6 });
  gsap.to('.animate-up-delay-3', { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 });

  // About Section
  gsap.from('.about-text', {
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  // Bento Grid
  gsap.from('.bento-card', {
    scrollTrigger: {
      trigger: '.expertise-section',
      start: 'top 70%',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "power3.out"
  });

  // Timeline Items
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item) => {
    const isRight = item.classList.contains('right');
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
      },
      x: isRight ? 50 : -50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  });

  // Contact Section Dashboard
  gsap.from('.contact-animate', {
    scrollTrigger: {
      trigger: '.contact-section',
      start: 'top 80%',
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from('.sidebar-animate', {
    scrollTrigger: {
      trigger: '.contact-section',
      start: 'top 80%',
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
    delay: 0.3
  });

  // --- Internationalization (i18n) Logic ---
  const langToggle = document.getElementById('lang-toggle');
  let currentLang = localStorage.getItem('preferredLang') || 'en';

  const setLanguage = (lang) => {
    // Save to localStorage
    localStorage.setItem('preferredLang', lang);
    currentLang = lang;

    // Set HTML attributes
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // Toggle button text
    if (langToggle) {
      langToggle.textContent = lang === 'ar' ? 'English' : 'العربية';
    }

    // Update translations
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) {
        // Check if it's a placeholder or innerHTML
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translations[lang][key];
        } else {
          el.innerHTML = translations[lang][key];
        }
      }
    });
  };

  // Initial load
  setLanguage(currentLang);

  // Toggle event
  if (langToggle) {
    langToggle.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = currentLang === 'en' ? 'ar' : 'en';
      setLanguage(newLang);
    });
  }
});

// Contact Form AJAX Submission (Web3Forms)
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.status === 200) {
        formStatus.style.display = 'block';
        formStatus.style.background = 'rgba(0, 255, 87, 0.1)';
        formStatus.style.border = '1px solid rgba(0, 255, 87, 0.3)';
        formStatus.style.color = 'var(--accent-emerald)';
        formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
        contactForm.reset();
      } else {
        throw new Error(result.message || 'Something went wrong');
      }

    } catch (error) {
      formStatus.style.display = 'block';
      formStatus.style.background = 'rgba(255, 0, 255, 0.1)';
      formStatus.style.border = '1px solid rgba(255, 0, 255, 0.3)';
      formStatus.style.color = 'var(--accent-pink)';
      formStatus.textContent = error.message || 'Something went wrong. Please try again later.';
      console.error('Form submission error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
}
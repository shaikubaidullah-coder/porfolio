/**
 * Premium AI Automation Portfolio - Interaction Architecture
 * Handcrafted with Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Page load sequence trigger
  setTimeout(() => {
    document.body.classList.add('is-loaded');
  }, 100);

  initParticles();
  initCustomCursor();
  initHeaderScroll();
  initMobileMenu();
  initScrollRevealStaggered();
  initMagneticButtons();
  initAccordions();
  initTimelineScroll();
  initContactForm();
  initScrollIndicatorDimmer();
  initActiveNavTracker();
  initRouter();
  initConsoleSignature();
  initKeyboardNavigation();
});

/* ==========================================================================
   1. IMPERCEPTIBLE FLOATING PARTICLES CANVAS SYSTEM (Visibility Throttled)
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationFrameId;
  let isTabActive = true;

  // Mouse tracking parameters
  const mouse = {
    x: -9999,
    y: -9999,
    active: false
  };

  // Scope mouse event listeners to window
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
    mouse.active = false;
  });

  // Calculate dynamic particle count based on window size (25–50 on desktop, fewer on mobile)
  function getParticleCount() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let count = Math.floor((width * height) / 36000);

    if (width < 768) {
      count = Math.min(count, 18); // Mobile / Small Screens
    } else if (width < 1200) {
      count = Math.min(count, 32); // Tablets / Medium Laptops
    } else {
      count = Math.min(count, 48); // Large Monitors (around 25–50 particles)
    }
    return Math.max(count, 10);
  }

  // Existing teal/cyan accent colors from the design system
  const colors = [
    'rgba(50, 224, 196, ',   // Accent Cyan (#32E0C4)
    'rgba(0, 173, 181, ',    // Accent Teal (#00adb5)
    'rgba(173, 244, 235, '   // Brightened Ice Cyan (derived from accent gradient)
  ];

  class Particle {
    constructor() {
      this.init(true);
    }

    init(randomizePosition = false) {
      this.x = Math.random() * canvas.width;
      this.y = randomizePosition ? Math.random() * canvas.height : canvas.height + 10;

      const roll = Math.random();
      if (roll < 0.6) {
        // Far Layer (60% - Small, slow)
        this.size = Math.random() * 0.5 + 2.0; // 2.0px to 2.5px
        this.baseSpeed = Math.random() * 0.08 + 0.12; // Visible gentle drift
        this.layer = 1;
        this.glow = 0;
      } else if (roll < 0.9) {
        // Middle Layer (30% - Medium, medium speed)
        this.size = Math.random() * 0.5 + 2.5; // 2.5px to 3.0px
        this.baseSpeed = Math.random() * 0.12 + 0.22;
        this.layer = 2;
        this.glow = 1;
      } else {
        // Close Layer (10% - Large, faster)
        this.size = Math.random() * 0.8 + 3.2; // 3.2px to 4.0px (strictly within 2px–4px)
        this.baseSpeed = Math.random() * 0.18 + 0.38;
        this.layer = 3;
        this.glow = 2;
      }

      // High visibility opacity (55% to 80%) so particles are visible without focusing
      this.baseOpacity = Math.random() * 0.25 + 0.55;
      this.opacity = this.baseOpacity;

      // Floating direction using independent slow angles (produces curving paths)
      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = (Math.random() - 0.5) * 0.012; // Dynamic winding float

      this.driftX = Math.cos(this.angle) * this.baseSpeed;
      this.driftY = Math.sin(this.angle) * this.baseSpeed;

      this.vx = this.driftX;
      this.vy = this.driftY;

      this.colorPrefix = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      // Slow organic angle drift
      this.angle += this.angleSpeed;
      this.driftX = Math.cos(this.angle) * this.baseSpeed;
      this.driftY = Math.sin(this.angle) * this.baseSpeed;

      // Mouse repulsion calculations (subtle push)
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulseRadius = 120; // Subtle mouse radius

        if (dist < repulseRadius && dist > 0) {
          const force = (repulseRadius - dist) / repulseRadius;
          const strength = 0.45; // Gentle ambient repulsion
          const targetVx = this.driftX + (dx / dist) * force * strength;
          const targetVy = this.driftY + (dy / dist) * force * strength;

          // Physics transition (lerp)
          this.vx += (targetVx - this.vx) * 0.08;
          this.vy += (targetVy - this.vy) * 0.08;
        } else {
          // Return to organic float speed
          this.vx += (this.driftX - this.vx) * 0.05;
          this.vy += (this.driftY - this.vy) * 0.05;
        }
      } else {
        // Return to organic float speed
        this.vx += (this.driftX - this.vx) * 0.05;
        this.vy += (this.driftY - this.vy) * 0.05;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Bound check screen wrap
      const margin = 10;
      if (this.x < -margin) this.x = canvas.width + margin;
      if (this.x > canvas.width + margin) this.x = -margin;
      if (this.y < -margin) this.y = canvas.height + margin;
      if (this.y > canvas.height + margin) this.y = -margin;
    }

    draw() {
      // Concentric circles for glowing light layers
      if (this.glow > 0) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * (this.glow === 1 ? 2.6 : 3.6), 0, Math.PI * 2);
        ctx.fillStyle = `${this.colorPrefix}${this.opacity * (this.glow === 1 ? 0.25 : 0.3)})`;
        ctx.fill();
      }

      // Solid inner core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `${this.colorPrefix}${this.opacity})`;
      ctx.fill();
    }
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const count = getParticleCount();
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    if (!isTabActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isTabActive = false;
      cancelAnimationFrame(animationFrameId);
    } else {
      isTabActive = true;
      animate();
    }
  });

  window.addEventListener('resize', resizeCanvas);

  resizeCanvas();
  animate();
}

/* ==========================================================================
   2. CUSTOM CURSOR EXPERIENCE WITH LERP (Linear Interpolation)
   ========================================================================== */
function initCustomCursor() {
  // Performance & layout bypass: disable on fine-pointers or reduced-motion
  if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  document.body.classList.add('custom-cursor-active');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  let dotX = mouseX;
  let dotY = mouseY;
  let ringX = mouseX;
  let ringY = mouseY;

  const dotLerp = 0.35;
  const ringLerp = 0.12;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function updateCursor() {
    dotX += (mouseX - dotX) * dotLerp;
    dotY += (mouseY - dotY) * dotLerp;

    ringX += (mouseX - ringX) * ringLerp;
    ringY += (mouseY - ringY) * ringLerp;

    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(updateCursor);
  }

  requestAnimationFrame(updateCursor);

  window.addEventListener('mousedown', () => {
    ring.classList.add('clicked');
  });

  window.addEventListener('mouseup', () => {
    ring.classList.remove('clicked');
  });

  // Attach hover styles
  function updateHoverListeners() {
    const hoverables = document.querySelectorAll('a, button, .logo-wrapper, .tech-box, .faq-trigger, .exp-header, .btn-case-study, select, input, textarea, [role="button"]');

    hoverables.forEach(item => {
      item.removeEventListener('mouseenter', addCursorHover);
      item.removeEventListener('mouseleave', removeCursorHover);

      item.addEventListener('mouseenter', addCursorHover);
      item.addEventListener('mouseleave', removeCursorHover);
    });
  }

  function addCursorHover() {
    dot.classList.add('hovered');
    ring.classList.add('hovered');
  }

  function removeCursorHover() {
    dot.classList.remove('hovered');
    ring.classList.remove('hovered');
  }

  updateHoverListeners();
  window.refreshCursorListeners = updateHoverListeners;
}

/* ==========================================================================
   3. HEADER SCROLL STATE & TRANSITIONS
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  function checkScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', checkScroll);
  checkScroll();
}

/* ==========================================================================
   4. MOBILE NAVIGATION SIDEBAR OVERLAY
   ========================================================================== */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  function toggleMenu() {
    menuToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  }

  function closeMenu() {
    menuToggle.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  menuToggle.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ==========================================================================
   5. STAGGERED SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollRevealStaggered() {
  const sections = document.querySelectorAll('section');
  if (sections.length === 0) return;

  // Accessibility override
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-item').forEach(el => el.classList.add('revealed'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -5% 0px', // Trigger slightly before crossing fold
    threshold: 0.05
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;

        // Find all revealable children inside this section
        const items = target.querySelectorAll('.reveal-item');

        if (items.length > 0) {
          items.forEach((item, index) => {
            // Dynamically calculate transition delays to create elegant cascades
            item.style.transitionDelay = `${index * 80}ms`;
            item.classList.add('revealed');
          });
        }

        // Also reveal parent container if needed
        if (target.classList.contains('reveal-item')) {
          target.classList.add('revealed');
        }

        observer.unobserve(target);
      }
    });
  }, observerOptions);

  sections.forEach(sec => {
    observer.observe(sec);
  });
}

/* ==========================================================================
   6. MAGNETIC CTA BUTTON HOVER PHYSICS
   ========================================================================== */
function initMagneticButtons() {
  if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const magnetics = document.querySelectorAll('.btn-magnetic');

  magnetics.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const offsetX = e.clientX - centerX;
      const offsetY = e.clientY - centerY;

      const pullFactor = 0.22;

      const moveX = offsetX * pullFactor;
      const moveY = offsetY * pullFactor;

      button.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      button.style.transition = 'none';
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate3d(0, 0, 0)';
      button.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    });
  });
}

/* ==========================================================================
   7. ACCORDION HEIGHT TRANSLATOR (Core, FAQ, Project Details)
   ========================================================================== */
function initAccordions() {
  // Core Expertise Accordion Panels
  const expPanels = document.querySelectorAll('.exp-panel');
  expPanels.forEach(panel => {
    const header = panel.querySelector('.exp-header');
    const content = panel.querySelector('.exp-content');

    if (panel.classList.contains('active') && content) {
      content.style.maxHeight = content.scrollHeight + 'px';
    }

    header.addEventListener('click', () => {
      const isActive = panel.classList.contains('active');

      expPanels.forEach(p => {
        p.classList.remove('active');
        p.querySelector('.exp-header').setAttribute('aria-expanded', 'false');
        const c = p.querySelector('.exp-content');
        if (c) c.style.maxHeight = '0';
      });

      if (!isActive) {
        panel.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // FAQ Accordion triggers
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        const c = i.querySelector('.faq-content');
        if (c) c.style.maxHeight = '0';
      });

      if (!isActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // Project Case Study Dropdowns
  const caseAccs = document.querySelectorAll('.project-accordion');
  caseAccs.forEach(acc => {
    const btn = acc.querySelector('.btn-case-study');
    const content = acc.querySelector('.case-study-content');

    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !isExpanded);
      content.style.maxHeight = isExpanded ? '0' : content.scrollHeight + 'px';
      content.style.opacity = isExpanded ? '0' : '1';
    });
  });
}

/* ==========================================================================
   8. SCROLL-LINKED TIMELINE PROGRESS
   ========================================================================== */
function initTimelineScroll() {
  const container = document.querySelector('.process-timeline-container');
  const fill = document.getElementById('timeline-fill');
  const steps = document.querySelectorAll('.timeline-step');

  if (!container || !fill || steps.length === 0) return;

  function updateTimelineProgress() {
    const containerRect = container.getBoundingClientRect();
    const triggerOffset = window.innerHeight * 0.65;

    const startScroll = containerRect.top - triggerOffset;
    const totalScroll = containerRect.height - 120;

    let progress = 0;
    if (startScroll < 0) {
      progress = Math.min(100, Math.max(0, (-startScroll / totalScroll) * 100));
    }

    fill.style.height = `${progress}%`;

    steps.forEach(step => {
      const stepRect = step.getBoundingClientRect();
      if (stepRect.top < triggerOffset) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateTimelineProgress);
  window.addEventListener('resize', updateTimelineProgress);
  updateTimelineProgress();
}

/* ==========================================================================
   9. CONTACT FORM VALIDATOR
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  const successMsg = document.getElementById('form-status-success');

  if (!form || !successMsg) return;

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
  fields.forEach(field => {
    field.addEventListener('input', () => {
      const group = field.closest('.form-group');
      if (group) group.classList.remove('invalid');
    });

    field.addEventListener('change', () => {
      const group = field.closest('.form-group');
      if (group) group.classList.remove('invalid');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const nameInput = document.getElementById('form-name');
    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    const emailInput = document.getElementById('form-email');
    if (!validateEmail(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    const projectSelect = document.getElementById('form-project');
    if (!projectSelect.value) {
      projectSelect.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    const messageInput = document.getElementById('form-message');
    if (!messageInput.value.trim()) {
      messageInput.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    if (isValid) {
      console.log('Form payload deployed: ', {
        name: nameInput.value,
        email: emailInput.value,
        company: document.getElementById('form-company').value,
        project: projectSelect.value,
        message: messageInput.value
      });

      successMsg.classList.add('success');
      form.reset();

      setTimeout(() => {
        successMsg.classList.remove('success');
      }, 7000);
    }
  });
}

/* ==========================================================================
   10. SCROLL INDICATOR DIMMER
   ========================================================================== */
function initScrollIndicatorDimmer() {
  const indicator = document.querySelector('.scroll-indicator-container');
  if (!indicator) return;

  // Initial transition style assignment
  indicator.style.transition = 'opacity var(--transition-medium) var(--ease-out-expo)';

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      indicator.style.opacity = '0';
      indicator.style.pointerEvents = 'none';
    } else {
      indicator.style.opacity = '1';
      indicator.style.pointerEvents = 'auto';
    }
  });
}

/* ==========================================================================
   11. ACTIVE NAVIGATION TRACKING & HIGHLIGHTS
   ========================================================================== */
function initActiveNavTracker() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  if (sections.length === 0 || navLinks.length === 0) return;

  const trackerOptions = {
    root: null,
    rootMargin: '-20% 0px -40% 0px', // Target focus block center screen
    threshold: 0
  };

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const expectedHref = id === 'home' ? '/' : `/${id}`;

        navLinks.forEach(link => {
          if (link.getAttribute('href') === expectedHref) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, trackerOptions);

  sections.forEach(sec => {
    activeObserver.observe(sec);
  });
}

/* ==========================================================================
   13. STYLED DEVELOPER CONSOLE LOG SIGNATURE
   ========================================================================== */
function initConsoleSignature() {
  console.log(
    "%c[SYS.INIT] %cAI Automation Architect & Systems Builder Core Active.\n%cWelcome, engineer. Thank you for inspecting the console layout.\nFeel free to explore the system blueprints. Keyboard bindings active: press [?] to view shortcuts.",
    "color: #32E0C4; font-weight: bold; font-family: monospace; font-size: 11px;",
    "color: #F5F7F8; font-weight: 500; font-family: monospace; font-size: 11px;",
    "color: rgba(245, 247, 248, 0.65); font-family: monospace; font-size: 10px;"
  );
}

/* ==========================================================================
   14. KEYBOARD SHORTCUTS NAVIGATION ENGINE
   ========================================================================== */
function initKeyboardNavigation() {
  const dialog = document.getElementById('shortcuts-dialog');
  const closeBtn = document.getElementById('close-shortcuts-btn');
  if (!dialog) return;

  let lastKey = '';
  let lastKeyTime = 0;

  window.addEventListener('keydown', (e) => {
    // Prevent shortcut firing inside form inputs
    const activeTagName = document.activeElement ? document.activeElement.tagName : '';
    if (
      activeTagName === 'INPUT' ||
      activeTagName === 'TEXTAREA' ||
      activeTagName === 'SELECT' ||
      (document.activeElement && document.activeElement.getAttribute('contenteditable') === 'true')
    ) {
      return;
    }

    const now = Date.now();
    const key = e.key.toLowerCase();

    // Toggle dialog when '?' is pressed (usually Shift + /)
    if (key === '?') {
      e.preventDefault();
      toggleDialog();
      return;
    }

    // Handle escape to close
    if (key === 'escape' && dialog.hasAttribute('open')) {
      dialog.close();
      return;
    }

    // Sequenced navigation: 'g' then a section key
    if (lastKey === 'g' && (now - lastKeyTime < 1500)) {
      let targetId = '';
      if (key === 'h') targetId = 'home';
      else if (key === 'a') targetId = 'about';
      else if (key === 's') targetId = 'skills';
      else if (key === 'p') targetId = 'projects';
      else if (key === 'v') targetId = 'services';
      else if (key === 'c') targetId = 'contact';

      if (targetId) {
        e.preventDefault();
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
          const targetPath = targetId === 'home' ? '/' : `/${targetId}`;
          history.pushState(null, null, targetPath);

          // Force highlight active nav link
          const navLinks = document.querySelectorAll('.nav-link');
          navLinks.forEach(link => {
            if (link.getAttribute('href') === targetPath) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });

          // Close dialog if open
          if (dialog.hasAttribute('open')) {
            dialog.close();
          }
        }
        lastKey = ''; // Reset
        return;
      }
    }

    lastKey = key;
    lastKeyTime = now;
  });

  function toggleDialog() {
    if (dialog.hasAttribute('open')) {
      dialog.close();
    } else {
      dialog.showModal();
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      dialog.close();
    });
  }

  // Also close by clicking outside content wrapper
  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      dialog.close();
    }
  });
}

/* ==========================================================================
   15. CLIENT-SIDE ROUTER FOR CLEAN ROUTE NAVIGATION
   ========================================================================== */
function initRouter() {
  const routes = {
    '/': 'home',
    '/about': 'about',
    '/skills': 'skills',
    '/services': 'services',
    '/projects': 'projects',
    '/process': 'process',
    '/faq': 'faq',
    '/contact': 'contact'
  };

  // Helper to get element id for a pathname
  function getTargetId(path) {
    let cleanPath = path;
    if (cleanPath !== '/' && cleanPath.endsWith('/')) {
      cleanPath = cleanPath.slice(0, -1);
    }
    return routes[cleanPath] || null;
  }

  // Scroll to section based on pathname
  function handleRouting(path, isInitial = false) {
    const targetId = getTargetId(path);

    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        // Scroll to target element
        if (isInitial) {
          setTimeout(() => {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        } else {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }

        // Update active class on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === path) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
        return true;
      }
    } else if (path !== '/' && path !== '/index.html' && path !== '') {
      // Unknown route - redirect to /404.html to show 404 page
      if (!path.includes('404.html')) {
        window.location.replace('/404.html');
      }
    }
    return false;
  }

  // Intercept click on internal links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');

    if (href === '#main-content') {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth' });
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
      }
      return;
    }

    // Only handle internal routing links (starts with / or has same origin)
    if (href && (href.startsWith('/') || href.startsWith(window.location.origin))) {
      const url = new URL(link.href);
      const path = url.pathname;

      const targetId = getTargetId(path);
      if (targetId) {
        e.preventDefault();

        if (window.location.pathname !== path) {
          history.pushState(null, null, path);
        }

        handleRouting(path);
      }
    }
  });

  // Listen to popstate event (back/forward browser buttons)
  window.addEventListener('popstate', () => {
    handleRouting(window.location.pathname);
  });

  // Handle initial route on page load
  handleRouting(window.location.pathname, true);
}




import { feedbackAPI } from './services/api.js';
import { setupLazyLoading, debounce, throttle, CacheManager } from './performance-optimizations.js';

const reviewCache = new CacheManager(600000); // Cache reviews for 10 minutes

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

function animateCounter(node, endValue, duration = 1200) {
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = easeOutCubic(progress);
    const value = Math.floor(endValue * eased);
    node.textContent = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function initCounters() {
  const nodes = document.querySelectorAll("[data-counter]");
  if (!nodes.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const node = entry.target;
        const endValue = Number(node.getAttribute("data-counter") || "0");
        animateCounter(node, endValue);
        obs.unobserve(node);
      });
    },
    { threshold: 0.45 }
  );

  nodes.forEach((node) => observer.observe(node));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") {
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      const navLinks = document.getElementById("navLinks");
      navLinks?.classList.remove("open");
    });
  });
}

function stars(rating) {
  const value = Math.max(1, Math.min(5, Number(rating || 0)));
  return '★'.repeat(value) + '☆'.repeat(5 - value);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text || '').replace(/[&<>"']/g, (char) => map[char]);
}

async function loadApprovedReviews() {
  const container = document.getElementById('homeTestimonialsRows');
  if (!container) {
    return;
  }

  try {
    // Check cache first
    const cachedReviews = reviewCache.get('approved-reviews');
    if (cachedReviews) {
      renderReviews(container, cachedReviews);
      return;
    }

    const result = await feedbackAPI.getPublic({ limit: 6 });
    const items = result?.feedback || [];

    // Cache the results
    reviewCache.set('approved-reviews', items);
    renderReviews(container, items);
  } catch (error) {
    console.error('Failed to load reviews:', error);
    container.innerHTML = `
      <article class="home-feature-card">
        <h3>Reviews unavailable</h3>
        <p>Unable to load approved reviews right now.</p>
      </article>
    `;
  }
}

function renderReviews(container, items) {
  if (!items.length) {
    container.innerHTML = `
      <article class="home-feature-card">
        <h3>No reviews yet</h3>
        <p>Approved customer reviews will appear here.</p>
      </article>
    `;
    return;
  }

  // Use document fragment for better performance
  const fragment = document.createDocumentFragment();
  
  items.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'home-feature-card enter-item';
    
    const userName = String(item.userName || 'Verified User');
    const comment = String(item.comment || '').trim() || 'No comment provided.';
    const wasteType = String(item.wasteType || 'Waste Pickup');
    const rating = item.rating || 0;
    
    article.innerHTML = `
      <h3>${escapeHtml(userName)}</h3>
      <p style="font-weight: 700; color: #235c28; margin-bottom: 8px;">${stars(rating)} (${rating}/5)</p>
      <p>${escapeHtml(comment)}</p>
      <p style="margin-top: 10px; font-size: 0.86rem; color: #5a6d63;">Service: ${escapeHtml(wasteType)}</p>
    `;
    
    fragment.appendChild(article);
  });
  
  container.innerHTML = '';
  container.appendChild(fragment);
}

window.addEventListener("DOMContentLoaded", () => {
  // Initialize critical features immediately
  initCounters();
  initSmoothScroll();
  
  // Defer non-critical operations
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      setupLazyLoading();
      loadApprovedReviews();
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      setupLazyLoading();
      loadApprovedReviews();
    }, 100);
  }
});

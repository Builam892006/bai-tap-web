/**
 * Optimized Theme Switcher Script
 * Improved performance for theme switching with reduced INP
 */

// Apply initial theme as early as possible without waiting for DOMContentLoaded
(function() {
  const userTheme = localStorage.getItem('userTheme');
  if (userTheme) {
    document.documentElement.setAttribute('data-theme', userTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  // Get necessary elements
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const siteLogo = document.getElementById('site-logo');
  
  // Function to update logo based on theme
  function updateLogo(theme) {
    if (!siteLogo) return;
    
    // Check if current page is in a subfolder
    const isInSubfolder = window.location.pathname.includes('/news/');
    const basePath = isInSubfolder ? '../' : '';
    
    // Use requestAnimationFrame for smoother visual updates
    requestAnimationFrame(() => {
      siteLogo.src = theme === 'dark' ? basePath + 'logodark.png' : basePath + 'logolight.png';
    });
  }
  
  // Function to update icon based on theme
  function updateIcon(theme) {
    if (!themeIcon) return;
    
    // Use requestAnimationFrame for smoother visual updates
    requestAnimationFrame(() => {
      if (theme === 'dark') {
        themeIcon.classList.remove('mdi-weather-night');
        themeIcon.classList.add('mdi-white-balance-sunny');
      } else {
        themeIcon.classList.remove('mdi-white-balance-sunny');
        themeIcon.classList.add('mdi-weather-night');
      }
    });
  }
  
  // Apply theme with performance optimizations
  function applyTheme(theme) {
    // Use requestAnimationFrame to ensure visual updates happen in the next frame
    requestAnimationFrame(() => {
      document.documentElement.setAttribute('data-theme', theme);
      
      // Stagger updates to reduce layout thrashing
      setTimeout(() => updateIcon(theme), 0);
      setTimeout(() => updateLogo(theme), 10);
    });
  }
  
  // Check if user has manually selected a theme
  const userTheme = localStorage.getItem('userTheme');
  if (userTheme) {
    applyTheme(userTheme);
  } else {
    // If no manual selection, use browser preference
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
    
    // Listen for changes in browser preference
    prefersDarkScheme.addEventListener('change', e => {
      // Only apply if user hasn't manually selected a theme
      if (!localStorage.getItem('userTheme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  // Handle theme toggle button click
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Debounce to prevent multiple rapid clicks
      if (themeToggle.dataset.switching === 'true') return;
      
      themeToggle.dataset.switching = 'true';
      
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      // Save user preference
      localStorage.setItem('userTheme', newTheme);
      
      // Apply theme changes
      applyTheme(newTheme);
      
      // Reset debounce after transition completes
      setTimeout(() => {
        themeToggle.dataset.switching = 'false';
      }, 350); // Slightly longer than transition duration
    });
  }
});
/**
 * Theme Switcher Script
 * Tự động chuyển đổi giữa light mode và dark mode dựa trên thiết lập của trình duyệt
 * Tự động thay đổi logo dựa trên chế độ sáng/tối
 */

document.addEventListener('DOMContentLoaded', function() {
  // Lấy các phần tử cần thiết
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const siteLogo = document.getElementById('site-logo');
  
  // Hàm để thay đổi logo dựa trên theme
  function updateLogo(theme) {
    if (siteLogo) {
      // Kiểm tra xem trang hiện tại có nằm trong thư mục con không
      const isInSubfolder = window.location.pathname.includes('/news/');
      // Đặt đường dẫn tương ứng
      const basePath = isInSubfolder ? '../' : '';
      siteLogo.src = theme === 'dark' ? basePath + 'logodark.png' : basePath + 'logolight.png';
    }
  }
  
  // Hàm để áp dụng theme
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      themeIcon.classList.remove('mdi-weather-night');
      themeIcon.classList.add('mdi-white-balance-sunny');
    } else {
      themeIcon.classList.remove('mdi-white-balance-sunny');
      themeIcon.classList.add('mdi-weather-night');
    }
    updateLogo(theme);
  }
  
  // Kiểm tra nếu người dùng đã chọn theme thủ công
  const userTheme = localStorage.getItem('userTheme');
  if (userTheme) {
    applyTheme(userTheme);
  } else {
    // Nếu không có lựa chọn thủ công, sử dụng thiết lập của trình duyệt
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    if (prefersDarkScheme.matches) {
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
    
    // Lắng nghe sự thay đổi trong thiết lập của trình duyệt
    prefersDarkScheme.addEventListener('change', e => {
      // Chỉ áp dụng nếu người dùng chưa chọn theme thủ công
      if (!localStorage.getItem('userTheme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  // Xử lý sự kiện click vào nút chuyển đổi chế độ
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      applyTheme(newTheme);
      // Lưu lựa chọn của người dùng
      localStorage.setItem('userTheme', newTheme);
    });
  }
});

// Thiết lập theme ban đầu trước khi trang tải xong
(function() {
  const userTheme = localStorage.getItem('userTheme');
  if (userTheme) {
    document.documentElement.setAttribute('data-theme', userTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
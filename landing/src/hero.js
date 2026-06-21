document.addEventListener('DOMContentLoaded', () => {
  const bg = document.getElementById('hero-bg');
  if (!bg) return;
  const img = new Image();
  img.onload = () => {
    bg.style.backgroundImage = "url('https://barbe.vercel.app/images/banner.jpg')";
    bg.classList.add('loaded');
  };
  img.src = 'https://barbe.vercel.app/images/banner.jpg';
});

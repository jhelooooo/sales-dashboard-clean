function applyTheme(theme){
  document.body.classList.toggle('light-theme', theme === 'light');

  const toggle=document.getElementById('themeToggle');
  if(toggle){
    toggle.textContent=theme === 'light' ? 'Light' : 'Dark';
  }
}

function initTheme(){
  const savedTheme=localStorage.getItem('dashboardTheme') || 'dark';
  applyTheme(savedTheme);

  const toggle=document.getElementById('themeToggle');
  if(!toggle)return;

  toggle.addEventListener('click',()=>{
    const nextTheme=document.body.classList.contains('light-theme') ? 'dark' : 'light';
    localStorage.setItem('dashboardTheme',nextTheme);
    applyTheme(nextTheme);
  });
}

document.addEventListener('DOMContentLoaded',initTheme);

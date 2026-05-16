function applyTheme(theme){
  document.body.classList.toggle('light-theme', theme === 'light');

  const toggle=document.getElementById('themeToggle');
  if(toggle){
    toggle.textContent=theme === 'light' ? 'Light' : 'Dark';
  }
}

function refreshThemeCharts(){
  setTimeout(()=>{
    if(typeof renderActualTargetChart === 'function'){
      renderActualTargetChart();
    }
  },80);
}

function initTheme(){
  const savedTheme=localStorage.getItem('dashboardTheme') || 'dark';
  applyTheme(savedTheme);
  refreshThemeCharts();

  const toggle=document.getElementById('themeToggle');
  if(!toggle)return;

  toggle.addEventListener('click',()=>{
    const nextTheme=document.body.classList.contains('light-theme') ? 'dark' : 'light';
    localStorage.setItem('dashboardTheme',nextTheme);
    applyTheme(nextTheme);
    refreshThemeCharts();
  });
}

document.addEventListener('DOMContentLoaded',initTheme);

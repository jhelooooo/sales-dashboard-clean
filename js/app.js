function initTabs(){
  const buttons=document.querySelectorAll('.nav-btn');
  const tabs=document.querySelectorAll('.tab-panel');

  buttons.forEach(button=>{
    button.addEventListener('click',()=>{
      const target=button.dataset.tab;

      buttons.forEach(btn=>btn.classList.remove('active'));
      button.classList.add('active');

      tabs.forEach(tab=>{
        tab.classList.toggle('active',tab.id === target);
      });

      closeSidebar();
    });
  });
}

function initMobileSidebar(){
  const burger=document.getElementById('burgerBtn');
  const sidebar=document.getElementById('sidebar');
  const overlay=document.getElementById('overlay');

  if(!burger || !sidebar || !overlay)return;

  burger.addEventListener('click',()=>{
    sidebar.classList.add('open');
    overlay.classList.add('show');
  });

  overlay.addEventListener('click',closeSidebar);
}

function closeSidebar(){
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('show');
}

function hideLoader(){
  const loader=document.getElementById('loading');
  if(loader){
    loader.style.display='none';
  }
}

window.addEventListener('load',()=>{
  initTabs();
  initMobileSidebar();

  setTimeout(hideLoader,700);
});

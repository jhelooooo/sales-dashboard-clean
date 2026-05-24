async function init(){

  const user =
    await getCurrentUser();

  if(!user){

    renderLogin();

    return;

  }

  appState.user = user;

  appState.profile =
    await loadProfile(user.id);

  appState.sales =
    await loadSales();

  renderDashboard();

}

init();

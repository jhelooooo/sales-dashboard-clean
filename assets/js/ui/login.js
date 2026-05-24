function renderLogin(){

  document.getElementById('app').innerHTML = `
    <div class="auth-wrap">

      <div class="auth-card">

        <h1>Sales Dashboard</h1>

        <p>Login to continue</p>

        <form id="loginForm" class="auth-form">

          <input
            type="email"
            id="email"
            placeholder="Email"
            required
          >

          <input
            type="password"
            id="password"
            placeholder="Password"
            required
          >

          <button type="submit">
            Login
          </button>

          <div id="loginError"></div>

        </form>

      </div>

    </div>
  `;

  document
    .getElementById('loginForm')
    .addEventListener(
      'submit',
      loginUser
    );

}

async function loginUser(event){

  event.preventDefault();

  const email =
    document.getElementById('email').value;

  const password =
    document.getElementById('password').value;

  const result =
    await supabaseClient.auth
      .signInWithPassword({
        email,
        password
      });

  if(result.error){

    document.getElementById(
      'loginError'
    ).textContent =
      result.error.message;

    return;

  }

  location.reload();

}

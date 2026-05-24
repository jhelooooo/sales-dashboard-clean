async function getCurrentUser(){

  const result =
    await supabaseClient.auth.getUser();

  return result.data.user || null;

}

async function signOutUser(){

  await supabaseClient.auth.signOut();

  location.reload();

}

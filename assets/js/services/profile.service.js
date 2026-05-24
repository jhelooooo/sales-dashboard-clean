async function loadProfile(userId){

  const result =
    await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

  return result.data;

}

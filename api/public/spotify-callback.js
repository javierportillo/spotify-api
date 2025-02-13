async function handleSpotifyCallback() {
  const params = new URLSearchParams(window.location.search);
  const accessToken = params.get("access_token");

  if (!accessToken) {
    document.getElementById("response").innerText =
      "Error: No access token found in URL.";
    return;
  }

  try {
    const response = await fetch(
      `/api/auth/spotify/callback?access_token=${accessToken}`,
    );
    const data = await response.json();
    document.getElementById("response").innerText = JSON.stringify(
      data,
      null,
      2,
    );
  } catch (error) {
    document.getElementById("response").innerText = `Error: ${error.message}`;
  }
}

window.onload = handleSpotifyCallback;

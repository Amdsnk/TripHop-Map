/**
 * Spotify PKCE OAuth + Web API integration
 * Uses Authorization Code with PKCE flow — no backend required.
 * Client ID and Redirect URI come from Vite env vars.
 */

const SCOPES = 'playlist-modify-public playlist-modify-private';
const STATE_KEY = 'spotify_auth_state';
const VERIFIER_KEY = 'spotify_code_verifier';

function generateRandom(length = 64): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, b => chars[b % chars.length]).join('');
}

async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  return crypto.subtle.digest('SHA-256', encoder.encode(plain));
}

function base64url(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export async function startSpotifyAuth(): Promise<void> {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string;
  if (!clientId) throw new Error('VITE_SPOTIFY_CLIENT_ID not set');

  const verifier = generateRandom(64);
  const challenge = base64url(await sha256(verifier));
  const state = generateRandom(16);

  sessionStorage.setItem(VERIFIER_KEY, verifier);
  sessionStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri ?? window.location.origin,
    scope: SCOPES,
    state,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  });
  window.location.href = `https://accounts.spotify.com/authorize?${params}`;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
  const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string;
  if (!clientId) throw new Error('VITE_SPOTIFY_CLIENT_ID not set');
  const verifier = sessionStorage.getItem(VERIFIER_KEY);
  if (!verifier) throw new Error('Missing code verifier — restart auth flow');

  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri ?? window.location.origin,
      client_id: clientId,
      code_verifier: verifier,
    }),
  });
  if (!resp.ok) throw new Error(`Token exchange failed: ${resp.status}`);
  const data = await resp.json();
  sessionStorage.removeItem(VERIFIER_KEY);
  sessionStorage.removeItem(STATE_KEY);
  return data.access_token as string;
}

interface SpotifyTrack {
  title: string;
  artist: string;
}

async function searchTrack(token: string, title: string, artist: string): Promise<string | null> {
  const q = encodeURIComponent(`track:${title} artist:${artist}`);
  const resp = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  return (data.tracks?.items?.[0]?.uri as string) ?? null;
}

async function getSpotifyUserId(token: string): Promise<string> {
  const resp = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) throw new Error('Could not get Spotify user');
  const data = await resp.json();
  return data.id as string;
}

async function createPlaylist(token: string, userId: string, name: string): Promise<string> {
  const resp = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      description: 'Exported from Trip-Hop Archive Map',
      public: false,
    }),
  });
  if (!resp.ok) throw new Error('Could not create playlist');
  const data = await resp.json();
  return data.id as string;
}

async function addTracksToPlaylist(token: string, playlistId: string, uris: string[]): Promise<void> {
  // Spotify API accepts max 100 per request
  for (let i = 0; i < uris.length; i += 100) {
    const chunk = uris.slice(i, i + 100);
    await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ uris: chunk }),
    });
  }
}

export async function exportPlaylistToSpotify(
  token: string,
  tracks: SpotifyTrack[],
  playlistName = 'Trip-Hop Archive',
  onProgress?: (done: number, total: number) => void,
): Promise<{ playlistUrl: string; added: number; skipped: number }> {
  const userId = await getSpotifyUserId(token);
  const playlistId = await createPlaylist(token, userId, playlistName);

  const uris: string[] = [];
  let skipped = 0;
  for (let i = 0; i < tracks.length; i++) {
    const { title, artist } = tracks[i];
    const uri = await searchTrack(token, title, artist);
    if (uri) uris.push(uri);
    else skipped++;
    onProgress?.(i + 1, tracks.length);
  }

  if (uris.length > 0) await addTracksToPlaylist(token, playlistId, uris);

  return {
    playlistUrl: `https://open.spotify.com/playlist/${playlistId}`,
    added: uris.length,
    skipped,
  };
}

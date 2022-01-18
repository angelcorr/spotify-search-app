import { useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';

import './style.css';

const clientId = '13d71b825e984f53be2c87c7af2c2228';
const redirectUri = `${window.location.origin}${window.location.pathname}`;

const Authorization = ({ token, setToken }) => {
  useEffect(() => {
    const query = window.location.search;

    const params = new URLSearchParams(query);
    const code = params.get('code');
    if (!code) return;

    const requestToken = async () => {
      const body = new URLSearchParams();
      body.append('grant_type', 'authorization_code');
      body.append('code', code);
      body.append('redirect_uri', redirectUri);
      body.append('client_id', clientId);
      body.append('code_verifier', localStorage.getItem('codeVerifier'));
      const { data } = await axios.post('https://accounts.spotify.com/api/token', body);
      setToken(data.access_token);
    };

    requestToken().catch(console.error);
  }, [setToken]);

  if (token) return null;

  const handleAuthorize = async () => {
    const params = new URLSearchParams();
    const codeVerifier = Math.random().toFixed(50);
    const codeChallenge = CryptoJS.SHA256(codeVerifier).toString(CryptoJS.enc.Base64url);

    localStorage.setItem('codeVerifier', codeVerifier);

    params.append('response_type', 'code');
    params.append('client_id', clientId);
    params.append('redirect_uri', redirectUri);
    params.append('code_challenge_method', 'S256');
    params.append('code_challenge', codeChallenge);
    window.location = 'https://accounts.spotify.com/authorize?' + params.toString();
  };

  return (
    <div className="Authorization">
      <button onClick={handleAuthorize}>
        Log in with Spotify
      </button>
    </div>
  );
};

export default Authorization;

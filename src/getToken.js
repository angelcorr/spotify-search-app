let token;

const getToken = () => {
  if (token) return token;

  const enteredToken = prompt('Please enter your Spotify token');
  token = enteredToken;
  return token;
};

export default getToken;
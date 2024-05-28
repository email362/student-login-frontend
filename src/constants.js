const PORT = 5100;
const prodURL = 'https://student-login-app-9wnk.onrender.com';
const devURL = `http://localhost:${PORT}`;
export const URL = import.meta.env.MODE == 'development' ? devURL : prodURL;

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api' 
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);



export async function postChatMessage(message, history = []) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, history }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("postChatMessage error:", err);
    throw err;
  }
}

export default {
  postChatMessage,
  api
};



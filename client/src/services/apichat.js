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
};

import db from "../config/db.js";

// Create a new conversation for authenticated user
export const createConversation = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { title, system_prompt } = req.body;
    const q = `INSERT INTO conversations (title, system_prompt, user_id) VALUES ($1, $2, $3) RETURNING *`;
    const params = [title || "New Conversation", system_prompt || null, userId];
    const result = await db.query(q, params);
    res.status(201).json({ conversation: result.rows[0] });
  } catch (err) {
    console.error("Error creating conversation:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// List conversations for current user
export const listConversations = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const q = `SELECT id, title, created_at, updated_at FROM conversations WHERE user_id = $1 ORDER BY updated_at DESC`;
    const result = await db.query(q, [userId]);
    res.json({ conversations: result.rows });
  } catch (err) {
    console.error("Error listing conversations:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create message in a conversation
export const createMessage = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { conversationId } = req.params;
    const { sender, content, gemini_history_json } = req.body;
    // verify conversation belongs to user
    const cRes = await db.query(
      "SELECT * FROM conversations WHERE id = $1 AND user_id = $2",
      [conversationId, userId]
    );
    if (!cRes.rows[0])
      return res.status(404).json({ message: "Conversation not found" });

    const q = `INSERT INTO messages (conversation_id, sender, content, gemini_history_json) VALUES ($1, $2, $3, $4) RETURNING *`;
    const params = [
      conversationId,
      sender,
      content,
      gemini_history_json ? JSON.stringify(gemini_history_json) : null,
    ];
    const mRes = await db.query(q, params);

    // update conversation updated_at
    await db.query(
      "UPDATE conversations SET updated_at = NOW() WHERE id = $1",
      [conversationId]
    );

    res.status(201).json({ message: mRes.rows[0] });
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// List messages for a conversation
export const listMessages = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { conversationId } = req.params;
    // verify conversation belongs to user
    const cRes = await db.query(
      "SELECT * FROM conversations WHERE id = $1 AND user_id = $2",
      [conversationId, userId]
    );
    if (!cRes.rows[0])
      return res.status(404).json({ message: "Conversation not found" });

    const q = `SELECT id, sender, content, gemini_history_json, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC`;
    const result = await db.query(q, [conversationId]);
    res.json({ messages: result.rows });
  } catch (err) {
    console.error("Error listing messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};

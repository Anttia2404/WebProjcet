import api from "./api";

export const createConversation = (data) => api.post("/conversations", data);
export const listConversations = () => api.get("/conversations");
export const listMessages = (conversationId) =>
  api.get(`/conversations/${conversationId}/messages`);
export const createMessage = (conversationId, payload) =>
  api.post(`/conversations/${conversationId}/messages`, payload);

export default {
  createConversation,
  listConversations,
  listMessages,
  createMessage,
};

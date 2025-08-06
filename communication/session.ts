const sessions = new Map();

const session = {
  get: (userId) => sessions.get(userId),
  set: (userId, sessionId) => {
    sessions.set(userId, sessionId);
    return sessionId;
  },
  delete: (userId) => {
    return sessions.delete(userId);
  },
};

export default session;

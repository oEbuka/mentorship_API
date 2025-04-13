const { v4: uuidv4 } = require('uuid');

const sessions = [];

class Session {
  constructor() {
    this.sessions = sessions;
  }

  findAll() {
    return this.sessions;
  }

  findById(id) {
    return this.sessions.find((session) => session.id === id);
  }

  findByUserId(userId) {
    return this.sessions.filter(
      (session) => session.userId === userId || session.mentorId === userId,
    );
  }

  create(sessionData) {
    const newSession = {
      id: uuidv4(),
      userId: sessionData.userId,
      mentorId: sessionData.mentorId,
      title: sessionData.title,
      description: sessionData.description,
      status: 'pending', // pending, accepted, declined, completed
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.sessions.push(newSession);
    return newSession;
  }

  updateStatus(id, status) {
    const sessionIndex = this.sessions.findIndex((session) => session.id === id);
    
    if (sessionIndex === -1) return null;
    
    this.sessions[sessionIndex].status = status;
    this.sessions[sessionIndex].updatedAt = new Date();
    
    return this.sessions[sessionIndex];
  }
}

module.exports = new Session();
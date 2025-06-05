const { v4: uuidv4 } = require('uuid');
const BaseModel = require('./baseModel');

class Session extends BaseModel {
  constructor() {
    super('sessions.json');
  }

  findByUserId(userId) {
    return this.data.filter((session) => session.userId === userId);
  }

  findByMentorId(mentorId) {
    return this.data.filter((session) => session.mentorId === mentorId);
  }

  create(sessionData) {
    const newSession = {
      id: uuidv4(),
      userId: sessionData.userId,
      mentorId: sessionData.mentorId,
      title: sessionData.title,
      description: sessionData.description || '',
      scheduledDate: sessionData.scheduledDate,
      duration: sessionData.duration || 60, // default duration 60 minutes
      status: 'pending', // default status is pending
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.data.push(newSession);
    this.saveData(); // save to file after adding a new session
    
    return newSession;
  }

  update(sessionId, updates) {
    const sessionIndex = this.data.findIndex((session) => session.id === sessionId);
    
    if (sessionIndex === -1) return null;
    
    this.data[sessionIndex] = {
      ...this.data[sessionIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.saveData(); 
    
    return this.data[sessionIndex];
  }

  delete(sessionId) {
    const sessionIndex = this.data.findIndex((session) => session.id === sessionId);
    
    if (sessionIndex === -1) return false;
    
    this.data.splice(sessionIndex, 1);
    this.saveData(); 
    
    return true;
  }

  // update session status (approve, reject, complete, cancel)
  updateStatus(sessionId, status) {
    const validStatuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid session status');
    }
    
    return this.update(sessionId, { status });
  }

  // get upcoming sessions for a mentor
  getUpcomingSessionsForMentor(mentorId) {
    const now = new Date();
    return this.data.filter((session) => 
      session.mentorId === mentorId && 
      session.status === 'approved' && 
      new Date(session.scheduledDate) > now
    );
  }

  // Get past sessions for a user
  getPastSessionsForUser(userId) {
    const now = new Date();
    return this.data.filter((session) => 
      session.userId === userId && 
      (session.status === 'completed' || 
       (session.status === 'approved' && new Date(session.scheduledDate) < now))
    );
  }
}

module.exports = new Session();
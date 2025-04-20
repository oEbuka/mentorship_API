const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'sessions.json');

class Session {
  constructor() {
    this.sessions = [];
    this.initializeDataStore();
  }

  initializeDataStore() {
    try {
      const dataDir = path.dirname(dataFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        this.sessions = JSON.parse(data);
        console.log('Session data loaded from file');
      } else {
        this.saveData();
        console.log('New sessions data file created');
      }
    } catch (error) {
      console.error('Error initializing session data store:', error);
    }
  }

  saveData() {
    try {
      const dataDir = path.dirname(dataFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(dataFilePath, JSON.stringify(this.sessions, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving session data:', error);
      return false;
    }
  }

  findAll() {
    return this.sessions;
  }

  findById(id) {
    return this.sessions.find((session) => session.id === id);
  }

  findByUserId(userId) {
    return this.sessions.filter((session) => session.userId === userId);
  }

  findByMentorId(mentorId) {
    return this.sessions.filter((session) => session.mentorId === mentorId);
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

    this.sessions.push(newSession);
    this.saveData(); // save to file after adding a new session
    
    return newSession;
  }

  update(sessionId, updates) {
    const sessionIndex = this.sessions.findIndex((session) => session.id === sessionId);
    
    if (sessionIndex === -1) return null;
    
    this.sessions[sessionIndex] = {
      ...this.sessions[sessionIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.saveData(); 
    
    return this.sessions[sessionIndex];
  }

  delete(sessionId) {
    const sessionIndex = this.sessions.findIndex((session) => session.id === sessionId);
    
    if (sessionIndex === -1) return false;
    
    this.sessions.splice(sessionIndex, 1);
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
    return this.sessions.filter((session) => 
      session.mentorId === mentorId && 
      session.status === 'approved' && 
      new Date(session.scheduledDate) > now
    );
  }

  // Get past sessions for a user
  getPastSessionsForUser(userId) {
    const now = new Date();
    return this.sessions.filter((session) => 
      session.userId === userId && 
      (session.status === 'completed' || 
       (session.status === 'approved' && new Date(session.scheduledDate) < now))
    );
  }
}

module.exports = new Session();
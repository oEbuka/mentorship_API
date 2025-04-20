const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// path to our data file
const dataFilePath = path.join(__dirname, '..', 'data', 'users.json');

class User {
  constructor() {
    this.users = [];
    this.initializeDataStore();
  }

  // Initialize data store 
  initializeDataStore() {
    try {
      // ensure the data directory exists
      const dataDir = path.dirname(dataFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // try to read existing data
      if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        this.users = JSON.parse(data);
        console.log('User data loaded from file');
      } else {
        // create empty file if it doesn't exist
        this.saveData();
        console.log('New users data file created');
      }
    } catch (error) {
      console.error('Error initializing data store:', error);
    }
  }

  // save data to file
  saveData() {
    try {
      const dataDir = path.dirname(dataFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(dataFilePath, JSON.stringify(this.users, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  findAll() {
    return this.users;
  }

  findById(id) {
    return this.users.find((user) => user.id === id);
  }

  findByEmail(email) {
    return this.users.find((user) => user.email === email);
  }

  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      id: uuidv4(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: hashedPassword,
      role: userData.role || 'user',
      isMentor: false,
      bio: userData.bio || '',
      skills: userData.skills || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    this.saveData(); // save to file after adding a new user
    
    // return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  updateToMentor(userId) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    
    if (userIndex === -1) return null;
    
    this.users[userIndex].isMentor = true;
    this.users[userIndex].updatedAt = new Date();
    
    this.saveData(); // save to file after updating
    
    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  promoteToAdmin(userId) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    
    if (userIndex === -1) return null;
    
    this.users[userIndex].role = 'admin';
    this.users[userIndex].updatedAt = new Date();
    
    this.saveData(); // save to file after updating
    
    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  isAdmin(userId) {
    const user = this.findById(userId);
    return user && user.role === 'admin';
  }

  getAllAdmins() {
    return this.users
      .filter((user) => user.role === 'admin')
      .map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }

  getAllMentors() {
    return this.users
      .filter((user) => user.isMentor)
      .map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }

  getMentorById(id) {
    const mentor = this.users.find((user) => user.id === id && user.isMentor);
    if (!mentor) return null;
    
    const { password, ...mentorWithoutPassword } = mentor;
    return mentorWithoutPassword;
  }

  // additional method for updating a user
  updateUser(userId, updates) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    
    if (userIndex === -1) return null;
    
    // update the user properties
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    // if password is being updated, hash it first
    if (updates.password) {
      this.users[userIndex].password = bcrypt.hashSync(updates.password, 10);
    }
    
    this.saveData(); // save to file after updating
    
    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
  }

  deleteUser(userId) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    
    if (userIndex === -1) return false;
    
    this.users.splice(userIndex, 1);
    this.saveData();
    
    return true;
  }
}

module.exports = new User();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const BaseModel = require('./baseModel');

class User extends BaseModel {
  constructor() {
    super('users.json');
  }

  findByEmail(email) {
    return this.data.find((user) => user.email === email);
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

    this.data.push(newUser);
    this.saveData(); // save to file after adding a new user
    
    // return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  updateToMentor(userId) {
    const userIndex = this.data.findIndex((user) => user.id === userId);
    
    if (userIndex === -1) return null;
    
    this.data[userIndex].isMentor = true;
    this.data[userIndex].updatedAt = new Date();
    
    this.saveData(); // save to file after updating
    
    const { password, ...userWithoutPassword } = this.data[userIndex];
    return userWithoutPassword;
  }

  promoteToAdmin(userId) {
    const userIndex = this.data.findIndex((user) => user.id === userId);
    
    if (userIndex === -1) return null;
    
    this.data[userIndex].role = 'admin';
    this.data[userIndex].updatedAt = new Date();
    
    this.saveData(); // save to file after updating
    
    const { password, ...userWithoutPassword } = this.data[userIndex];
    return userWithoutPassword;
  }

  isAdmin(userId) {
    const user = this.findById(userId);
    return user && user.role === 'admin';
  }

  getAllAdmins() {
    return this.data
      .filter((user) => user.role === 'admin')
      .map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }

  getAllMentors() {
    return this.data
      .filter((user) => user.isMentor)
      .map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  }

  getMentorById(id) {
    const mentor = this.data.find((user) => user.id === id && user.isMentor);
    if (!mentor) return null;
    
    const { password, ...mentorWithoutPassword } = mentor;
    return mentorWithoutPassword;
  }

  // additional method for updating a user
  updateUser(userId, updates) {
    const userIndex = this.data.findIndex((user) => user.id === userId);
    
    if (userIndex === -1) return null;
    
    // update the user properties
    this.data[userIndex] = {
      ...this.data[userIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    // if password is being updated, hash it first
    if (updates.password) {
      this.data[userIndex].password = bcrypt.hashSync(updates.password, 10);
    }
    
    this.saveData(); // save to file after updating
    
    const { password, ...userWithoutPassword } = this.data[userIndex];
    return userWithoutPassword;
  }

  deleteUser(userId) {
    const userIndex = this.data.findIndex((user) => user.id === userId);
    
    if (userIndex === -1) return false;
    
    this.data.splice(userIndex, 1);
    this.saveData();
    
    return true;
  }
}

module.exports = new User();
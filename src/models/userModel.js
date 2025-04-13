const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const users = [];

class User {
  constructor() {
    this.users = users;
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
      role: userData.role || 'user', // default role is 'user'
      isMentor: false,
      bio: userData.bio || '',
      skills: userData.skills || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(newUser);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  updateToMentor(userId) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    
    if (userIndex === -1) return null;
    
    this.users[userIndex].isMentor = true;
    this.users[userIndex].updatedAt = new Date();
    
    const { password, ...userWithoutPassword } = this.users[userIndex];
    return userWithoutPassword;
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
}

module.exports = new User();
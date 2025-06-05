const fs = require('fs');
const path = require('path');

class BaseModel {
  constructor(fileName) {
    this.data = [];
    this.dataFilePath = path.join(__dirname, '..', 'data', fileName);
    this.initializeDataStore();
  }

  initializeDataStore() {
    try {
      // Ensure the data directory exists
      const dataDir = path.dirname(this.dataFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Try to read existing data
      if (fs.existsSync(this.dataFilePath)) {
        const fileData = fs.readFileSync(this.dataFilePath, 'utf8');
        this.data = JSON.parse(fileData);
      } else {
        // Create empty file if it doesn't exist
        this.saveData();
      }
    } catch (error) {
      console.error(`Error initializing data store: ${error.message}`);
    }
  }

  saveData() {
    try {
      fs.writeFileSync(this.dataFilePath, JSON.stringify(this.data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error saving data: ${error.message}`);
      return false;
    }
  }

  findAll() {
    return this.data;
  }

  findById(id) {
    return this.data.find(item => item.id === id);
  }
}

module.exports = BaseModel;
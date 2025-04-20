const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'reviews.json');

class Review {
  constructor() {
    this.reviews = [];
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
        this.reviews = JSON.parse(data);
        console.log('Review data loaded from file');
      } else {
        this.saveData();
        console.log('New reviews data file created');
      }
    } catch (error) {
      console.error('Error initializing review data store:', error);
    }
  }

  saveData() {
    try {
      const dataDir = path.dirname(dataFilePath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(dataFilePath, JSON.stringify(this.reviews, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving review data:', error);
      return false;
    }
  }

  findAll() {
    return this.reviews;
  }

  findById(id) {
    return this.reviews.find((review) => review.id === id);
  }

  findByMentorId(mentorId) {
    return this.reviews.filter((review) => review.mentorId === mentorId);
  }

  create(reviewData) {
    const newReview = {
      id: uuidv4(),
      userId: reviewData.userId,
      mentorId: reviewData.mentorId,
      rating: reviewData.rating,
      comment: reviewData.comment || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reviews.push(newReview);
    this.saveData(); // Save to file after adding a new review
    
    return newReview;
  }

  update(reviewId, updates) {
    const reviewIndex = this.reviews.findIndex((review) => review.id === reviewId);
    
    if (reviewIndex === -1) return null;
    
    this.reviews[reviewIndex] = {
      ...this.reviews[reviewIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    this.saveData(); // Save to file after updating
    
    return this.reviews[reviewIndex];
  }

  delete(reviewId) {
    const reviewIndex = this.reviews.findIndex((review) => review.id === reviewId);
    
    if (reviewIndex === -1) return false;
    
    this.reviews.splice(reviewIndex, 1);
    this.saveData(); // Save to file after deleting
    
    return true;
  }

  getAverageRatingForMentor(mentorId) {
    const mentorReviews = this.findByMentorId(mentorId);
    
    if (mentorReviews.length === 0) return 0;
    
    const totalRating = mentorReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / mentorReviews.length;
  }
}

module.exports = new Review();
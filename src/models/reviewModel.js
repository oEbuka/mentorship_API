const { v4: uuidv4 } = require('uuid');

const reviews = [];

class Review {
  constructor() {
    this.reviews = reviews;
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
      sessionId: reviewData.sessionId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.reviews.push(newReview);
    return newReview;
  }

  delete(id) {
    const reviewIndex = this.reviews.findIndex((review) => review.id === id);
    
    if (reviewIndex === -1) return false;
    
    this.reviews.splice(reviewIndex, 1);
    return true;
  }
}

module.exports = new Review();
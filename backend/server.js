const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// In-memory data store for reviews
let reviews = [
  {
    id: 1,
    guestName: 'John Smith',
    rating: 5,
    text: 'Amazing stay! The host was incredibly friendly and the location was perfect.',
    sentiment: 'positive',
    themes: ['host', 'location'],
    date: '2024-01-15',
    response: null
  },
  {
    id: 2,
    guestName: 'Sarah Johnson',
    rating: 4,
    text: 'Great experience overall. The place was clean but the WiFi was a bit slow.',
    sentiment: 'positive',
    themes: ['cleanliness', 'value'],
    date: '2024-01-20',
    response: null
  },
  {
    id: 3,
    guestName: 'Mike Wilson',
    rating: 2,
    text: 'Disappointed with the cleanliness. Found dust in corners and bathroom needed attention.',
    sentiment: 'negative',
    themes: ['cleanliness'],
    date: '2024-02-01',
    response: null
  },
  {
    id: 4,
    guestName: 'Emily Davis',
    rating: 5,
    text: 'The food recommendations from the host were excellent! Best local dining experience.',
    sentiment: 'positive',
    themes: ['food', 'host'],
    date: '2024-02-10',
    response: null
  },
  {
    id: 5,
    guestName: 'Robert Brown',
    rating: 3,
    text: 'Average stay. Nothing special but nothing terrible either.',
    sentiment: 'neutral',
    themes: ['value'],
    date: '2024-02-15',
    response: null
  }
];

let nextId = 6;

// Validation helper
function validateReview(review) {
  const errors = [];
  
  if (!review.guestName || review.guestName.trim().length === 0) {
    errors.push('Guest name is required');
  }
  
  if (!review.text || review.text.trim().length === 0) {
    errors.push('Review text is required');
  }
  
  if (review.rating === undefined || review.rating < 1 || review.rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }
  
  return errors;
}

// Routes

// GET /api/reviews - List all reviews
app.get('/api/reviews', (req, res) => {
  try {
    const { sentiment, theme, minRating, maxRating } = req.query;
    
    let filteredReviews = [...reviews];
    
    if (sentiment) {
      filteredReviews = filteredReviews.filter(r => 
        r.sentiment.toLowerCase() === sentiment.toLowerCase()
      );
    }
    
    if (theme) {
      filteredReviews = filteredReviews.filter(r => 
        r.themes.includes(theme.toLowerCase())
      );
    }
    
    if (minRating) {
      filteredReviews = filteredReviews.filter(r => r.rating >= parseInt(minRating));
    }
    
    if (maxRating) {
      filteredReviews = filteredReviews.filter(r => r.rating <= parseInt(maxRating));
    }
    
    res.status(200).json({
      success: true,
      count: filteredReviews.length,
      data: filteredReviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching reviews'
    });
  }
});

// GET /api/reviews/stats - Get review statistics
app.get('/api/reviews/stats', (req, res) => {
  try {
    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    
    const sentimentCounts = {
      positive: reviews.filter(r => r.sentiment === 'positive').length,
      neutral: reviews.filter(r => r.sentiment === 'neutral').length,
      negative: reviews.filter(r => r.sentiment === 'negative').length
    };
    
    const themeCounts = {};
    reviews.forEach(review => {
      review.themes.forEach(theme => {
        themeCounts[theme] = (themeCounts[theme] || 0) + 1;
      });
    });
    
    res.status(200).json({
      success: true,
      data: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        sentimentCounts,
        themeCounts
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching statistics'
    });
  }
});

// GET /api/reviews/search - Search reviews
app.get('/api/reviews/search', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query parameter "q" is required'
      });
    }
    
    const searchTerm = q.toLowerCase();
    const results = reviews.filter(review => 
      review.text.toLowerCase().includes(searchTerm) ||
      review.guestName.toLowerCase().includes(searchTerm) ||
      review.themes.some(theme => theme.includes(searchTerm))
    );
    
    res.status(200).json({
      success: true,
      count: results.length,
      query: q,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while searching reviews'
    });
  }
});

// GET /api/reviews/:id - Get single review
app.get('/api/reviews/:id', (req, res) => {
  try {
    const review = reviews.find(r => r.id === parseInt(req.params.id));
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching review'
    });
  }
});

// POST /api/reviews - Create review
app.post('/api/reviews', (req, res) => {
  try {
    const errors = validateReview(req.body);
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }
    
    const newReview = {
      id: nextId++,
      guestName: req.body.guestName,
      rating: req.body.rating,
      text: req.body.text,
      sentiment: req.body.sentiment || 'neutral',
      themes: req.body.themes || [],
      date: req.body.date || new Date().toISOString().split('T')[0],
      response: req.body.response || null
    };
    
    reviews.push(newReview);
    
    res.status(201).json({
      success: true,
      data: newReview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while creating review'
    });
  }
});

// PUT /api/reviews/:id - Update review
app.put('/api/reviews/:id', (req, res) => {
  try {
    const index = reviews.findIndex(r => r.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    const errors = validateReview(req.body);
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }
    
    reviews[index] = {
      ...reviews[index],
      guestName: req.body.guestName,
      rating: req.body.rating,
      text: req.body.text,
      sentiment: req.body.sentiment || reviews[index].sentiment,
      themes: req.body.themes || reviews[index].themes,
      date: req.body.date || reviews[index].date,
      response: req.body.response !== undefined ? req.body.response : reviews[index].response
    };
    
    res.status(200).json({
      success: true,
      data: reviews[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while updating review'
    });
  }
});

// DELETE /api/reviews/:id - Delete review
app.delete('/api/reviews/:id', (req, res) => {
  try {
    const index = reviews.findIndex(r => r.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    reviews.splice(index, 1);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while deleting review'
    });
  }
});

// POST /api/reviews/:id/response - Add response to review
app.post('/api/reviews/:id/response', (req, res) => {
  try {
    const index = reviews.findIndex(r => r.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    if (!req.body.response || req.body.response.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Response text is required'
      });
    }
    
    reviews[index].response = req.body.response;
    
    res.status(200).json({
      success: true,
      data: reviews[index]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while adding response'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

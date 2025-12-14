const express = require('express');
const router = express.Router();

const { auth, isAdmin } = require('./authMiddleware');

const {
  getAllSweets,
  addSweet,
  purchaseSweet,
  restockSweet,
  deleteSweet,
  searchSweets
} = require('./sweetsController');

router.get('/', auth, getAllSweets);
router.get('/search', auth, searchSweets);

router.post('/', auth, addSweet);
router.post('/:id/purchase', auth, purchaseSweet);
router.post('/:id/restock', auth, isAdmin, restockSweet);

router.delete('/:id', auth, isAdmin, deleteSweet);

module.exports = router;

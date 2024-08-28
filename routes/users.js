const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const { isMongoId } = require('validator'); // Ensure isMongoId is imported if used

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Update a user by ID
router.put('/:id', [
  check('id').custom(value => isMongoId(value)).withMessage('Invalid user ID format'),
  check('name').optional().isString().trim().escape().withMessage('Name must be a string'),
  check('phoneNo').optional().isString().trim().escape().withMessage('Phone number must be a string')
], async(req, res) => {
  const { name, phoneNo } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name !== undefined ? name : user.name;
    user.phoneNo = phoneNo !== undefined ? phoneNo : user.phoneNo;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete a user by ID
router.delete('/:id', [
  check('id').custom(value => isMongoId(value)).withMessage('Invalid user ID format')
], async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

module.exports = router;

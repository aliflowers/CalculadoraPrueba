const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

module.exports = {
  getAllUsers,
};

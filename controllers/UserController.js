const { User, Thought } = require('../models');

const UserController = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.find({}).populate('thoughts').populate('friends');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single user by id
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).populate('thoughts').populate('friends');
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Update a user by id
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Delete a user by id
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.id });
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      // Bonus: Remove a user's associated thoughts when deleted
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and associated thoughts have been deleted.' });
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Add a friend to a user's friend list
  async addFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Remove a friend from a user's friend list
  async deleteFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        res.status(404).json({ message: 'No user found with this id!' });
        return;
      }
      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};

module.exports = UserController;

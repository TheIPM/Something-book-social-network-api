const { Thought, User } = require('../models');

const ThoughtController = {
  // Get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find({});
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get a single thought by id
  async getThoughtById(req, res) {
    try {
      const thought = await Thought.findById(req.params.id);
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      await User.findByIdAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );
      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Update a thought by id
  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Delete a thought by id
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findByIdAndDelete(req.params.id);
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json({ message: 'Thought has been deleted.' });
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Add a reaction to a thought
  async addReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { new: true, runValidators: true }
      );
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // Remove a reaction from a thought
  async deleteReaction(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { new: true }
      );
      if (!thought) {
        res.status(404).json({ message: 'No thought found with this id!' });
        return;
      }
      res.json(thought);
    } catch (err) {
        res.status(400).json(err);
      }
    },
  };
  
  module.exports = ThoughtController;
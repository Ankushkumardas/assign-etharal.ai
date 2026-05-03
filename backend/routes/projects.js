const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { auth, adminAuth } = require('../middleware/auth');

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    // If member, only show projects they are part of. Admin sees all.
    const query = req.user.role === 'admin' ? {} : { members: req.user.id };
    const projects = await Project.find(query).populate('members', '-password');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project (Admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project (Admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project (Admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

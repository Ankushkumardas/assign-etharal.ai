const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { auth } = require('../middleware/auth');

// Get tasks (with optional projectId/status filter)
router.get('/', auth, async (req, res) => {
  try {
    const { projectId, status } = req.query;
    let query = {};
    if (projectId) query.project = projectId;
    if (status) query.status = status;

    const tasks = await Task.find(query)
      .populate('assignees', 'name email avatar role')
      .populate('project', 'name status')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('GET /tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Dashboard Stats
router.get('/stats', auth, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { assignees: req.user.id };
    const tasks = await Task.find(query);

    const now = new Date();
    const stats = {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter(t => t.status === 'to-do').length,
      inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
      completedTasks: tasks.filter(t => t.status === 'done').length,
      overdueTasks: tasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate) < now).length
    };
    res.json(stats);
  } catch (error) {
    console.error('GET /tasks/stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignees } = req.body;
    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      project,
      assignees: Array.isArray(assignees) ? assignees : []
    });
    await task.save();
    // Return populated task
    const populated = await Task.findById(task._id)
      .populate('assignees', 'name email avatar role')
      .populate('project', 'name status');
    res.status(201).json(populated);
  } catch (error) {
    console.error('POST /tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update task status only
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { status: req.body.status } },
      { new: true, runValidators: true }
    ).populate('assignees', 'name email avatar role');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    console.error('PATCH /tasks/:id/status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update full task — explicit field handling so assignees array is always set correctly
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, project, assignees } = req.body;

    const updateFields = {
      $set: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate }),
        ...(project !== undefined && { project }),
        assignees: Array.isArray(assignees) ? assignees : []
      },
      // Remove the old singular field if it exists from legacy data
      $unset: { assignee: '' }
    };

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate('assignees', 'name email avatar role')
      .populate('project', 'name status');

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    console.error('PUT /tasks/:id error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('DELETE /tasks/:id error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

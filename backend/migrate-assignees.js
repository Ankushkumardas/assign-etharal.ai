/**
 * Migration: convert old single `assignee` field → `assignees` array
 * Run once with: node migrate-assignees.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Task = require('./models/Task');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    // Find all tasks that still have the old "assignee" field
    const collection = mongoose.connection.collection('tasks');
    const oldTasks = await collection.find({ assignee: { $exists: true } }).toArray();
    console.log(`Found ${oldTasks.length} tasks with old 'assignee' field`);

    for (const t of oldTasks) {
      const existingAssignees = Array.isArray(t.assignees) ? t.assignees : [];
      const oldAssignee = t.assignee;

      // Add old assignee to assignees array if not already present
      const assigneeStr = oldAssignee?.toString();
      const alreadyIncluded = existingAssignees.some(id => id?.toString() === assigneeStr);
      const newAssignees = alreadyIncluded
        ? existingAssignees
        : oldAssignee ? [...existingAssignees, oldAssignee] : existingAssignees;

      await collection.updateOne(
        { _id: t._id },
        {
          $set: { assignees: newAssignees },
          $unset: { assignee: '' }
        }
      );
      console.log(`Migrated task "${t.title}": assignee ${assigneeStr} → assignees [${newAssignees.join(', ')}]`);
    }

    if (oldTasks.length === 0) {
      console.log('No migration needed — all tasks already use the assignees array.');
    } else {
      console.log('Migration complete!');
    }

    process.exit(0);
  })
  .catch(err => {
    console.error('Migration error:', err);
    process.exit(1);
  });

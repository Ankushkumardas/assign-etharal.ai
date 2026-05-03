require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const coll = mongoose.connection.collection('tasks');

  // Delete test/duplicate tasks (keep only the 2 original seeded ones)
  const deleted = await coll.deleteMany({
    _id: {
      $in: [
        new mongoose.Types.ObjectId('69f76b38d34525eaeec38062'),
        new mongoose.Types.ObjectId('69f76c2dd34525eaeec38063'),
        new mongoose.Types.ObjectId('69f76cbe9e2e8a9183e3ad33')
      ]
    }
  });
  console.log('Deleted duplicate tasks:', deleted.deletedCount);

  // Ensure all remaining tasks have assignees as an array (not undefined)
  const fixed = await coll.updateMany(
    { assignees: { $exists: false } },
    { $set: { assignees: [] }, $unset: { assignee: '' } }
  );
  console.log('Fixed tasks missing assignees field:', fixed.modifiedCount);

  // Also remove old singular assignee field from all remaining tasks
  const unset = await coll.updateMany(
    { assignee: { $exists: true } },
    { $unset: { assignee: '' } }
  );
  console.log('Removed legacy assignee field:', unset.modifiedCount);

  const tasks = await coll.find({}).toArray();
  console.log('\nFinal tasks in DB:');
  tasks.forEach(t => console.log(' -', t._id, '|', t.title, '| assignees:', JSON.stringify(t.assignees)));
  process.exit(0);
}).catch(err => { console.error(err); process.exit(1); });

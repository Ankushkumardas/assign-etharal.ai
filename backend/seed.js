const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB for seeding');
    
    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    
    console.log('Cleared database');

    const adminPassword = await bcrypt.hash('password123', 12);
    const memberPassword = await bcrypt.hash('password123', 12);

    const admin = new User({
      name: 'Admin User',
      email: 'admin@team.com',
      password: adminPassword,
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
    });

    const member1 = new User({
      name: 'John Member',
      email: 'john@team.com',
      password: memberPassword,
      role: 'member',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    });

    await admin.save();
    await member1.save();
    console.log('Created users');

    const project1 = new Project({
      name: 'Website Redesign',
      description: 'Redesigning the main corporate website',
      status: 'active',
      members: [admin._id, member1._id]
    });
    
    await project1.save();
    console.log('Created projects');

    const task1 = new Task({
      title: 'Design Homepage Mockups',
      description: 'Create Figma designs for the new homepage',
      status: 'to-do',
      priority: 'high',
      dueDate: new Date(Date.now() + 86400000 * 5), // 5 days from now
      project: project1._id,
      assignees: [member1._id]
    });
    
    const task2 = new Task({
      title: 'Review Color Palette',
      description: 'Ensure colors meet accessibility standards',
      status: 'in-progress',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
      project: project1._id,
      assignees: [admin._id]
    });

    await task1.save();
    await task2.save();
    console.log('Created tasks');

    console.log('Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding error:', error);
    process.exit(1);
  });

require('dotenv').config();
const http = require('http');

const post = (path, data, token) => new Promise((resolve, reject) => {
  const body = JSON.stringify(data);
  const req = http.request({
    hostname: 'localhost', port: 5000, path,
    method: path.includes('login') ? 'POST' : (token ? 'PUT' : 'POST'),
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      ...(token ? { 'Authorization': 'Bearer ' + token } : {})
    }
  }, res => {
    let b = '';
    res.on('data', d => b += d);
    res.on('end', () => {
      try { resolve({ status: res.statusCode, data: JSON.parse(b) }); }
      catch(e) { resolve({ status: res.statusCode, data: b }); }
    });
  });
  req.on('error', reject);
  req.write(body);
  req.end();
});

const get = (path, token) => new Promise((resolve, reject) => {
  http.get({ hostname:'localhost', port:5000, path, headers: { 'Authorization': 'Bearer ' + token } }, res => {
    let b = '';
    res.on('data', d => b += d);
    res.on('end', () => {
      try { resolve({ status: res.statusCode, data: JSON.parse(b) }); }
      catch(e) { resolve({ status: res.statusCode, data: b }); }
    });
  }).on('error', reject);
});

(async () => {
  // Login
  const loginRes = await post('/api/auth/login', { email: 'admin@team.com', password: 'password123' });
  const token = loginRes.data.token;
  console.log('1. Login:', loginRes.status === 200 ? 'OK' : 'FAIL', '| Token:', !!token);

  // Get tasks
  const tasksRes = await get('/api/tasks', token);
  console.log('2. GET /tasks:', tasksRes.status, '| Count:', tasksRes.data.length);
  const task = tasksRes.data[0];
  console.log('   Task:', task._id, task.title, '| assignees:', JSON.stringify(task.assignees));

  // PUT task with multiple assignees
  const putPath = '/api/tasks/' + task._id;
  const updateData = {
    title: task.title,
    description: task.description || '',
    status: task.status,
    priority: task.priority,
    project: task.project?._id || task.project,
    assignees: ['69f7641244e298e1abfc51af', '69f7641244e298e1abfc51b0'],
    dueDate: task.dueDate
  };

  // Manual PUT since our helper auto-detects method
  const putRes = await new Promise((resolve, reject) => {
    const body = JSON.stringify(updateData);
    const req = http.request({
      hostname: 'localhost', port: 5000, path: putPath, method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), 'Authorization': 'Bearer ' + token }
    }, res => {
      let b = '';
      res.on('data', d => b += d);
      res.on('end', () => { try { resolve({ status: res.statusCode, data: JSON.parse(b) }); } catch(e) { resolve({ status: res.statusCode, data: b }); } });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });

  console.log('3. PUT /tasks/' + task._id + ':', putRes.status);
  if (putRes.status === 200) {
    console.log('   Updated assignees:', JSON.stringify(putRes.data.assignees));
    console.log('   SUCCESS: assignees are populated objects:', typeof putRes.data.assignees?.[0]);
  } else {
    console.log('   ERROR:', JSON.stringify(putRes.data));
  }
})();

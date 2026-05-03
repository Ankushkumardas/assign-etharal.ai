import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';
import { api } from '../api/mockData';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';

const StatCard = ({ title, value, icon: Icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="glass-card p-6 flex items-center space-x-4"
  >
    <div className={`p-4 border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5`}>
      <Icon className={`w-8 h-8 text-black dark:text-white`} />
    </div>
    <div>
      <p className="text-sm font-medium text-black/60 dark:text-white/60">{title}</p>
      <h4 className="text-3xl font-bold text-black font-display dark:text-white">{value}</h4>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, tasksData] = await Promise.all([
          api.getDashboardStats(),
          api.getTasks()
        ]);
        setStats(statsData);
        setRecentTasks(tasksData.slice(0, 4)); // Get 4 most recent
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-black font-display dark:text-white">Welcome back!</h2>
        <p className="text-black/60 mt-1 dark:text-white/60">Here's a quick overview of your projects and tasks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Tasks" value={stats?.totalTasks} icon={ListTodo} delay={0.1} />
        <StatCard title="In Progress" value={stats?.inProgressTasks} icon={Clock} delay={0.2} />
        <StatCard title="Completed" value={stats?.completedTasks} icon={CheckCircle2} delay={0.3} />
        <StatCard title="Overdue" value={stats?.overdueTasks} icon={AlertCircle} delay={0.4} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-black font-display dark:text-white">Recent Tasks</h3>
          <button onClick={() => navigate('/tasks')} className="text-sm font-medium text-black hover:underline dark:text-white">
            View all
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentTasks.map((task, index) => (
            <motion.div
              key={task._id || task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <TaskCard task={task} onClick={() => navigate('/tasks')} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

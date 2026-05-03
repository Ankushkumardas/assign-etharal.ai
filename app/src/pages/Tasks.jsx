import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Filter, Edit2, Trash2, X } from 'lucide-react';
import { api } from '../api/mockData';
import TaskCard from '../components/TaskCard';
import { useSearchParams } from 'react-router-dom';
import Modal from '../components/Modal';

const COLUMNS = [
  { id: 'to-do', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' }
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const projectIdParam = searchParams.get('projectId');

  // Filter state
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    project: projectIdParam || '',
    priority: '',
    assignee: ''
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '', description: '', status: 'to-do',
    priority: 'medium', project: '', assignees: [], dueDate: ''
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const [tasksData, projectsData, usersData] = await Promise.all([
        api.getTasks(), api.getProjects(), api.getUsers()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setUsers(usersData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Sync URL param into filters
  useEffect(() => {
    if (projectIdParam) setFilters(f => ({ ...f, project: projectIdParam }));
  }, [projectIdParam]);

  // Compute active filter count for badge
  const activeFilterCount = [filters.project, filters.priority, filters.assignee].filter(Boolean).length;

  const clearFilters = () => {
    setFilters({ project: '', priority: '', assignee: '' });
    setSearchParams({});
  };

  // Client-side filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filters.project) {
        const taskProjectId = task.project?._id || task.project;
        if (taskProjectId !== filters.project) return false;
      }
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.assignee) {
        const assigneeIds = (task.assignees || []).map(a => typeof a === 'object' ? a._id : a);
        if (!assigneeIds.includes(filters.assignee)) return false;
      }
      return true;
    });
  }, [tasks, filters]);

  const moveTask = async (taskId, newStatus) => {
    setTasks(prev => prev.map(t => (t._id || t.id) === taskId ? { ...t, status: newStatus } : t));
    await api.updateTaskStatus(taskId, newStatus);
  };

  const handleOpenModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        project: task.project?._id || task.project || (projects[0]?._id || ''),
        assignees: task.assignees?.map(a => typeof a === 'object' ? a._id : a) || [],
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      setEditingTask(null);
      setFormData({
        title: '', description: '', status: 'to-do',
        priority: 'medium', project: projects[0]?._id || '',
        assignees: [], dueDate: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.updateTask(editingTask._id || editingTask.id, formData);
      } else {
        await api.createTask(formData);
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert('Failed to save task');
    }
  };

  const handleDelete = async (task) => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await api.deleteTask(task._id || task.id);
        fetchTasks();
      } catch (error) {
        console.error(error);
        alert('Failed to delete task');
      }
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-black font-display dark:text-white">Tasks Board</h2>
          <p className="text-black/60 text-sm mt-1 dark:text-white/60">Manage and track your tasks across different stages.</p>
        </div>
        <div className="flex space-x-3 shrink-0">
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`relative btn-secondary flex items-center space-x-2 ${showFilters ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold bg-black text-white dark:bg-white dark:text-black border border-white dark:border-black">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Dynamic Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden mb-4"
          >
            <div className="border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-4">
              <div className="flex flex-wrap gap-4 items-end">
                {/* Project filter */}
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1 uppercase tracking-wide">Project</label>
                  <select
                    value={filters.project}
                    onChange={e => setFilters(f => ({ ...f, project: e.target.value }))}
                    className="input-field text-sm"
                  >
                    <option value="">All Projects</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Priority filter */}
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1 uppercase tracking-wide">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
                    className="input-field text-sm"
                  >
                    <option value="">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Assignee filter */}
                <div className="flex-1 min-w-[160px]">
                  <label className="block text-xs font-semibold text-black/60 dark:text-white/60 mb-1 uppercase tracking-wide">Assignee</label>
                  <select
                    value={filters.assignee}
                    onChange={e => setFilters(f => ({ ...f, assignee: e.target.value }))}
                    className="input-field text-sm"
                  >
                    <option value="">All Members</option>
                    {users.map(u => (
                      <option key={u._id} value={u._id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                {activeFilterCount > 0 && (
                  <button onClick={clearFilters} className="btn-secondary text-sm flex items-center space-x-1.5 self-end">
                    <X className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>

              {/* Active filter chips */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-black/10 dark:border-white/10">
                  {filters.project && (
                    <span className="flex items-center space-x-1.5 px-2 py-0.5 bg-white dark:bg-[#111] border border-black/20 dark:border-white/20 text-xs text-black dark:text-white">
                      <span>Project: {projects.find(p => p._id === filters.project)?.name || filters.project}</span>
                      <button onClick={() => { setFilters(f => ({ ...f, project: '' })); setSearchParams({}); }}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {filters.priority && (
                    <span className="flex items-center space-x-1.5 px-2 py-0.5 bg-white dark:bg-[#111] border border-black/20 dark:border-white/20 text-xs text-black dark:text-white capitalize">
                      <span>Priority: {filters.priority}</span>
                      <button onClick={() => setFilters(f => ({ ...f, priority: '' }))}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                  {filters.assignee && (
                    <span className="flex items-center space-x-1.5 px-2 py-0.5 bg-white dark:bg-[#111] border border-black/20 dark:border-white/20 text-xs text-black dark:text-white">
                      <span>Assignee: {users.find(u => u._id === filters.assignee)?.name || filters.assignee}</span>
                      <button onClick={() => setFilters(f => ({ ...f, assignee: '' }))}><X className="w-3 h-3" /></button>
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black dark:border-white"></div>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
          {COLUMNS.map((column) => {
            const columnTasks = filteredTasks.filter(t => t.status === column.id);
            return (
              <div key={column.id} className="bg-black/5 dark:bg-white/5 flex flex-col h-full overflow-hidden border border-black/10 dark:border-white/10">
                <div className="p-4 border-b border-black/10 dark:border-white/10 flex justify-between items-center bg-white/50 dark:bg-[#111]/50 backdrop-blur-sm">
                  <h3 className="font-semibold text-black dark:text-white">{column.title}</h3>
                  <span className="bg-white dark:bg-[#111] px-2.5 py-0.5 text-xs font-bold text-black dark:text-white border border-black/10 dark:border-white/10">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {columnTasks.length === 0 && (
                    <p className="text-xs text-black/30 dark:text-white/30 text-center py-6">No tasks here</p>
                  )}
                  {columnTasks.map((task) => (
                    <motion.div
                      key={task._id || task.id}
                      layoutId={task._id || task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative group cursor-pointer"
                      onClick={() => setViewingTask(task)}
                    >
                      <TaskCard task={task} />

                      {/* Action buttons overlay */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 bg-white/90 dark:bg-[#111]/90 backdrop-blur-sm p-1 border border-black/10 dark:border-white/10">
                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(task); }} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(task); }} className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 hover:text-red-600 dark:hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="mt-2 flex gap-2 flex-wrap">
                        {COLUMNS.map(c => c.id !== column.id && (
                          <button
                            key={c.id}
                            onClick={(e) => { e.stopPropagation(); moveTask(task._id || task.id, c.id); }}
                            className="text-xs px-2 py-1 bg-white border border-black/20 text-black hover:border-black dark:bg-[#111] dark:border-white/20 dark:text-white dark:hover:border-white transition-colors"
                          >
                            → {c.title}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTask ? 'Edit Task' : 'New Task'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">Task Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" placeholder="E.g. Update user profile design" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field min-h-[80px]" placeholder="Detailed description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="input-field">
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">Priority</label>
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">Project</label>
              <select required value={formData.project} onChange={e => setFormData({...formData, project: e.target.value})} className="input-field">
                <option value="" disabled>Select project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-1">Due Date</label>
              <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">Assignees</label>
            <div className="max-h-32 overflow-y-auto border border-black/10 dark:border-white/10 p-2 space-y-1 bg-black/5 dark:bg-[#111]">
              {users.map(u => (
                <label key={u._id} className="flex items-center space-x-2 p-1.5 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.assignees.includes(u._id)}
                    onChange={() => {
                      setFormData(prev => ({
                        ...prev,
                        assignees: prev.assignees.includes(u._id)
                          ? prev.assignees.filter(id => id !== u._id)
                          : [...prev.assignees, u._id]
                      }));
                    }}
                    className="border-black/20 dark:border-white/20"
                  />
                  <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u._id}`} alt={u.name} className="w-5 h-5 rounded-full border border-black/10 dark:border-white/10" />
                  <span className="text-xs text-black dark:text-white">{u.name}</span>
                  <span className="text-xs text-black/40 dark:text-white/40 ml-auto capitalize">{u.role}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Task</button>
          </div>
        </form>
      </Modal>

      {/* Task Details Modal */}
      <Modal isOpen={!!viewingTask} onClose={() => setViewingTask(null)} title="Task Details">
        {viewingTask && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold capitalize border border-black/20 text-black dark:border-white/20 dark:text-white">
                  {viewingTask.priority} Priority
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold capitalize border border-black/20 text-black dark:border-white/20 dark:text-white">
                  {viewingTask.status.replace('-', ' ')}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-black dark:text-white">{viewingTask.title}</h3>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-black dark:text-white mb-1">Description</h4>
              <p className="text-black/70 dark:text-white/70 whitespace-pre-wrap">{viewingTask.description || 'No description provided.'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-black dark:text-white mb-1">Project</h4>
                <p className="text-sm text-black/70 dark:text-white/70">
                  {viewingTask.project?.name || projects.find(p => p._id === viewingTask.project)?.name || 'Unknown Project'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-black dark:text-white mb-1">Due Date</h4>
                <p className="text-sm text-black/70 dark:text-white/70">
                  {viewingTask.dueDate ? new Date(viewingTask.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'No due date'}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-black dark:text-white mb-2">Assignees</h4>
              <div className="flex flex-wrap gap-2">
                {viewingTask.assignees && viewingTask.assignees.length > 0 ? (
                  viewingTask.assignees.map(assignee => {
                    const a = typeof assignee === 'object' ? assignee : users.find(u => u._id === assignee);
                    if (!a) return null;
                    return (
                      <div key={a._id} className="flex items-center space-x-2 px-2 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                        <img src={a.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${a._id}`} alt={a.name} className="w-5 h-5 rounded-full border border-black/20 dark:border-white/20" />
                        <span className="text-xs text-black dark:text-white">{a.name}</span>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-sm text-black/40 dark:text-white/40">Unassigned</span>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-black/10 dark:border-white/10 flex justify-end">
              <button
                onClick={() => { handleOpenModal(viewingTask); setViewingTask(null); }}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Task</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Tasks;

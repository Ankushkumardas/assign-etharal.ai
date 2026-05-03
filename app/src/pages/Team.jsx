import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Users } from 'lucide-react';
import { api } from '../api/mockData';
import Modal from '../components/Modal';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'member'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '', // Leave blank when editing
        role: user.role
      });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'member' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password; // Don't send empty password
        await api.updateUser(editingUser._id, updateData);
      } else {
        await api.createUser(formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Failed to save user');
    }
  };

  const handleDelete = async (user) => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        await api.deleteUser(user._id);
        fetchUsers();
      } catch (error) {
        console.error(error);
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black font-display dark:text-white">Team Members</h2>
          <p className="text-black/60 text-sm mt-1 dark:text-white/60">Manage your team and their roles.</p>
        </div>
        
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center justify-center space-x-2 shrink-0">
          <Plus className="w-4 h-4" />
          <span>New Member</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black dark:border-white"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user, index) => (
            <motion.div
              key={user._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-card p-6 flex flex-col items-center text-center group relative"
            >
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(user)} className="p-1.5 text-black/60 hover:text-black hover:bg-black/5 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(user)} className="p-1.5 text-red-500/80 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <img 
                src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                alt={user.name} 
                className="w-20 h-20 border-2 border-black/10 bg-black/5 mb-4 dark:border-white/10 dark:bg-white/5"
              />
              <h3 className="text-lg font-bold text-black dark:text-white">{user.name}</h3>
              <p className="text-sm text-black/60 dark:text-white/60">{user.email}</p>
              
              <span className="mt-4 px-3 py-1 text-xs font-semibold uppercase border border-black/20 text-black/60 dark:border-white/20 dark:text-white/60">
                {user.role}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* User Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? 'Edit Member' : 'New Member'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="E.g. Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">Email</label>
            <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="input-field" placeholder="jane@team.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">
              Password {editingUser && <span className="text-xs text-black/40 dark:text-white/40">(Leave blank to keep unchanged)</span>}
            </label>
            <input 
              type="password" 
              required={!editingUser} 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              className="input-field" 
              placeholder={editingUser ? "••••••••" : "Enter a secure password"} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">Role</label>
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="input-field">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">{editingUser ? 'Save Changes' : 'Add Member'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Team;

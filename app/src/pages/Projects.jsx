import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FolderGit2, Plus, Edit2, Trash2, Users } from 'lucide-react';
import { api } from '../api/mockData';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, index, onEdit, onDelete, onView, isAdmin }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
    className="glass-card p-6 flex flex-col group cursor-pointer"
    onClick={() => onView(project)}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5">
        <FolderGit2 className="w-6 h-6 text-black dark:text-white" />
      </div>
      {isAdmin && (
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onEdit(project); }} className="p-1.5 text-black/60 hover:text-black hover:bg-black/5 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(project); }} className="p-1.5 text-red-500/80 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
    
    <h3 className="text-lg font-bold text-black mb-2 font-display dark:text-white">{project.name}</h3>
    <p className="text-sm text-black/60 mb-6 line-clamp-2 dark:text-white/60 h-10">{project.description}</p>
    
    <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/10 dark:border-white/10">
      <div className="flex items-center space-x-2 text-sm text-black/60 dark:text-white/60">
        <Users className="w-4 h-4" />
        <span>{project.members?.length || 0} Members</span>
      </div>
      <span className={`px-2.5 py-1 text-xs font-semibold capitalize border ${
        project.status === 'active' ? 'border-black text-black dark:border-white dark:text-white' : 'border-black/20 text-black/60 dark:border-white/20 dark:text-white/60'
      }`}>
        {project.status}
      </span>
    </div>
  </motion.div>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({ name: '', description: '', status: 'active', members: [] });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const [projData, usersData] = await Promise.all([api.getProjects(), api.getUsers()]);
      setProjects(projData);
      setUsers(usersData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        description: project.description,
        status: project.status,
        members: project.members?.map(m => typeof m === 'object' ? m._id : m) || []
      });
    } else {
      setEditingProject(null);
      setFormData({ name: '', description: '', status: 'active', members: [] });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await api.updateProject(editingProject._id, formData);
      } else {
        await api.createProject(formData);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error(error);
      alert('Failed to save project');
    }
  };

  const handleDelete = async (project) => {
    if (window.confirm(`Are you sure you want to delete ${project.name}?`)) {
      try {
        await api.deleteProject(project._id);
        fetchProjects();
      } catch (error) {
        console.error(error);
        alert('Failed to delete project');
      }
    }
  };

  const handleMemberToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId) 
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black font-display dark:text-white">Projects</h2>
          <p className="text-black/60 text-sm mt-1 dark:text-white/60">Manage all your team's projects in one place.</p>
        </div>
        
        {isAdmin && (
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center justify-center space-x-2 shrink-0">
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black dark:border-white"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card py-20 flex flex-col items-center justify-center text-center">
          <FolderGit2 className="w-16 h-16 text-black/20 mb-4 dark:text-white/20" />
          <h3 className="text-xl font-bold text-black mb-2 dark:text-white">No projects yet</h3>
          <p className="text-black/60 max-w-sm dark:text-white/60">
            {isAdmin ? "Get started by creating your first project." : "You haven't been assigned to any projects yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project._id || project.id} 
              project={project} 
              index={index} 
              onEdit={handleOpenModal}
              onDelete={handleDelete}
              onView={setViewingProject}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProject ? 'Edit Project' : 'New Project'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">Project Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="input-field" placeholder="E.g. Website Redesign" />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field min-h-[100px]" placeholder="Brief description..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-1">Status</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="input-field">
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">Team Members</label>
            <div className="max-h-40 overflow-y-auto border border-black/10 dark:border-white/10 p-2 space-y-1 bg-black/5 dark:bg-[#111]">
              {users.map(u => (
                <label key={u._id} className="flex items-center space-x-2 p-2 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.members.includes(u._id)} 
                    onChange={() => handleMemberToggle(u._id)}
                    className="border-black/20 text-black focus:ring-black dark:border-white/20 dark:bg-[#111]"
                  />
                  <span className="text-sm text-black dark:text-white">{u.name} ({u.email})</span>
                </label>
              ))}
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Project</button>
          </div>
        </form>
      </Modal>

      {/* Project Details Modal */}
      <Modal isOpen={!!viewingProject} onClose={() => setViewingProject(null)} title="Project Details">
        {viewingProject && (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-black dark:text-white mb-2">{viewingProject.name}</h3>
              <span className={`px-2.5 py-1 text-xs font-semibold capitalize border inline-block ${
                viewingProject.status === 'active' ? 'border-black text-black dark:border-white dark:text-white' : 'border-black/20 text-black/60 dark:border-white/20 dark:text-white/60'
              }`}>
                Status: {viewingProject.status}
              </span>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-black dark:text-white mb-1">Description</h4>
              <p className="text-black/70 dark:text-white/70 whitespace-pre-wrap">{viewingProject.description}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-black dark:text-white mb-2">Team Members ({viewingProject.members?.length || 0})</h4>
              <div className="flex flex-wrap gap-2">
                {viewingProject.members?.map(member => {
                  // member could be populated object or id string depending on API
                  const memberName = typeof member === 'object' ? member.name : (users.find(u => u._id === member)?.name || 'Unknown');
                  return (
                    <span key={typeof member === 'object' ? member._id : member} className="px-2 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs text-black dark:text-white">
                      {memberName}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-black/10 dark:border-white/10 flex justify-end space-x-3">
              {isAdmin && (
                <button 
                  onClick={() => {
                    handleOpenModal(viewingProject);
                    setViewingProject(null);
                  }} 
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Edit Project</span>
                </button>
              )}
              <button 
                onClick={() => navigate(`/tasks?projectId=${viewingProject._id}`)} 
                className="btn-primary"
              >
                View Tasks
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Projects;

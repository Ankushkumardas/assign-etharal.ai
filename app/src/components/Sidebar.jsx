import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderGit2, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Projects', icon: FolderGit2, path: '/projects' },
    { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Team', icon: Users, path: '/team' });
  }

  return (
    <aside className="w-64 border-r border-black/10 flex flex-col h-screen sticky top-0 dark:border-white/10 bg-white dark:bg-[#111]">
      <div className="p-6 flex items-center space-x-3 border-b border-black/10 dark:border-white/10">
        <div className="w-8 h-8 flex items-center justify-center border-2 border-black dark:border-white">
          <CheckSquare className="w-5 h-5 text-black dark:text-white" />
        </div>
        <span className="text-xl font-bold font-display text-black dark:text-white">TaskFlow</span>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto">
        <div className="text-xs font-semibold text-black/40 dark:text-white/40 uppercase tracking-wider mb-2 px-2">Menu</div>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 transition-colors font-medium ${
                isActive 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-black/10 dark:border-white/10">
        <div className="flex items-center space-x-3 mb-4 px-2">
          <img src={user?.avatar} alt={user?.name} className="w-10 h-10 border border-black/20 bg-white dark:border-white/20 dark:bg-black" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-black truncate dark:text-white">{user?.name}</p>
            <p className="text-xs text-black/50 capitalize dark:text-white/50">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center w-full space-x-3 px-3 py-2.5 text-black/70 hover:bg-black/5 transition-colors font-medium dark:text-white/70 dark:hover:bg-white/10"
        >
          <LogOut className="w-5 h-5" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


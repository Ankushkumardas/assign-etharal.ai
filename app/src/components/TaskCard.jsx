import React from 'react';
import { Clock, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const priorityColors = {
  high: 'bg-black/10 text-black border-black/20 dark:bg-white/10 dark:text-white dark:border-white/20',
  medium: 'bg-black/5 text-black border-black/10 dark:bg-white/5 dark:text-white dark:border-white/10',
  low: 'bg-transparent text-black border-black/10 dark:text-white dark:border-white/10'
};

const statusIcons = {
  'to-do': <Circle className="w-5 h-5 text-black/40 dark:text-white/40" />,
  'in-progress': <Clock className="w-5 h-5 text-black dark:text-white" />,
  'done': <CheckCircle2 className="w-5 h-5 text-black dark:text-white" />
};

const TaskCard = ({ task, onClick }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div 
      onClick={onClick}
      className="glass-card p-5 cursor-pointer group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          {statusIcons[task.status]}
          <span className={`px-2.5 py-0.5 text-xs font-semibold border ${priorityColors[task.priority]} capitalize`}>
            {task.priority}
          </span>
        </div>
        {isOverdue && (
          <div className="flex items-center text-xs font-medium text-black border border-black px-2 py-1 dark:text-white dark:border-white">
            <AlertCircle className="w-3.5 h-3.5 mr-1" />
            Overdue
          </div>
        )}
      </div>
      
      <h3 className="text-lg font-bold text-black mb-2 group-hover:underline transition-all line-clamp-1 dark:text-white">
        {task.title}
      </h3>
      
      <p className="text-sm text-black/60 line-clamp-2 mb-4 flex-1 dark:text-white/60">
        {task.description}
      </p>
      
      <div className="mt-auto pt-4 border-t border-black/10 flex items-center justify-between dark:border-white/10">
        <div className="flex -space-x-2">
          {/* Assignees Avatars */}
          {task.assignees && task.assignees.length > 0 ? (
            task.assignees.slice(0, 3).map((assignee, idx) => (
              <img 
                key={assignee._id || idx}
                src={assignee.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${assignee._id || 'default'}`}
                alt={assignee.name || "Assignee"} 
                className="w-8 h-8 border border-black/20 bg-white dark:border-white/20 dark:bg-black rounded-full"
                title={assignee.name || "Assigned User"}
              />
            ))
          ) : (
            <div className="w-8 h-8 border border-black/20 border-dashed bg-black/5 dark:border-white/20 dark:bg-white/5 rounded-full flex items-center justify-center" title="Unassigned">
              <span className="text-[10px] text-black/40 dark:text-white/40">?</span>
            </div>
          )}
          {task.assignees && task.assignees.length > 3 && (
            <div className="w-8 h-8 border border-black/20 bg-black/5 dark:border-white/20 dark:bg-white/5 rounded-full flex items-center justify-center text-[10px] font-bold z-10">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>
        <div className={`text-xs font-medium flex items-center ${isOverdue ? 'text-black font-bold dark:text-white' : 'text-black/60 dark:text-white/60'}`}>
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          {format(new Date(task.dueDate), 'MMM d, yyyy')}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

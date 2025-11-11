import React, { useState } from 'react';
import { 
  BarChart3, 
  CalendarClock, 
  Bell, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  AlertTriangle
} from 'lucide-react';

interface ProjectTask {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

interface Notification {
  id: string;
  message: string;
  time: string;
  type: 'warning' | 'info' | 'success';
}

const RightSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'notifications' | 'activity'>('tasks');
  
  const upcomingTasks: ProjectTask[] = [
    {
      id: '1',
      title: 'UI Design Review',
      dueDate: 'Today',
      priority: 'high',
      completed: false
    },
    {
      id: '2',
      title: 'API Documentation',
      dueDate: 'Tomorrow',
      priority: 'medium',
      completed: false
    },
    {
      id: '3',
      title: 'Team Standup',
      dueDate: 'Today',
      priority: 'high',
      completed: true
    }
  ];
  
  const notifications: Notification[] = [
    {
      id: '1',
      message: 'Sprint planning meeting in 30 minutes',
      time: '10:30 AM',
      type: 'info'
    },
    {
      id: '2',
      message: 'Critical bug reported in production',
      time: '9:15 AM',
      type: 'warning'
    },
    {
      id: '3',
      message: 'Code review completed for PR #42',
      time: 'Yesterday',
      type: 'success'
    }
  ];
  
  const recentActivity = [
    { id: '1', user: 'Alex Kim', action: 'updated UI designs', time: '20 min ago' },
    { id: '2', user: 'Sara Chen', action: 'merged PR #38', time: '1 hour ago' },
    { id: '3', user: 'Raj Patel', action: 'created new ticket', time: '3 hours ago' }
  ];
  
  return (
    <div className="w-64 bg-white border-l border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">Project Dashboard</h2>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          className={`flex-1 py-3 px-2 text-sm font-medium ${activeTab === 'tasks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('tasks')}
        >
          <div className="flex items-center justify-center">
            <CheckCircle2 size={16} className="mr-1" />
            Tasks
          </div>
        </button>
        <button 
          className={`flex-1 py-3 px-2 text-sm font-medium ${activeTab === 'notifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('notifications')}
        >
          <div className="flex items-center justify-center">
            <Bell size={16} className="mr-1" />
            Alerts
          </div>
        </button>
        <button 
          className={`flex-1 py-3 px-2 text-sm font-medium ${activeTab === 'activity' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('activity')}
        >
          <div className="flex items-center justify-center">
            <Users size={16} className="mr-1" />
            Team
          </div>
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'tasks' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-700">Upcoming Tasks</h3>
              <CalendarClock size={16} className="text-gray-500" />
            </div>
            <div className="space-y-3">
              {upcomingTasks.map(task => (
                <div key={task.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        task.priority === 'high' ? 'bg-red-500' : 
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.title}
                      </span>
                    </div>
                    {task.completed && <CheckCircle2 size={16} className="text-green-500" />}
                  </div>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock size={14} className="mr-1" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-600 flex items-center justify-center w-full">
                View All Tasks <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-700">Recent Notifications</h3>
              <Bell size={16} className="text-gray-500" />
            </div>
            <div className="space-y-3">
              {notifications.map(notification => (
                <div key={notification.id} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-start">
                    {notification.type === 'warning' && <AlertTriangle size={16} className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />}
                    {notification.type === 'info' && <Bell size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />}
                    {notification.type === 'success' && <CheckCircle2 size={16} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="text-sm text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-600 flex items-center justify-center w-full">
                View All Notifications <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-700">Team Activity</h3>
              <Users size={16} className="text-gray-500" />
            </div>
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <div key={activity.id} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium text-gray-800">{activity.user}</span>
                    <span className="text-gray-600"> {activity.action}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button className="text-sm text-blue-600 flex items-center justify-center w-full">
                View All Activity <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Dashboard Stats Summary */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-700">
            <BarChart3 size={16} className="mr-2 text-blue-600" />
            <span>Sprint Progress</span>
          </div>
          <span className="text-sm font-medium">68%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
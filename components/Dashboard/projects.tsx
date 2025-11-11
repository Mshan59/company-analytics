
"use client"
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Sparkles, FileCheck, CircleCheck, AlertTriangle, XCircle } from 'lucide-react';
import Image from 'next/image';
import logout from '../logout';
interface Project {
  title: string;
  category: string;
  progress: number;
  dateRange: string;
  status: 'On-Track' | 'At-Risk' | 'Blocked';
  team: { id: number; avatar: string }[];
}

const ProjectList: React.FC = () => {
  const [filter, setFilter] = useState('All Status');
  const fetchProtectedData = async () => {
    const token = localStorage.getItem('token');

    const res = await fetch('/api/protected', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    fetchProtectedData(); // Fetch when component loads
  }, []);

  const projects: Project[] = [
    {
      title: 'AI-Powered Search',
      category: 'E-Commerce Platform',
      progress: 70,
      dateRange: 'Oct 1 - Dec 15',
      status: 'On-Track',
      team: [{ id: 1, avatar: '/api/placeholder/40/40' }, { id: 2, avatar: '/api/placeholder/40/40' }, { id: 3, avatar: '/api/placeholder/40/40' }]
    },
    {
      title: 'User Authentication',
      category: 'Security System',
      progress: 45,
      dateRange: 'Sep 15 - Nov 30',
      status: 'At-Risk',
      team: [{ id: 1, avatar: '/api/placeholder/40/40' }, { id: 2, avatar: '/api/placeholder/40/40' }, { id: 3, avatar: '/api/placeholder/40/40' }]
    },
    {
      title: 'Payment Gateway',
      category: 'Financial Module',
      progress: 90,
      dateRange: 'Aug 1 - Oct 30',
      status: 'Blocked',
      team: [{ id: 1, avatar: '/api/placeholder/40/40' }, { id: 2, avatar: '/api/placeholder/40/40' }, { id: 3, avatar: '/api/placeholder/40/40' }]
    },
    {
      title: 'Analytics Dashboard',
      category: 'Data Visualization',
      progress: 75,
      dateRange: 'Oct 15 - Dec 30',
      status: 'On-Track',
      team: [{ id: 1, avatar: '/api/placeholder/40/40' }, { id: 2, avatar: '/api/placeholder/40/40' }, { id: 3, avatar: '/api/placeholder/40/40' }]
    },
    {
      title: 'Mobile App Redesign',
      category: 'UX Improvement',
      progress: 30,
      dateRange: 'Nov 1 - Jan 15',
      status: 'At-Risk',
      team: [{ id: 1, avatar: '/api/placeholder/40/40' }, { id: 2, avatar: '/api/placeholder/40/40' }, { id: 3, avatar: '/api/placeholder/40/40' }]
    },
    {
      title: 'API integration',
      category: 'Third party Services',
      progress: 85,
      dateRange: 'Sept 1 - Nov 15',
      status: 'On-Track',
      team: [{ id: 1, avatar: '/api/placeholder/40/40' }, { id: 2, avatar: '/api/placeholder/40/40' }, { id: 3, avatar: '/api/placeholder/40/40' }]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On-Track':
        return <CircleCheck className="w-5 h-5 text-green-500" />;
      case 'At-Risk':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'Blocked':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'On-Track':
        return 'bg-green-500';
      case 'At-Risk':
        return 'bg-yellow-500';
      case 'Blocked':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Project List</h1>
          <div className="flex space-x-3">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              AI Project
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
              Finalize Specs
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center">
              <FileCheck className="w-5 h-5 mr-2" />
              AI Summary
            </button>
          </div>
        </div>

        {/* Filter section */}
        <div className="flex space-x-3 mb-8">
          <button 
            className={`px-4 py-2 rounded-md border ${filter === 'All Status' ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'}`}
            onClick={() => setFilter('All Status')}
          >
            All Status
          </button>
          <button 
            className={`px-4 py-2 rounded-md border ${filter === 'All Priority' ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'}`}
            onClick={() => setFilter('All Priority')}
          >
            All Priority
          </button>
          <button 
            className={`px-4 py-2 rounded-md border ${filter === 'This Week' ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200'}`}
            onClick={() => setFilter('This Week')}
          >
            This Week
          </button>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{project.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{project.category}</p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
                  <div 
                    className={`h-2 rounded-full ${getProgressColor(project.status)}`} 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                
                {/* Date and status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    {project.dateRange}
                  </div>
                  <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-md text-sm">
                    Open
                  </div>
                </div>
                
                {/* Team members */}
                <div className="flex mt-4 mb-4">
                  <div className="flex -space-x-2">
                    {project.team.map((member, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-300">
                        <img src={member.avatar} alt={`Team member ${member.id}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-gray-200 text-gray-600 text-xs">
                      +2
                    </div>
                  </div>
                </div>
                
                {/* Status and insights */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getStatusIcon(project.status)}
                    <span className="ml-2 text-sm">{project.status}</span>
                  </div>
                  <div className="text-purple-600 text-sm">
                    AI Insights
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
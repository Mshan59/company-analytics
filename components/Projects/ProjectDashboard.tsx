"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { fetchProjectDashboard } from '@/lib/api/projectsApi';
import { ProjectDashboardData } from '@/models/project';
import { useRouter } from 'next/navigation';
import { formatDateRange, getStatusColor } from '@/lib/projectHelpers';

interface ProjectDashboardProps {
  projectId: number;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ projectId }) => {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<ProjectDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tasks' | 'alerts' | 'team'>('tasks');

  useEffect(() => {
    loadDashboard();
  }, [projectId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProjectDashboard(projectId);
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || 'Failed to load dashboard'}
        </div>
      </div>
    );
  }

  const { project, upcomingTasks, sprintProgress, teamMembers, recentActivity } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back button and header */}
        <button
          onClick={() => router.push('/projects')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Projects
        </button>

        {/* Project Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className={`px-3 py-1 rounded-md ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDateRange(project.start_date, project.end_date)}
                </span>
                <span className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  {project.member_count} members
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <div className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className={`py-4 border-b-2 font-medium transition-colors ${
                      activeTab === 'tasks'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setActiveTab('alerts')}
                    className={`py-4 border-b-2 font-medium transition-colors ${
                      activeTab === 'alerts'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Alerts
                  </button>
                  <button
                    onClick={() => setActiveTab('team')}
                    className={`py-4 border-b-2 font-medium transition-colors ${
                      activeTab === 'team'
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Team
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Tasks Tab */}
                {activeTab === 'tasks' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Upcoming Tasks</h3>
                    {upcomingTasks.length === 0 ? (
                      <p className="text-gray-500">No upcoming tasks</p>
                    ) : (
                      <div className="space-y-3">
                        {upcomingTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                task.priority === 'urgent' ? 'bg-red-500' :
                                task.priority === 'high' ? 'bg-orange-500' :
                                task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`} />
                              <div>
                                <p className="font-medium text-gray-900">{task.title}</p>
                                <p className="text-sm text-gray-500">
                                  Due: {new Date(task.due_date).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm text-gray-600">{task.status}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="mt-4 text-purple-600 hover:text-purple-700 font-medium">
                      View All Tasks →
                    </button>
                  </div>
                )}

                {/* Alerts Tab */}
                {activeTab === 'alerts' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Project Insights</h3>
                    {project.insights && project.insights.length > 0 ? (
                      <div className="space-y-3">
                        {project.insights.map((insight) => (
                          <div
                            key={insight.id}
                            className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                          >
                            <AlertCircle className={`w-5 h-5 mt-0.5 ${
                              insight.severity === 'high' ? 'text-red-500' :
                              insight.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                            }`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 capitalize">
                                {insight.insight_type}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(insight.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No insights available</p>
                    )}
                  </div>
                )}

                {/* Team Tab */}
                {activeTab === 'team' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Team Members</h3>
                    {teamMembers.length === 0 ? (
                      <p className="text-gray-500">No team members</p>
                    ) : (
                      <div className="space-y-3">
                        {teamMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-medium">
                                {member.user_name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{member.user_name || 'Unknown'}</p>
                                <p className="text-sm text-gray-500">{member.user_email}</p>
                              </div>
                            </div>
                            <span className="text-sm text-gray-600 capitalize">{member.role}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sprint Progress */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Sprint Progress</h3>
                <span className="text-2xl font-bold text-purple-600">
                  {sprintProgress.percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 h-3 rounded-full mb-2">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${sprintProgress.percentage}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {sprintProgress.completed} of {sprintProgress.total} tasks completed
              </p>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent activity</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="text-sm">
                      <p className="text-gray-700">{activity.message}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;

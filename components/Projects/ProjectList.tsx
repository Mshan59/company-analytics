"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Sparkles, FileCheck, Search } from 'lucide-react';
import { fetchProjects } from '@/lib/api/projectsApi';
import { Project } from '@/models/project';
import ProjectCard from '@/components/Projects/ProjectCard';
import CreateProjectModal from '@/components/Projects/CreateProjectModal';
import { useRouter } from 'next/navigation';

const ProjectList: React.FC = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch projects
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters: any = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      if (searchQuery) filters.search = searchQuery;

      const data = await fetchProjects(filters);
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [statusFilter, priorityFilter, searchQuery]);

  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`);
  };

  const handleProjectCreated = () => {
    setShowCreateModal(false);
    loadProjects(); // Reload projects
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Project List</h1>
          <div className="flex space-x-3">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center transition-colors">
              <Sparkles className="w-5 h-5 mr-2" />
              AI Project
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
              Finalize Specs
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center transition-colors">
              <FileCheck className="w-5 h-5 mr-2" />
              AI Summary
            </button>
          </div>
        </div>

        {/* Search and Filter section */}
        <div className="mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filters */}
          <div className="flex space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="on-track">On Track</option>
              <option value="at-risk">At Risk</option>
              <option value="blocked">Blocked</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            {(statusFilter || priorityFilter || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('');
                  setPriorityFilter('');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No projects found</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Project
            </button>
          </div>
        )}

        {/* Project grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project.id)}
              />
            ))}
          </div>
        )}

        {/* Project count */}
        {!loading && projects.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleProjectCreated}
        />
      )}
    </div>
  );
};

export default ProjectList;

// import MinimalComingSoon from '@/components/comingsoon'
// import DefaultLayout from '@/components/Layouts/DefaultLayout'
// import { NextPage } from 'next'
// const Page: NextPage = () => {
//   return <div>
//    <DefaultLayout>
//      <MinimalComingSoon />
//     </DefaultLayout>
//   </div>
// }

// export default Page


"use client";

import DefaultLayout from '@/components/Layouts/DefaultLayout';
import { NextPage } from 'next';
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
// import { User } from "@/models/user";

// Update User type to match the database schema
type User = {
  id: string | number;
  name: string;
  email: string;
  role: 'developer' | 'HR' | 'Sr developer' | 'Project manager';
  added_on: string;
};

type FormDataType = {
  id: string | number;
  name: string;
  email: string;
  role: string;
};

const Page: NextPage = () => {
  const [teams, setTeams] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    id: "",
    name: "",
    email: "",
    role: "developer", // Default role
  });

  // Role options based on the ENUM in the database
  const roleOptions = ['developer', 'HR', 'Sr developer', 'Project manager'];

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/teams");
      if (!response.ok) throw new Error("Failed to fetch teams");
      const data: User[] = await response.json();
      setTeams(data);
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({ id: "", name: "", email: "", role: "developer" });
    setCurrentUser(null);
  };

  const openForm = (user: User | null = null) => {
    if (user) {
      setFormData({ 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: user.role
      });
      setCurrentUser(user);
    } else {
      resetForm();
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const method = currentUser ? "PUT" : "POST";
    const endpoint = currentUser ? `/api/teams/${formData.id}` : "/api/teams";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to save user");

      fetchTeams();
      closeForm();
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string | number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/teams/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete user");

      fetchTeams();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredTeams = teams.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DefaultLayout>
      <div className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Teams Management</h1>
          <button
            onClick={() => openForm()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
          >
            Add New Team Member
          </button>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Search by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* User Form Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentUser ? "Edit Team Member" : "Add New Team Member"}
                </h2>
                <button onClick={closeForm} className="text-gray-500 hover:text-gray-700">
                  ✖️
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  placeholder="Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  placeholder="Email"
                  required
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                  required
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end space-x-4">
                  <button type="button" onClick={closeForm} className="px-4 py-2 text-gray-600 border rounded-md">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">
                    {currentUser ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* User Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {isLoading ? (
            <p className="text-center p-6">Loading...</p>
          ) : filteredTeams.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added On</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTeams.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${user.role === 'developer' ? 'bg-blue-100 text-blue-800' : ''}
                        ${user.role === 'HR' ? 'bg-green-100 text-green-800' : ''}
                        ${user.role === 'Sr developer' ? 'bg-purple-100 text-purple-800' : ''}
                        ${user.role === 'Project manager' ? 'bg-amber-100 text-amber-800' : ''}
                      `}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.added_on)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => openForm(user)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                      <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center p-6">No team members found.</p>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Page;
import React, { useEffect, useState } from 'react'
import API from '../api/axios'
import { Link } from 'react-router-dom'

const EmployeeList = () => {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchuser()
  }, [])

  const fetchuser = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/get-user");
      setUsers(res.data.allUser || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to remove this employee?")) {
      try {
        await API.delete(`/delete-user/${id}`);
        // Optimistic UI update for snappier feel
        setUsers(users.filter(user => user._id !== id));
      } catch (error) {
        console.error("Failed to delete user", error);
        fetchuser(); // Re-fetch on error to ensure sync
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header Area */}
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Team Members</h2>
            <p className="mt-1 text-sm text-gray-500">
              A list of all employees including their name and role.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link
              to="/add"
              className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gray-900 hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Employee
            </Link>
          </div>
        </div>

        {/* List Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            // Elegant Loading State
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-sm text-gray-500 font-medium animate-pulse">Loading team data...</p>
            </div>
          ) : users.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {users.map((user) => (
                <li key={user._id} className="group hover:bg-gray-50 transition-colors duration-200">
                  <div className="px-6 py-5 flex items-center justify-between">

                    {/* User Info - Now Clickable */}
                    <Link to={`/employee/${user._id}`} className="flex items-center min-w-0 gap-4 group/info flex-1 cursor-pointer">
                      {/* Avatar Placeholder */}
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center group-hover/info:border-indigo-300 transition-colors">
                        <span className="text-gray-600 font-semibold text-lg group-hover/info:text-indigo-600 transition-colors">
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate group-hover/info:text-indigo-600 transition-colors">
                          {user.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100/50">
                            {user.designation || 'No Role Assigned'}
                          </span>
                        </div>
                      </div>
                    </Link>

                    {/* Actions */}
                    <div className="ml-4 flex-shrink-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 sm:opacity-100 gap-2">

                      <Link
                        to={`/employee/${user._id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none"
                        title="View Profile"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>

                      <Link
                        to={`/edit/${user._id}`}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors focus:outline-none"
                        title="Edit Employee"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>

                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                        title="Remove employee"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            // Elegant Empty State
            <div className="text-center py-16 px-6">
              <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">No employees</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new team member.</p>
              <div className="mt-6">
                <Link to="/add" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800">
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add your first employee
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeList;
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';

const Emp = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchEmployeeDetails();
    }, [id]);

    const fetchEmployeeDetails = async () => {
        setIsLoading(true);
        try {
            const res = await API.get("/get-user");
            const users = res.data.allUser || [];
            const foundUser = users.find(u => u._id === id || u.userId === id);

            if (foundUser) {
                setEmployee(foundUser);
            } else {
                setError("Employee record couldn't be located in the database.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load employee details due to a server error.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-gray-500 font-medium">Retrieving employee profile...</p>
            </div>
        );
    }

    if (error || !employee) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
                        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor: ">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Profile Not Found</h2>
                    <p className="mt-2 text-base text-gray-500">{error}</p>
                    <div className="mt-8">
                        <Link to="/" className="inline-flex items-center px-5 py-2.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                            Return to Directory
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Value formatting helper
    const renderValue = (val, isCurrency = false, isPercent = false) => {
        if (val === undefined || val === null || val === "") return <span className="text-gray-400 italic">Not Assigned</span>;
        if (isCurrency) return `₹${Number(val).toLocaleString('en-IN')}`;
        if (isPercent) return `${val}%`;
        return val;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Navigation & Header */}
                <div className="mb-8 flex items-center justify-between">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group">
                        <svg className="w-5 h-5 mr-1.5 text-gray-400 group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Team Directory
                    </Link>
                    <Link
                        to={`/edit/${id}`}
                        className="inline-flex items-center text-sm font-medium text-white hover:text-white transition-colors bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg shadow-sm"
                    >
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Profile
                    </Link>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                    {/* Top Banner & Avatar Region */}
                    <div className="bg-gradient-to-r from-gray-900 to-slate-800 h-32 w-full relative"></div>

                    {/* Adjusted layout: pull avatar up, but keep text cleanly below it */}
                    <div className="px-6 sm:px-10 pb-8 relative -mt-16">
                        <div className="flex flex-col">

                            {/* Large Avatar */}
                            <div className="h-32 w-32 rounded-full border-4 border-white bg-gradient-to-br from-indigo-100 to-white shadow-md flex items-center justify-center relative bg-white">
                                <span className="text-5xl font-bold text-indigo-700">
                                    {employee.name ? employee.name.charAt(0).toUpperCase() : '?'}
                                </span>
                                {/* Status Indicator */}
                                <span className="absolute bottom-2 right-3 h-5 w-5 bg-green-400 border-4 border-white rounded-full"></span>
                            </div>

                            {/* Text safely below the banner on white background */}
                            <div className="mt-4 pb-2">
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    {employee.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100/60">
                                        {employee.designation || "Employee"}
                                    </span>
                                    <span className="flex items-center text-sm text-gray-500 font-mono bg-gray-50 px-3 py-1 rounded-full border border-gray-100/80">
                                        ID: <span className="text-gray-900 font-semibold ml-1.5">{employee.userId}</span>
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="border-t border-gray-100">
                        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">

                            {/* Group 1: General Info */}
                            <div className="p-6 sm:p-8 border-b sm:border-b-0 sm:border-r border-gray-100">
                                <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                    </svg>
                                    Personal Details
                                </h3>
                                <div className="space-y-5">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">Full Name</dt>
                                        <dd className="mt-1 text-sm font-semibold text-gray-900">{renderValue(employee.name)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">Employee ID</dt>
                                        <dd className="mt-1 text-sm font-semibold text-gray-900">{renderValue(employee.userId)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">Joined Date</dt>
                                        <dd className="mt-1 text-sm font-semibold text-gray-900">{renderValue(employee.joiningDate)}</dd>
                                    </div>
                                </div>
                            </div>

                            {/* Group 2: Salary Base */}
                            <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/50">
                                <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Remuneration
                                </h3>
                                <div className="space-y-5">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">Basic Salary</dt>
                                        <dd className="mt-1 text-sm font-semibold text-gray-900">{renderValue(employee.basicSalary, true)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">HRA Allowance</dt>
                                        <dd className="mt-1 text-sm font-semibold text-gray-900">{renderValue(employee.hraPercentage, false, true)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">DA Allowance</dt>
                                        <dd className="mt-1 text-sm font-semibold text-gray-900">{renderValue(employee.daPercentage, false, true)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">Other Allowances</dt>
                                        <dd className="mt-1 text-sm font-semibold text-gray-900">{renderValue(employee.otherAllowancePercentage, false, true)}</dd>
                                    </div>
                                </div>
                            </div>

                            {/* Group 3: Deductions */}
                            <div className="p-6 sm:p-8">
                                <h3 className="text-base font-semibold text-gray-900 mb-6 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                                    </svg>
                                    Statutory Deductions
                                </h3>
                                <div className="space-y-5">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">Provident Fund (PF)</dt>
                                        <dd className="mt-1 text-sm font-semibold text-red-600">{renderValue(employee.pfPercentage, false, true)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 whitespace-nowrap">State Insurance (ESI)</dt>
                                        <dd className="mt-1 text-sm font-semibold text-red-600">{renderValue(employee.esiPerscentage, false, true)}</dd>
                                    </div>
                                </div>
                            </div>

                        </dl>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Emp;
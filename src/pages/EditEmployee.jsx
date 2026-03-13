import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const EditEmployee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const [form, setForm] = useState({
        name: "",
        userId: "",
        designation: "",
        joiningDate: "",
        basicSalary: "",
        hraPercentage: "",
        daPercentage: "",
        otherAllowancePercentage: "",
        pfPercentage: "",
        esiPerscentage: "",
    });

    useEffect(() => {
        fetchEmployeeDetails();
    }, [id]);

    const fetchEmployeeDetails = async () => {
        setIsLoading(true);
        try {
            const res = await API.get("/get-user");
            const users = res.data.allUser || [];
            const foundUser = users.find((u) => u._id === id || u.userId === id);

            if (foundUser) {
                // Format date to YYYY-MM-DD for input type="date" if it exists
                let formattedDate = "";
                if (foundUser.joiningDate) {
                    const d = new Date(foundUser.joiningDate);
                    if (!isNaN(d.getTime())) {
                        formattedDate = d.toISOString().split("T")[0];
                    } else {
                        formattedDate = foundUser.joiningDate; // fallback if it's already a string like "2024-01-01"
                    }
                }

                setForm({
                    name: foundUser.name || "",
                    userId: foundUser.userId || "",
                    designation: foundUser.designation || "",
                    joiningDate: formattedDate,
                    basicSalary: foundUser.basicSalary || "",
                    hraPercentage: foundUser.hraPercentage || "",
                    daPercentage: foundUser.daPercentage || "",
                    otherAllowancePercentage: foundUser.otherAllowancePercentage || "",
                    pfPercentage: foundUser.pfPercentage || "",
                    esiPerscentage: foundUser.esiPerscentage || "",
                });
            } else {
                setErrorMsg("Employee record not found.");
            }
        } catch (err) {
            console.error(err);
            setErrorMsg("Failed to load employee details.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            await API.put(`/update-user/${id}`, form);
            setSuccessMsg("Employee updated successfully!");
            // Navigate back to the profile or list after a short delay
            setTimeout(() => navigate(`/employee/${id}`), 1500);
        } catch (err) {
            setErrorMsg(err.response?.data?.message || err.message || "Failed to update employee");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper for consistent input styling
    const inputTheme = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm";
    const labelTheme = "block text-sm font-medium text-gray-700";

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mb-4"></div>
                <p className="text-gray-500 font-medium">Retrieving employee data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 py-10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Edit Employee</h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Update details for {form.name} ({form.userId}).
                        </p>
                    </div>
                    <Link
                        to={`/employee/${id}`}
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Profile
                    </Link>
                </div>

                {/* Notifications */}
                {successMsg && (
                    <div className="mb-6 rounded-md bg-green-50 p-4 border border-green-200">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{successMsg}</p>
                            </div>
                        </div>
                    </div>
                )}

                {errorMsg && (
                    <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{errorMsg}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <form onSubmit={handleSubmit} className="divide-y divide-gray-200">

                        {/* Section 1: Personal Info */}
                        <div className="p-6 sm:p-8">
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-6">Personal Information</h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className={labelTheme}>Full Name <span className="text-red-500">*</span></label>
                                    <input type="text" id="name" name="name" required value={form.name} onChange={handleChange} className={inputTheme} placeholder="John Doe" />
                                </div>
                                <div>
                                    <label htmlFor="userId" className={labelTheme}>Employee ID <span className="text-red-500">*</span></label>
                                    <input type="text" id="userId" name="userId" required value={form.userId} onChange={handleChange} className={inputTheme} placeholder="EMP-001" disabled />
                                    <p className="mt-1 text-xs text-gray-500">Employee ID cannot be modified.</p>
                                </div>
                                <div>
                                    <label htmlFor="designation" className={labelTheme}>Designation <span className="text-red-500">*</span></label>
                                    <input type="text" id="designation" name="designation" required value={form.designation} onChange={handleChange} className={inputTheme} placeholder="Software Engineer" />
                                </div>
                                <div>
                                    <label htmlFor="joiningDate" className={labelTheme}>Joining Date <span className="text-red-500">*</span></label>
                                    <input type="date" id="joiningDate" name="joiningDate" required value={form.joiningDate} onChange={handleChange} className={inputTheme} />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Salary Info */}
                        <div className="p-6 sm:p-8 bg-gray-50/50">
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-6">Salary & Allowances Settings</h3>

                            <div className="mb-8">
                                <label htmlFor="basicSalary" className={labelTheme}>Basic Salary <span className="text-red-500">*</span></label>
                                <div className="mt-1 relative rounded-md shadow-sm sm:w-1/2">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">₹</span>
                                    </div>
                                    <input type="number" id="basicSalary" name="basicSalary" required value={form.basicSalary} onChange={handleChange} className={`${inputTheme} pl-7`} placeholder="50000" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-3">
                                <div>
                                    <label htmlFor="hraPercentage" className={labelTheme}>HRA (%)</label>
                                    <input type="number" id="hraPercentage" name="hraPercentage" value={form.hraPercentage} onChange={handleChange} className={inputTheme} placeholder="0" />
                                </div>
                                <div>
                                    <label htmlFor="daPercentage" className={labelTheme}>DA (%)</label>
                                    <input type="number" id="daPercentage" name="daPercentage" value={form.daPercentage} onChange={handleChange} className={inputTheme} placeholder="0" />
                                </div>
                                <div>
                                    <label htmlFor="otherAllowancePercentage" className={labelTheme}>Other Allowances (%)</label>
                                    <input type="number" id="otherAllowancePercentage" name="otherAllowancePercentage" value={form.otherAllowancePercentage} onChange={handleChange} className={inputTheme} placeholder="0" />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Deductions */}
                        <div className="p-6 sm:p-8">
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-6">Deductions</h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="pfPercentage" className={labelTheme}>Provident Fund (PF %)</label>
                                    <input type="number" id="pfPercentage" name="pfPercentage" value={form.pfPercentage} onChange={handleChange} className={inputTheme} placeholder="0" />
                                </div>
                                <div>
                                    <label htmlFor="esiPerscentage" className={labelTheme}>State Insurance (ESI %)</label>
                                    <input type="number" id="esiPerscentage" name="esiPerscentage" value={form.esiPerscentage} onChange={handleChange} className={inputTheme} placeholder="0" />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="px-6 py-5 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-4 sm:px-8">
                            <Link to={`/employee/${id}`} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors shadow-sm">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex justify-center flex-shrink-0 items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Updating...
                                    </>
                                ) : (
                                    "Update Employee"
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditEmployee;

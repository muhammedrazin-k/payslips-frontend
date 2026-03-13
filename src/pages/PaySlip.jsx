import React, { useEffect, useState } from 'react'
import API from '../api/axios';
import jsPDF from 'jspdf';

const PaySlip = () => {
  const [employees, setEmployees] = useState([]);
  const [userId, setUserId] = useState("");
  const [leaveCount, setLeaveCount] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingSlip, setIsGeneratingSlip] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/get-user");
      setEmployees(res.data.allUser || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generate = async () => {
    setErrorMsg("");
    if (!userId) {
      setErrorMsg("Please select an employee first.");
      return;
    }
    if (leaveCount === "" || Number(leaveCount) < 0) {
      setErrorMsg("Please enter a valid positive leave count.");
      return;
    }

    setIsGeneratingSlip(true);
    try {
      const res = await API.post("/generate-payslip", { userId, leaveCount: Number(leaveCount) });
      setData(res.data.salaryDetails);
    } catch (error) {
      console.error("Error generating slip:", error);
      setErrorMsg("Failed to calculate salary. Please try again.");
    } finally {
      setIsGeneratingSlip(false);
    }
  };

  const downloadPDF = () => {
    if (!data) return;
    const doc = new jsPDF();

    // Aesthetic PDF generation (Basic but structured)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Official Payslip", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Employee Name: ${data.name || "Unknown"}`, 20, 40);
    doc.text(`Employee ID: ${userId}`, 20, 50);
    doc.text(`Leaves Taken: ${leaveCount}`, 20, 60);

    doc.line(20, 70, 190, 70);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Net Salary: ${data.netSalary || "0.00"} INR`, 20, 90);

    doc.save(`${userId}_Payslip.pdf`);
  };

  const inputTheme = "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 shadow-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm bg-white";
  const labelTheme = "block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Generate Payslips</h2>
          <p className="mt-1 text-sm text-gray-500">
            Select an employee and input their leave count to instantly calculate and export their monthly payslip.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200 w-full sm:w-2/3">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3"><p className="text-sm font-medium text-red-800">{errorMsg}</p></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Form Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Calculation Details
              </h3>

              <div className="space-y-6">
                <div>
                  <label htmlFor="employee" className={labelTheme}>Select Employee <span className="text-red-500">*</span></label>
                  <select
                    id="employee"
                    className={inputTheme}
                    value={userId}
                    onChange={(e) => {
                      setUserId(e.target.value);
                      setData(null); // Reset slip on user change
                    }}
                  >
                    <option value="">-- Choose an employee --</option>
                    {isLoading ? (
                      <option disabled>Loading directory...</option>
                    ) : (
                      employees.length > 0 ? (
                        employees.map((emp) => (
                          <option key={emp._id} value={emp.userId}>
                            {emp.name} ({emp.userId})
                          </option>
                        ))
                      ) : (
                        <option disabled>No employees found in system</option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="leaveCount" className={labelTheme}>Unpaid Leaves Taken <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    id="leaveCount"
                    min="0"
                    placeholder="e.g. 2"
                    className={inputTheme}
                    value={leaveCount}
                    onChange={(e) => {
                      setLeaveCount(e.target.value);
                      setData(null); // Reset slip on leave change
                    }}
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Leaves exceeding the allowed quota will be deducted from the basic salary.
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={generate}
                    disabled={isGeneratingSlip || isLoading}
                    className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-900 hover:bg-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingSlip ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Calculating...
                      </>
                    ) : (
                      "Calculate Payslip"
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Preview & Action */}
          <div className="lg:col-span-7">
            {data ? (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden group">
                {/* Visual Top Banner */}
                <div className="h-3 bg-gray-900 w-full"></div>

                <div className="p-8 sm:p-10">
                  <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Salary Statement</h3>
                      <p className="text-sm text-gray-500 mt-1">Generated electronically</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{data.name || "Employee"}</p>
                      <p className="text-sm text-gray-500 font-mono mt-1">{userId}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 rounded-lg p-6 mb-8 border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-600">Net Payable Amount</span>
                      <span className="text-3xl font-black tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
                        ₹{data.netSalary ? Number(data.netSalary).toLocaleString('en-IN') : "0.00"}
                      </span>
                    </div>
                    <p className="text-xs text-right text-gray-500 mt-2">
                      * Calculated based on {leaveCount || 0} leaves deduction if applicable.
                    </p>
                  </div>

                  <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-100">
                    <button
                      onClick={downloadPDF}
                      className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all"
                    >
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Extract to PDF
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Empty State placeholder for Right Column
              <div className="h-full bg-transparent border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-12 text-center">
                <div className="mx-auto h-16 w-16 text-gray-300 mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900">No calculation generated</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">Fill out the details on the left and click calculate to generate a downloadable salary statement.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default PaySlip;
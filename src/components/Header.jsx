import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Employees", path: "/" },
    { name: "Add Employee", path: "/add" },
    { name: "Payslips", path: "/payslip" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop & Tablet Layout */}
        <div className="flex h-20 items-center justify-between">

          {/* Brand / Heading */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Payslip<span className="text-gray-500 font-normal ml-1.5">Management</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-10 lg:gap-14 h-full">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center h-full text-sm font-medium transition-colors ${isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-900"
                    }`}
                >
                  {link.name}
                  {/* Bottom indicator for active link */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gray-900" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Placeholder to balance the flex layout on large screens */}
          <div className="hidden sm:block w-[100px] lg:w-[150px]"></div>

        </div>

        {/* Mobile Navigation (Visible only on small screens) */}
        <div className="sm:hidden flex items-center gap-2 pb-4 pt-2 overflow-x-auto scrollbar-hide">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium whitespace-nowrap px-4 py-2 rounded-md ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-50"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;

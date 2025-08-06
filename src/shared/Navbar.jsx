import React from 'react';
import { Link, NavLink } from 'react-router';
import Logo from './Logo/Logo';
import './navbar.css';

const Navbar = () => {

    // nav links
    const navLinks = <>
        <div className='flex md:flex-row flex-col gap-4'>
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/transportSchedule">Transport Schedule</NavLink></li>
            <li><NavLink to="/transportLocation">Find Location</NavLink></li>
            <li><NavLink to="/borrow-bus">Apply for Bus</NavLink></li>
            <li><NavLink to="/notice">Notice</NavLink></li>
            <li><NavLink to="/dashboard">Dashboard</NavLink></li>
        </div>

    </>
    return (
        <div className="bg-base-100 shadow-sm sticky top-0 z-50">
            <div className='navbar max-w-screen-xl mx-auto'>
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {
                                navLinks
                            }
                        </ul>
                    </div>

                    <Logo></Logo>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {
                            navLinks
                        }
                    </ul>
                </div>
                <div className="navbar-end space-x-4">
                    <NavLink to="/login" className="btn">Login</NavLink>
                    <NavLink to="/register" className="btn">Register</NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
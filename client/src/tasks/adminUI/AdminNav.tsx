import React, { Component } from 'react'
import { NavLink, Link } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

var first_name = window.localStorage.getItem('first_name');
var last_name = window.localStorage.getItem('last_name');

export class AdminNav extends Component {

    logout = () => {
        localStorage.removeItem("thisToken");
    }

    render() {
        return (
            <div>
                <nav className="navbar sticky-top navbar-expand-md navbar-dark bg-dark">

                    <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2">
                        <ul className="navbar-nav mr-auto">
                            <li>
                                <NavLink to="/AdminHome" activeClassName="active-link" className="nav-link">Home</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Chat
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <div className="dropdown-item"><NavLink style={{ color: "black" }} to="/joinChat" activeClassName="active-link" className="nav-link">Chat</NavLink></div>
                                    <div className="dropdown-item"> <NavLink style={{ color: "black" }} to="/chatHistory" activeClassName="active-link" className="nav-link">Chat History</NavLink></div>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Courses
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <div className="dropdown-item"><NavLink style={{ color: "black" }} to="/Courses" activeClassName="active-link" className="nav-link">Courses</NavLink></div>
                                    <div className="dropdown-item"> <NavLink style={{ color: "black" }} to="/sections" activeClassName="active-link" className="nav-link">Course Sections</NavLink></div>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Specialities
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <div className="dropdown-item"><NavLink style={{ color: "black" }} to="/Specialities" activeClassName="active-link" className="nav-link">Specialities</NavLink></div>
                                    <div className="dropdown-item"> <NavLink style={{ color: "black" }} to="/SpecManager" activeClassName="active-link" className="nav-link">Speciality Courses</NavLink></div>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Users
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <div className="dropdown-item"><NavLink style={{ color: "black" }} to="/UserManager" activeClassName="active-link" className="nav-link">Users</NavLink></div>
                                    <div className="dropdown-item"> <NavLink style={{ color: "black" }} to="/Registration" activeClassName="active-link" className="nav-link">Registration</NavLink></div>
                                </div>
                            </li>
                            <li>
                                <NavLink to="/holidayDates" activeClassName="active-link" className="nav-link">Holidays</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Flows
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                    <div className="dropdown-item"><NavLink style={{ color: "black" }} to="/flows" activeClassName="active-link" className="nav-link">Flows</NavLink></div>
                                    <div className="dropdown-item"> <NavLink style={{ color: "black" }} to="/flowStudent" activeClassName="active-link" className="nav-link">Flow Students</NavLink></div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="mx-auto order-0">
                        <a className="navbar-brand mx-auto">Hello, {first_name + " "}{last_name}</a>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>

                    <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                        <ul className="navbar-nav ml-auto">
                            <li style={{marginRight: "10px"}}>
                                <NavLink to="/Forum" activeClassName="active-link" className="nav-link">Forum</NavLink>
                            </li>
                            <li>
                                <Link to="/" className="navbar-brand" onClick={this.logout}>Logout</Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        );
    };
}

export default AdminNav

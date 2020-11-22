import React, { Component } from 'react'
import { Link, NavLink } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

var first_name = window.localStorage.getItem('first_name');
var last_name = window.localStorage.getItem('last_name');

export class LecturerNav extends Component {   
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
                                <NavLink to="/LecturerHome" activeClassName="active-link" className="nav-link">Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/joinChat" activeClassName="active-link" className="nav-link">Chat</NavLink>
                            </li>
                            <li>
                                <NavLink to="/Calendar"  activeClassName="active-link" className="nav-link">Lesson Schedule</NavLink>
                            </li>
                            <li>
                                <NavLink to="/MyCourses"  activeClassName="active-link" className="nav-link">My Courses</NavLink>
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

export default LecturerNav

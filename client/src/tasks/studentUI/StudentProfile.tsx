import React, { Component } from 'react'
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import CSS from 'csstype';

import "../../App.css";
import StudentNav from './StudentNav';


var user_id = (window.localStorage.getItem('user_id'));

/* eslint-disable no-useless-concat */
const thisToken = localStorage.getItem("thisToken");

type RegData = {
    status: string;
    data: Array<Reg>;
};
type Reg = {
    user_id: number;
    personal_id: number;
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    phone: string;
    image_path: string;
    flow_id: number;
    speciality_id: number;
    name: string;
};

interface Props { }
interface State {
    registrations: Array<Reg>;
    user_id: number;
    personal_id: number;
    first_name: string;
    last_name: string;
    role: string;
    email: string;
    phone: string;
    image_path: string;
    flow_id: number;
    speciality_id: number;
    name: string;
}

export class StudentProfile extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            registrations: [],
            user_id: 0,
            personal_id: 0,
            first_name: "",
            last_name: "",
            role: "",
            email: "",
            phone: "",
            image_path: "",
            flow_id: 0,
            speciality_id: 0,
            name: ""
        };
    }

    refreshList = () => {
        fetch('https://casul-campus.herokuapp.com/Registration/userProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                user_id: user_id,
            })
        })
            .then(res => res.json())
            .then((jsonRes: RegData) => {
                if (jsonRes.data) {
                    this.setState({
                        user_id: jsonRes.data[0].user_id,
                        personal_id: jsonRes.data[0].personal_id,
                        first_name: jsonRes.data[0].first_name,
                        last_name: jsonRes.data[0].last_name,
                        role: jsonRes.data[0].role,
                        email: jsonRes.data[0].email,
                        phone: jsonRes.data[0].phone,
                        image_path: jsonRes.data[0].image_path,
                        flow_id: jsonRes.data[0].flow_id,
                        speciality_id: jsonRes.data[0].speciality_id,
                        name: jsonRes.data[0].name
                    });
                } else {
                    alert('Session expired. Logout and login again.');
                    window.location.href = "sessionEnd"
                }
            })
            .catch(error => console.log(error));
    }

    componentDidMount() {
        if (!localStorage.getItem("thisToken")) {
            window.location.href = "sessionEnd"
        }
        if (localStorage.getItem("userRole") !== "student"
            && localStorage.getItem("userRole") !== "demoStudent") {
            if (localStorage.getItem("thisToken")) {
                localStorage.removeItem("thisToken")
            };
            alert("unauthorized access")
            window.location.href = "sessionEnd"
        }
        this.refreshList();
    };



    render() {
        return (
            <div>
                <StudentNav />
                <br />
                <br />
                <br />
                <div>
                    <div className="container-fluid">
                        <div className="row extra_margin">
                            <div className="col-md-4">
                                <div className="text-center">
                                    <img src={this.state.image_path} style={{ width: '300px', height: '250px' }} />
                                    <h2>{this.state.first_name}{" "}{this.state.last_name}</h2>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <p className="lead extra_margin">Personal Information</p>
                                <hr />
                                <h4><b>first name: </b>{this.state.first_name}</h4>
                                <h4><b>last name: </b>{this.state.last_name}</h4>
                                <h4><b>role: </b>{this.state.role}</h4>
                                <h4><b>email: </b>{this.state.email}</h4>
                                <h4><b>phone: </b>{this.state.phone}</h4>
                                <h4><b>ID: </b>{this.state.personal_id}</h4>
                            </div>
                            <div className="col-md-4">
                                <p className="lead extra_margin">Academic Information</p>
                                <hr />
                                <h4><b>Flow: </b>{this.state.flow_id}</h4>
                                <h4><b>speciality: </b>{this.state.name}</h4>
                                <h4><b>speciality id: </b>{this.state.speciality_id}</h4>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default StudentProfile

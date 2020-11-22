import React, { Component } from 'react'
import "../../index.css"
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import AdminNav from './AdminNav';

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
    hash: string;
    email: string;
    phone: string
};
interface Props { }
interface State {
    registrations: Array<Reg>;
    user_id: number;
    personal_id: number;
    first_name: string;
    last_name: string;
    role: string;
    hash: string;
    email: string;
    phone: string;
    image_path: string;
    uploadImg: any;
}


var userArr: string | any[] = [];
const thisToken = localStorage.getItem("thisToken");
const rid = localStorage.getItem("rid");

/* eslint-disable no-useless-concat */

export class Registration extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            registrations: [],
            user_id: 0,
            personal_id: 0,
            first_name: "",
            last_name: "",
            role: "",
            hash: "",
            email: "",
            phone: "",
            image_path: "",
            uploadImg: null
        };

    }

    handlePersonalIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            personal_id: e.target.value
        })
    };

    handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            first_name: e.target.value
        })
    };

    handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            last_name: e.target.value
        })
    };

    handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            role: e.target.value
        })
    };

    handleHashChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            hash: e.target.value
        })
    };

    handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            email: e.target.value
        })
    };

    handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            phone: e.target.value
        })
    };

    handleUploadImgChange = (event: any) => {
        this.setState({
            uploadImg: event.target.files[0]
        })
    };


    addUser = (e: { preventDefault: () => void; }) => {

        e.preventDefault();

        if (this.state.first_name === "") {
            return alert("first name must be completed");
        }
        if (this.state.personal_id === 0) {
            return alert("id must be completed");
        }
        if (this.state.hash === "") {
            return alert("hash must be completed");
        }
        if (this.state.email === "") {
            return alert("email must be completed");
        }

        if (this.state.role === "") {
            return alert("role must be completed");
        }

        if (this.state.phone === "") {
            return alert("phone must be completed");
        }

        if (this.state.uploadImg === null) {
            return alert("file must be selected");
        }

        for (var i = 0; i < userArr.length; i++) {
            if (userArr[i].email.toLowerCase() === this.state.email.toLowerCase()) {
                alert("username/email already exists!");
                return;
            }
        }

        for (i = 0; i < userArr.length; i++) {
            if (userArr[i].personal_id === +this.state.personal_id) {
                alert("id already exists!");
                return;
            }
        }

        fetch('https://casul-campus.herokuapp.com/registration/addNewUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                personal_id: this.state.personal_id,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                role: this.state.role,
                hash: this.state.hash,
                email: this.state.email,
                phone: this.state.phone,
                uploadImg: this.state.uploadImg,
                image_path: this.state.image_path,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to add new users.")
                }
                if (res.ok) {
                    document.getElementById("message")!.innerHTML = ("The following user has been added successfully:" + "<br/><br/>"
                        + "<p><b>first name: </b>" + this.state.first_name + "</p>"
                        + "<p><b>last name: </b>" + this.state.last_name + "</p>"
                        + "<p><b>username: </b>" + this.state.email + "</p>"
                        + "<p><b>role: </b>" + this.state.role + "</p>"
                        + "<p><b>ID: </b>" + this.state.personal_id) + "</p>"
                        + "<div><img src='" + this.state.image_path + "'"
                        + " width='193' height='130'/></div>"
                    this.componentDidMount();
                }
            })
            .catch(error => console.log(error));
    };

    addFile = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (this.state.uploadImg === null) {
            return alert("file must be selected");
        }
        const fd = new FormData();
        fd.append('userFile', this.state.uploadImg, this.state.uploadImg.name);
        fetch('https://casul-campus.herokuapp.com/registration/addFile', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + rid
            },
            body: fd
        })
            .then(res => {
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to upload files.");
                    return;
                }
                res.json()
                    .then((jsonRes) => {
                        var path = jsonRes.location;
                        this.setState({
                            image_path: path
                        })
                        this.addUser(e);
                    })
            })
            .catch(error => console.log(error));
    };

    clearForm = () => {
        document.getElementById("message")!.innerHTML = "";
        var uploadField = document.getElementById("userFile")! as HTMLInputElement;
        uploadField.value = "";

        var roleField = document.getElementById("roleField")! as HTMLSelectElement;
        roleField.value = "";

        this.setState({
            registrations: [],
            personal_id: 0,
            first_name: "",
            last_name: "",
            role: "",
            hash: "",
            email: "",
            phone: "",
            image_path: "",
            uploadImg: null
        });
    };

    showUserName = (reg: Reg) => {
        this.setState({
            user_id: reg.user_id,
            personal_id: reg.personal_id,
            first_name: reg.first_name,
            last_name: reg.last_name,
            role: reg.role,
            hash: reg.hash,
            email: reg.email,
            registrations: this.state.registrations
        });
    };


    componentDidMount() {
        if (!localStorage.getItem("thisToken")) {
            window.location.href = "sessionEnd"
        }
        if (localStorage.getItem("userRole") !== "admin"
            && localStorage.getItem("userRole") !== "demoAdmin") {
            if (localStorage.getItem("thisToken")) {
                localStorage.removeItem("thisToken")
            };
            alert("unauthorized access")
            window.location.href = "sessionEnd"
        }

        fetch('https://casul-campus.herokuapp.com/registration/checkUserExist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
            })
        })
            .then(res => res.json())
            .then((jsonRes) => {
                userArr = jsonRes.data;
            })
            .catch(error => console.log(error));
    };

    render() {
        return (
            <div>
                <AdminNav />
                <br />
                <br />
                <div className="card card-body bg-white w-100">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card-body bg-light">
                                <form name="formid">
                                    <h3>Registration</h3>

                                    <div className="form-group">
                                        <label htmlFor="nameField">First Name</label>
                                        <input type="text"
                                            className="form-control"
                                            placeholder="enter first name"
                                            value={this.state.first_name}
                                            onChange={this.handleFirstNameChange} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="nameField">Last Name</label>
                                        <input type="text"
                                            className="form-control"
                                            placeholder="enter last name"
                                            value={this.state.last_name}
                                            onChange={this.handleLastNameChange} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="nameField">Username</label>
                                        <input type="email"
                                            className="form-control"
                                            placeholder="enter username"
                                            value={this.state.email}
                                            onChange={this.handleEmailChange} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="nameField">Password</label>
                                        <input type="password"
                                            className="form-control"
                                            placeholder="enter password"
                                            value={this.state.hash}
                                            onChange={this.handleHashChange} />
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card-body bg-light">
                                <form name="formid">

                                    <div className="form-group">
                                        <label htmlFor="roleField">Select Role</label>
                                        <select id="roleField" className="select-css" onChange={this.handleRoleChange}>
                                            <option value="">click to select role</option>
                                            <option value="lecturer">lecturer</option>
                                            <option value="student">student</option>
                                            <option value="admin">administrator</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="phoneField">Phone Number</label>
                                        <input type="text"
                                            className="form-control"
                                            placeholder="enter phone number"
                                            value={this.state.phone}
                                            onChange={this.handlePhoneChange} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="idField">ID</label>
                                        <input type="text"
                                            className="form-control"
                                            placeholder="enter ID"
                                            value={(this.state.personal_id === 0 ? "" : this.state.personal_id)}
                                            onChange={this.handlePersonalIdChange} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="uploadField">Upload Pic</label>
                                        <input type="file"
                                            id="userFile"
                                            name="userFile"
                                            className="form-control"
                                            placeholder=""
                                            onChange={this.handleUploadImgChange} />
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-lg btn-block"
                                        onClick={this.addFile}>Add User</button>

                                    <button type="button"
                                        className="btn btn-outline-primary mr-3"
                                        onClick={this.clearForm}>clear form</button>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card-body bg-light">
                                <h5 className="card-title">Add Students, Lecturers, and Admin</h5>
                                <p className="card-text">Confirmation will appear here following submission.</p>
                                <p className="card-text" id="message"></p>
                                <button type="button" className="btn btn-primary"
                                    onClick={this.clearForm}>clear form</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Registration


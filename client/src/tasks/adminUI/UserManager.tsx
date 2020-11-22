import React from 'react'
import "../../index.css"
import { Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import AdminNav from './AdminNav';
import CSS from 'csstype';
import { sortTable, sortTableNew, sortTableNewNumber } from '../sorts'

var profileStyle: CSS.Properties = {
    display: 'none'
}
var acadInfoStyle = {
    display: "inline"
}

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
    hash: string;
    newPassRepeat: string;
    email: string;
    phone: string;
    image_path: string;
    uploadImg: any;
    selected: boolean;
    flow_id: number;
    speciality_id: number;
    name: string;
}

const thisToken = localStorage.getItem("thisToken");
const rid = localStorage.getItem("rid");

class UserManager extends React.Component<Props, State> {
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
            newPassRepeat: "",
            email: "",
            phone: "",
            image_path: "",
            uploadImg: null,
            selected: false,
            flow_id: 0,
            speciality_id: 0,
            name: ""
        };
    }

    handleUploadImgChange = (event: any) => {
        console.log(event.target.files[0])
        this.setState({
            uploadImg: event.target.files[0]
        })
    };

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

    handleNewPassRepeatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            newPassRepeat: e.target.value
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

    findUser = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log("on");

        fetch('https://casul-campus.herokuapp.com/Registration/findUser', {
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
                phone: this.state.phone
            })
        })
            .then(res => res.json())
            .then((jsonRes: RegData) => {
                if (jsonRes.data) {
                    console.log("hello");
                    this.setState({
                        registrations: jsonRes.data
                    });
                    console.log(jsonRes.data);
                    //this.sortTable();
                    sortTable("myTable");
                    return false;
                } else {
                    alert('Session expired. Logout and login again.');
                    window.location.href = "sessionEnd"
                }
            })
            .catch(error => console.log(error));
    };


    deleteUser = () => {
        if (this.state.user_id === 0) {
            alert("Choose the user you would like to delete.")
            return;
        }
        fetch('https://casul-campus.herokuapp.com/campUser/deleteUser', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                user_id: this.state.user_id,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to delete users.")
                }
                if (res.ok) {
                    this.clearForm();
                }
            })
            .catch(error => console.log(error));
    };

    clearForm = () => {
        this.setState({
            registrations: [],
            personal_id: 0,
            first_name: "",
            last_name: "",
            role: "",
            hash: "",
            newPassRepeat: "",
            email: "",
            phone: "",
            image_path: "",
            uploadImg: null
        });
        if (document.getElementById("warning")) {
            var element = document.getElementById("warning");
            element!.parentNode!.removeChild(element!);
        }
        var selRole = document.getElementById("selRole") as HTMLSelectElement;
        selRole!.value = "";

        var uploadField = document.getElementById("userFile")! as HTMLInputElement;
        uploadField.value = "";


        profileStyle = {
            display: "none"
        }
    };

    updateUser = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (this.state.user_id === 0) {
            alert("Choose the user you would like to update.")
            return;
        }
        if (this.state.hash !== "") {
            if (this.state.hash !== this.state.newPassRepeat) {
                if (document.getElementById("warning")) {
                    var element = document.getElementById("warning");
                    element!.parentNode!.removeChild(element!);
                }
                var newDiv = document.createElement('div');
                newDiv!.className = "alert alert-danger";
                newDiv!.id = "warning";
                var newContent = document.createTextNode("New password must be repeated identically!");
                newDiv.appendChild(newContent);
                var currDiv = document.getElementById("topDiv");
                currDiv!.parentNode!.insertBefore(newDiv, currDiv);
                return;
            }

            fetch('https://casul-campus.herokuapp.com/campUser/updateUser', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + thisToken
                },

                body: JSON.stringify({
                    user_id: this.state.user_id,
                    personal_id: this.state.personal_id,
                    first_name: this.state.first_name,
                    last_name: this.state.last_name,
                    role: this.state.role,
                    hash: this.state.hash,
                    email: this.state.email,
                    phone: this.state.phone,
                    image_path: this.state.image_path,
                    rid: rid
                })
            })
                .then(res => {
                    if (res.status === 401) {
                        alert("Session expired. Logout and login again.")
                    }
                    if (res.status === 403) {
                        alert("This is a demo version. You do not have permission to update users.")
                    }
                    if (res.ok) {
                        alert("user updated successfully!")
                    }
                })
                .catch(error => console.log(error));
        }

        fetch('https://casul-campus.herokuapp.com/campUser/updateUserNoPwd', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                user_id: this.state.user_id,
                personal_id: this.state.personal_id,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                role: this.state.role,
                email: this.state.email,
                phone: this.state.phone,
                image_path: this.state.image_path,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to update users.")
                }
                if (res.ok) {
                    alert("user updated successfully!")
                }
            })
            .catch(error => console.log(error));
    };

    updateUserNoFile = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (this.state.user_id === 0) {
            alert("Choose the user you would like to update.")
            return;
        }
        if (this.state.hash !== "") {
            if (this.state.hash !== this.state.newPassRepeat) {
                if (document.getElementById("warning")) {
                    var element = document.getElementById("warning");
                    element!.parentNode!.removeChild(element!);
                }
                var newDiv = document.createElement('div');
                newDiv!.className = "alert alert-danger";
                newDiv!.id = "warning";
                var newContent = document.createTextNode("New password must be repeated identically!");
                newDiv.appendChild(newContent);
                var currDiv = document.getElementById("topDiv");
                currDiv!.parentNode!.insertBefore(newDiv, currDiv);
                return;
            }

            fetch('https://casul-campus.herokuapp.com/campUser/updateUserNoFile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + thisToken
                },

                body: JSON.stringify({
                    user_id: this.state.user_id,
                    personal_id: this.state.personal_id,
                    first_name: this.state.first_name,
                    last_name: this.state.last_name,
                    role: this.state.role,
                    hash: this.state.hash,
                    email: this.state.email,
                    phone: this.state.phone,
                    rid: rid
                })
            })
                .then(res => {
                    if (res.status === 401) {
                        alert("Session expired. Logout and login again.")
                    }
                    if (res.status === 403) {
                        alert("This is a demo version. You do not have permission to update users.")
                    }
                    if (res.ok) {
                        alert("user updated successfully!")
                    }
                })
                .catch(error => console.log(error));
        }

        fetch('https://casul-campus.herokuapp.com/campUser/updateUserNoPwdNoFile', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                user_id: this.state.user_id,
                personal_id: this.state.personal_id,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                role: this.state.role,
                email: this.state.email,
                phone: this.state.phone,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to update users.")
                }
                if (res.ok) {
                    alert("user updated successfully!")
                }
            })
            .catch(error => console.log(error));
    };

    addFile = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (this.state.uploadImg === null) {
            this.updateUserNoFile(e);
            return;
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
                        this.updateUser(e);
                    })
            })
            .catch(error => console.log(error));
    };

    showUserName = (reg: Reg) => {
        this.setState({
            user_id: reg.user_id,
            personal_id: reg.personal_id,
            first_name: reg.first_name,
            last_name: reg.last_name,
            role: reg.role,
            phone: reg.phone,
            email: reg.email,
            image_path: reg.image_path,
            flow_id: reg.flow_id,
            speciality_id: reg.speciality_id,
            name: reg.name,
            registrations: this.state.registrations
        });
        var selRole = document.getElementById("selRole") as HTMLSelectElement;
        selRole!.value = reg.role;
        profileStyle = {
            display: "inline"
        }

        if (reg.role === "student") {
            acadInfoStyle = {
                display: "inline"
            }
        } else {
            acadInfoStyle = {
                display: "none"
            }
        }
    };

    componentDidMount() {
        if (!localStorage.getItem("thisToken")) {
            window.location.href = "sessionEnd"
        }
        if (localStorage.getItem("userRole") != "admin"
            && localStorage.getItem("userRole") != "demoAdmin") {
            if (localStorage.getItem("thisToken")) {
                localStorage.removeItem("thisToken")
            };
            alert("unauthorized access")
            window.location.href = "sessionEnd"
        }
    };

    render() {
        return (
            <div>
                <AdminNav />
                <br />
                <br />
                <div className="card card-body bg-white w-100">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4">
                                <div id="userMan" className="card-body bg-light">
                                    <form name="formid">
                                        <div className="form-group">
                                            <label htmlFor="nameField">First Name</label>
                                            <input type="text"
                                                className="form-control"
                                                placeholder="enter first name"
                                                value={this.state.first_name || ""}
                                                onChange={this.handleFirstNameChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="nameField">Last Name</label>
                                            <input type="text"
                                                className="form-control"
                                                placeholder="enter last name"
                                                value={this.state.last_name || ""}
                                                onChange={this.handleLastNameChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="nameField">Username</label>
                                            <input type="text"
                                                className="form-control"
                                                placeholder="enter username"
                                                value={this.state.email || ""}
                                                onChange={this.handleEmailChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="nameField">New Password
                                        <span style={{ color: "red" }}>{" "} (optional field)</span></label>
                                            <input type="password"
                                                className="form-control"
                                                placeholder="enter new password"
                                                value={this.state.hash || ""}
                                                onChange={this.handleHashChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="nameField">Repeat New Password</label>
                                            <input type="password"
                                                className="form-control"
                                                placeholder="repeat new password"
                                                value={this.state.newPassRepeat || ""}
                                                onChange={this.handleNewPassRepeatChange} />
                                        </div>
                                        <div id="topDiv"></div>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div id="userMan2" className="card-body bg-light">
                                    <form name="formid">

                                        <div className="form-group">
                                            <label htmlFor="nameField">Select Role</label>
                                            <select className="select-css" id="selRole" onChange={this.handleRoleChange}>
                                                <option value="">click to select role</option>
                                                <option value="lecturer">lecturer</option>
                                                <option value="student">student</option>
                                                <option value="admin">administrator</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="nameField">Phone Number</label>
                                            <input type="text"
                                                className="form-control"
                                                placeholder="enter phone number"
                                                value={this.state.phone || ""}
                                                onChange={this.handlePhoneChange} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="nameField">ID</label>
                                            <input type="text"
                                                className="form-control"
                                                placeholder="enter ID"
                                                value={(this.state.personal_id === 0 ? "" : (this.state.personal_id || ""))}
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
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card-body bg-light">
                                    <form name="formid">

                                        <button type="submit" className="btn btn-primary btn-lg btn-block"
                                            onClick={this.findUser}
                                            data-toggle="modal" data-target=".bd-example-modal-xl">Find User</button>
                                        <button type="submit" className="btn btn-primary btn-lg btn-block"
                                            onClick={this.addFile}>Update User</button>
                                        <button type="submit" className="btn btn-primary btn-lg btn-block"
                                            onClick={this.deleteUser}>Delete User</button>
                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.clearForm}>clear form</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Modal --> */}
                    <div className="modal fade bd-example-modal-xl" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-xl modal-full" role="document">
                            <div className="modal-content">
                                <div className="modal-body userManager">

                                    <div className="card-body bg-light m-1 userManager">
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span className="userM" aria-hidden="true">&times;</span>
                                        </button>
                                        <h4 className="App">Users</h4>
                                        <div className="userManWrapper">
                                            <Paper>
                                                <Table id="myTable">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className="userM">First Name {" "}
                                                                <i className="fa fa-sort"
                                                                    onClick={() => sortTableNew(0, "myTable")}></i></TableCell>
                                                            <TableCell className="userM">Last Name {" "}
                                                                <i className="fa fa-sort"
                                                                    onClick={() => sortTableNew(1, "myTable")}></i>
                                                            </TableCell>
                                                            <TableCell className="full-text">Role {" "}
                                                                <i className="fa fa-sort"
                                                                    onClick={() => sortTableNew(2, "myTable")}></i>
                                                            </TableCell>
                                                            <TableCell className="full-text">Email {" "}
                                                                <i className="fa fa-sort"
                                                                    onClick={() => sortTableNew(3, "myTable")}></i>
                                                            </TableCell>
                                                            <TableCell className="userM">ID {" "}
                                                                <i className="fa fa-sort"
                                                                    onClick={() => sortTableNewNumber(4, "myTable")}></i>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {this.state.registrations.map(reg => (
                                                            <TableRow key={reg.user_id}>
                                                                <TableCell className="userM">
                                                                    <input type="radio" name="selected" onChange={(e) => this.showUserName(reg)} /> {reg.first_name}</TableCell>
                                                                <TableCell className="userM">{reg.last_name}</TableCell>
                                                                <TableCell className="full-text">{reg.role}</TableCell>
                                                                <TableCell className="full-text">{reg.email}</TableCell>
                                                                <TableCell className="userM">{reg.personal_id}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Paper>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container-fluid" style={profileStyle}>
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
                            <div className="col-md-4" style={acadInfoStyle}>
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
        );
    }
}

export default UserManager;

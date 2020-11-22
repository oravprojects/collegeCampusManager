import React, { Component } from 'react'
import "../../index.css"
import { Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import AdminNav from './AdminNav';
import { sortTable, sortTableNew, sortTableNewNumber } from '../sorts';

var FlowStudentDataArr: any[] = [];
var findStudentArr: any[] = [];
var isEnabled = false;
var student_in_flow = 0;

type FlowListData = {
    status: string;
    data: Array<Flow>;
};

type Flow = {
    id: number;
    flow_id: number;
    speciality_id: number;
};

type FlowStudentData = {
    status: string;
    data: Array<Student>;
};
type Student = {
    user_id: number;
    personal_id: number;
    first_name: string;
    last_name: string;
    role: string;
    hash: string;
    email: string;
    phone: string;
    flow_id: number;
};

type SpecListData = {
    status: string;
    data: Array<Spec>;
};

type Spec = {
    id: number;
    speciality_id: number;
    name: string;
};

interface Props { }
interface State {
    students: Array<Student>;
    user_id: number;
    personal_id: number;
    first_name: string;
    last_name: string;
    role: string;
    hash: string;
    email: string;
    phone: string;


    specs: Array<Spec>;
    id: number;
    spec_id: number;
    specName: string;

    flows: Array<Flow>;
    flow_id: number;

    selected: boolean;
}

const thisToken = localStorage.getItem("thisToken");
const rid = localStorage.getItem("rid");

export class FlowStudent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            students: [],
            user_id: 0,
            personal_id: 0,
            first_name: "",
            last_name: "",
            role: "",
            hash: "",
            email: "",
            phone: "",

            specs: [],
            id: 0,
            spec_id: 0,
            specName: "",

            flows: [],
            flow_id: 0,

            selected: false
        };

    }


    findUser = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        fetch('https://casul-campus.herokuapp.com/Registration/findStudentForFlow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                user_id: this.state.user_id,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
            })
        })
            .then(res => res.json())
            .then((jsonRes: FlowStudentData) => {
                if (jsonRes.data) {
                    this.setState({
                        students: jsonRes.data
                    });
                    findStudentArr = jsonRes.data;
                    sortTable("myTable");
                    document.getElementById("tableTitle")!.innerHTML = "Students";
                    return false;
                } else {
                    alert('Session expired. Logout and login again.')
                }
            })
            .catch(error => console.log(error));
    };

    findFlowStudent = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!this.state.flow_id || this.state.flow_id === 0) {
            alert("Choose flow!");
            return;
        }

        fetch('https://casul-campus.herokuapp.com/Registration/findFlowStudent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                flow_id: this.state.flow_id,
            })
        })
            .then(res => res.json())
            .then((jsonRes: FlowStudentData) => {
                if (jsonRes.data) {
                    FlowStudentDataArr = jsonRes.data;
                    this.setState({
                        students: jsonRes.data
                    });
                    sortTable("myTable");
                    document.getElementById("tableTitle")!.innerHTML = "Flow Students";
                    return false;
                } else {
                    alert('Session expired. Logout and login again.')
                }
            })
            .catch(error => console.log(error));
    };

    handlePersonalIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            user_id: e.target.value
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


    handleSpecNameChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            specName: e.target.value
        })
    };

    // handleSpecIdChange = (spec: Spec) => {
    //     this.setState({
    //         specName: spec.name,
    //         spec_id: spec.speciality_id,
    //         id: spec.id,
    //         specs: this.state.specs
    //     });

    // };

    handleSpecIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            id: e.target.value
        })
    };

    handleFlowChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            flow_id: e.target.value
        })
    };



    findSpec = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        fetch('https://casul-campus.herokuapp.com/specialities/findSpec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                id: this.state.id,
                spec_id: this.state.spec_id,
                specName: this.state.specName
            })
        })
            .then(res => res.json())
            .then((jsonRes: SpecListData) => {
                if (jsonRes.data) {
                    this.setState({
                        specs: jsonRes.data
                    });
                    return false;
                } else {
                    alert('Session expired. Logout and login again.')
                }
            })
            .catch(error => console.log(error));
    };


    clearSpecForm = () => {
        this.setState({
            specName: "",
            spec_id: 0,
            id: 0,
            user_id: 0,
            first_name: "",
            last_name: "",
            flow_id: 0,
            students: []
        });

        const flowSelect = document.getElementById("flowSelect")! as HTMLSelectElement;
        const IdField = document.getElementById("IdField")! as HTMLInputElement;

        flowSelect.value = "select flow";
        IdField.value = "enter ID";
        isEnabled = false;


        document.getElementById("message")!.innerHTML = "";

        var m = 0;

        for (var i = 0; i < FlowStudentDataArr.length; i++) {
            var radioSelect = document.getElementById("radioSelect" + FlowStudentDataArr[i].user_id.toString()) as HTMLInputElement;
            if (radioSelect) {
                if (radioSelect!.checked === true) {
                    radioSelect!.checked = false;
                    m = findStudentArr.length;
                    return;
                }
            }
        }
        for (var j = m; j < findStudentArr.length; j++) {
            var radioSelect = document.getElementById("radioSelect" + findStudentArr[j].user_id.toString()) as HTMLInputElement;
            if (radioSelect) {
                if (radioSelect != null) {
                    if (radioSelect!.checked === true) {
                        radioSelect!.checked = false;
                        return;
                    }
                }
            }
        }
    };


    addStudentToFlow = (e: { preventDefault: () => void; }) => {
        var noSelect = "no select"
        if (!this.state.flow_id || !this.state.user_id || this.state.user_id === 0) {
            alert("Choose flow and student!");
            return;
        }

        if (student_in_flow || student_in_flow > 0) {
            alert("Student is already in flow " + student_in_flow.toString() + ". Remove student from flow " +
                student_in_flow.toString() + " before adding to another flow.");
            return;
        }

        for (var i = 0; i < FlowStudentDataArr.length; i++) {
            if (FlowStudentDataArr[i].flow_id === +this.state.flow_id &&
                FlowStudentDataArr[i].student_id === this.state.user_id) {
                alert("This student already exists in this flow!");
                return;
            }
        }

        if (findStudentArr.length === 0) {
            alert("You must select a registered student from the student list!");
            return;
        }

        for (var i = 0; i < FlowStudentDataArr.length; i++) {
            var radioSelect = document.getElementById("radioSelect" + FlowStudentDataArr[i].user_id.toString()) as HTMLInputElement;
            if (radioSelect) {
                if (radioSelect!.checked === true) {
                    noSelect = "selected";
                    i = FlowStudentDataArr.length;
                }
            }
        }
        for (var i = 0; i < findStudentArr.length; i++) {
            var radioSelect = document.getElementById("radioSelect" + findStudentArr[i].user_id.toString()) as HTMLInputElement;
            if (radioSelect) {
                if (radioSelect!.checked === true) {
                    noSelect = "selected";
                    i = findStudentArr.length;
                }
            }
        }
        if (noSelect === "no select") {
            alert("You must must select a registered student from the student list!");
            return;
        }

        e.preventDefault();
        fetch('https://casul-campus.herokuapp.com/specialities/addStudentToFlow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                user_id: this.state.user_id,
                flow_id: this.state.flow_id,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to add students to a flow.")
                }
                if (res.ok) {
                    document.getElementById("message")!.innerHTML = ("The following student has been added successfully:" + "<br/><br/>"
                        + "<p><b>first name: </b>" + this.state.first_name + "</p>"
                        + "<p><b>last name: </b>" + this.state.last_name + "</p>"
                        + "<p><b>flow: </b>" + this.state.flow_id + "</p>"
                    )

                    fetch('https://casul-campus.herokuapp.com/Registration/findFlowStudent', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + thisToken
                        },
                        body: JSON.stringify({
                            flow_id: this.state.flow_id,
                        })
                    })
                        .then(res => res.json())
                        .then((jsonRes: FlowStudentData) => {
                            if (jsonRes.data) {
                                this.setState({
                                    students: jsonRes.data
                                });
                                sortTable("myTable");
                                return false;
                            } else {
                                alert('Session expired. Logout and login again.')
                            }
                        })
                        .catch(error => console.log(error));
                }
            })
            .catch(error => console.log(error));
    };

    removeStudentFromFlow = () => {
        var noSelect = "no select"
        if (!this.state.flow_id || !this.state.user_id || this.state.user_id === 0) {
            alert("Choose flow and student!");
            return;
        }

        if (FlowStudentDataArr.length === 0) {
            alert("You must select a registered student from the student list!");
            return;
        }

        for (var i = 0; i < FlowStudentDataArr.length; i++) {
            var radioSelect = document.getElementById("radioSelect" + FlowStudentDataArr[i].user_id.toString()) as HTMLInputElement;
            if (radioSelect) {

                if (radioSelect!.checked === true) {
                    noSelect = "selected";
                    i = FlowStudentDataArr.length;
                }
            }
        }
        for (var i = 0; i < findStudentArr.length; i++) {
            var radioSelect = document.getElementById("radioSelect" + findStudentArr[i].user_id.toString()) as HTMLInputElement;
            if (radioSelect) {
                if (radioSelect!.checked === true) {
                    noSelect = "selected";
                    i = findStudentArr.length;
                }
            }
        }
        if (noSelect === "no select") {
            alert("You must must select a registered student from the student list!");
            return;
        }

        for (var i = 0; i < FlowStudentDataArr.length; i++) {
            if (FlowStudentDataArr[i].flow_id === +this.state.flow_id &&
                FlowStudentDataArr[i].student_id === this.state.user_id) {
                var tmpId = FlowStudentDataArr[i].id;
                i = FlowStudentDataArr.length;
            } else { console.log("student not found in flow"); return }
        }

        fetch('https://casul-campus.herokuapp.com/specialities/removeStudentFromFlow', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                id: tmpId,
                user_id: this.state.user_id,
                flow_id: this.state.flow_id,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to remove students from flows.")
                }
                if (res.ok) {
                    document.getElementById("message")!.innerHTML = ("The following student has been removed successfully:" + "<br/><br/>"
                        + "<p><b>first name: </b>" + this.state.first_name + "</p>"
                        + "<p><b>last name: </b>" + this.state.last_name + "</p>"
                        + "<p><b>flow: </b>" + this.state.flow_id + "</p>"
                    )

                    fetch('https://casul-campus.herokuapp.com/Registration/findFlowStudent', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + thisToken
                        },
                        body: JSON.stringify({
                            flow_id: this.state.flow_id,
                        })
                    })
                        .then(res => res.json())
                        .then((jsonRes: FlowStudentData) => {
                            if (jsonRes.data) {
                                this.setState({
                                    students: jsonRes.data
                                });
                                sortTable("myTable");
                                return false;
                            } else {
                                alert('Session expired. Logout and login again.')
                            }
                        })
                        .catch(error => console.log(error));
                }
            })
            .catch(error => console.log(error));
    };

    showStudent = (student: Student) => {
        this.setState({
            first_name: student.first_name,
            last_name: student.last_name,
            user_id: student.user_id,
            students: this.state.students
        });
        student_in_flow = student.flow_id;
        isEnabled = true;
    };

    showSpecName = (spec: Spec) => {
        this.setState({
            specName: spec.name,
            spec_id: spec.speciality_id,
            id: spec.id,
            specs: this.state.specs
        });

    };

    refreshList = () => {
        fetch('https://casul-campus.herokuapp.com/courses/flowList')
            .then(res => res.json())
            .then((jsonRes: FlowListData) => {
                this.setState({
                    flows: jsonRes.data
                });
            })
            .catch(error => console.log(error));
    };

    componentDidMount() {
        if (!localStorage.getItem("thisToken")) {
            window.location.href = "sessionEnd"
        };
        if (localStorage.getItem("userRole") != "admin"
            && localStorage.getItem("userRole") != "demoAdmin") {
            if (localStorage.getItem("thisToken")) {
                localStorage.removeItem("thisToken")
            };
            alert("unauthorized access")
            window.location.href = "sessionEnd"
        };
        this.refreshList();
    };



    render() {
        return (
            <div>
                <AdminNav />
                <h1 className="App">Flow Students</h1>
                <div className="card card-body bg-white w-100">
                    <div className="row no-gutters">

                        <div className="col-sm-4">
                            <div className="card-body bg-light m-4">
                                <form name="formid">
                                    <h4 className="App">Flows</h4>

                                    <div className="form-group">
                                        <select id="flowSelect" onChange={this.handleFlowChange} className="custom-select custom-select-lg mb-3">
                                            <option>select flow</option>
                                            {this.state.flows.map(flow =>
                                                <option key={flow.flow_id} value={flow.flow_id}>
                                                    {flow.flow_id}
                                                </option>)}
                                        </select>
                                        <button type="submit" className="btn btn-primary btn-lg btn-block"
                                            onClick={this.findFlowStudent}
                                            data-toggle="modal" data-target=".bd-example-modal-xl">View Flow Students</button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="card-body bg-light m-4">
                                <form name="formid" id="formId">
                                    <h3>Find Students</h3>

                                    <div className="form-group">
                                        <label htmlFor="nameField">First Name</label>
                                        <input type="text"
                                            className="form-control"
                                            placeholder="enter first name"
                                            disabled={isEnabled}
                                            value={this.state.first_name}
                                            onChange={this.handleFirstNameChange} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="nameField">Last Name</label>
                                        <input type="text"
                                            className="form-control"
                                            placeholder="enter last name"
                                            disabled={isEnabled}
                                            value={this.state.last_name}
                                            onChange={this.handleLastNameChange} />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="IdField">ID</label>
                                        <input id="IdField" type="text"
                                            className="form-control"
                                            placeholder="enter ID"
                                            disabled={isEnabled}
                                            value={(this.state.user_id === 0 ? "" : this.state.user_id)}
                                            onChange={this.handlePersonalIdChange} />
                                    </div>

                                    <button type="submit" className="btn btn-primary btn-lg btn-block"
                                        onClick={this.findUser}
                                        data-toggle="modal" data-target=".bd-example-modal-xl">Find Student</button>
                                    {/* <button type="submit" className="btn btn-primary btn-lg btn-block"
                                        onClick={this.addStudentToFlow}>Add to Flow</button> */}
                                    <button type="button"
                                        className="btn btn-outline-primary mr-3"
                                        onClick={this.clearSpecForm}>clear form</button>
                                </form>
                            </div>
                        </div>

                        <div className="col-sm-4">
                            <div className="card-body bg-light m-4">
                                <div className="App">
                                    <button style={{ width: "100%" }} onClick={(e) => this.removeStudentFromFlow()}
                                        className="btn btn-sm btn-danger"><h5 className="App">Remove Student from Flow</h5>
                                        <h4><i className="fas fa-trash" /></h4>
                                    </button>
                                    <br />
                                    <br />
                                    <br />
                                    <button style={{ width: "100%" }} onClick={this.addStudentToFlow}
                                        className="btn btn-lg btn-success"><h5 className="App">Add Student to Flow</h5>
                                        <h4><i className="fas fa-plus" /></h4>
                                    </button>
                                </div>
                                <br />
                                <br />
                                <p className="card-text" id="message"></p>
                            </div>
                        </div>
                    </div>
                </div>



                {/* <!-- Modal --> */}
                <div className="modal fade bd-example-modal-xl" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-xl" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="card-body bg-light m-1">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    <h4 id="tableTitle" className="App">Flow Students </h4>
                                    <div className="userManWrapper">
                                        <Paper>
                                            <Table id="myTable">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className="userM" colSpan={2}>Student ID {" "}<i className="fa fa-sort"
                                                            onClick={() => sortTableNewNumber(1, "myTable")}></i></TableCell>
                                                        <TableCell className="userM">First Name {" "}<i className="fa fa-sort"
                                                            onClick={() => sortTableNew(2, "myTable")}></i></TableCell>
                                                        <TableCell className="userM">Last Name {" "}<i className="fa fa-sort"
                                                            onClick={() => sortTableNew(3, "myTable")}></i></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.students.map(student => (
                                                        <TableRow key={student.user_id}>
                                                            <TableCell className="userM" style={{ width: "10px" }}><input id={"radioSelect" + student.user_id.toString()} type="radio" name="selected" onChange={(e) => this.showStudent(student)} /></TableCell>
                                                            <TableCell className="userM">{student.user_id}</TableCell>
                                                            <TableCell className="userM">{student.first_name}</TableCell>
                                                            <TableCell className="userM">{student.last_name}</TableCell>
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
            </div>
        );
    }
}

export default FlowStudent

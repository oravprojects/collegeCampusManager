import React from 'react';
import "../../App.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import AdminNav from './AdminNav';
import { sortTable, sortTableNew, sortTableNewNumber } from '../sorts';


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
    specs: Array<Spec>;
    id: number;
    spec_id: number;
    specName: string;
    selected: boolean;
}

const thisToken = localStorage.getItem("thisToken");
const rid = localStorage.getItem("rid");

class Speciality extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            specs: [],
            id: 0,
            spec_id: 0,
            specName: "",
            selected: false
        };
    }

    refreshList = () => {
        fetch('https://casul-campus.herokuapp.com/specialities/specList')
            .then(res => res.json())
            .then((jsonRes: SpecListData) => {
                this.setState({
                    specs: jsonRes.data
                });
                sortTable("myTable");
            })
            .catch(error => console.log(error));
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
        this.refreshList();
    };

    handleSpecNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            specName: e.target.value
        })
    };

    handleSpecIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            spec_id: e.target.value
        })
    };

    addNewSpec = () => {

        for (var i = 0; i < this.state.specs.length; i++) {
            if (+this.state.spec_id === this.state.specs[i].speciality_id) {
                alert("Speciality ID already exists. Choose another speciality ID.")
                return;
            }
            if (this.state.specName === this.state.specs[i].name) {
                alert("Speciality already exists.")
                return;
            }
        }
        if (this.state.specName === "" || this.state.spec_id <= 0) {
            return alert("all fields must be completed");
        }
        fetch('https://casul-campus.herokuapp.com/specialities/addSpec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                specName: this.state.specName,
                spec_id: this.state.spec_id,
                rid: rid
            })
        })
            .then(res => {
                if (res.ok) {
                    alert("Speciality added successfully")
                    this.refreshList();
                }
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to add specialities.")
                }
            })

            .catch(error => console.log(error));
    };

    deleteSpec = () => {
        if (this.state.specName === "" || this.state.spec_id === 0 || this.state.id === 0) {
            alert("Choose a speciality to delete.")
            return;
        }

        fetch('https://casul-campus.herokuapp.com/specialities/deleteSpec', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                id: this.state.id,
                rid: rid
            })
        })
            .then(res => {
                if (res.ok) {
                    alert("Speciality deleted successfully")
                    this.refreshList();
                }
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to delete specialities.")
                }
            })
            .catch(error => console.log(error));
    };

    clearForm = () => {
        this.setState({
            specName: "",
            spec_id: 0,
            id: 0
        });
    };

    updateSpec = () => {
        if (this.state.specName === "" || this.state.spec_id === 0 || this.state.id === 0) {
            alert("Choose a speciality to update.")
            return;
        }

        fetch('https://casul-campus.herokuapp.com/specialities/updateSpec', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                id: this.state.id,
                spec_id: this.state.spec_id,
                specName: this.state.specName,
                rid: rid
            })
        })
            .then(res => {
                if (res.ok) {
                    alert("Speciality updated successfully")
                    this.refreshList();
                }
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to update specialities.")
                }
            })
            .catch(error => console.log(error));
    };

    showSpecName = (spec: Spec) => {
        this.setState({
            specName: spec.name,
            spec_id: spec.speciality_id,
            id: spec.id,
            specs: this.state.specs
        });

    };
    render() {
        return (
            <div>
                <AdminNav />
                <h1 className="App">Specialities</h1>
                <div className="card card-body bg-white w-100">
                    <div className="row">
                        <div className="card card-body bg-light m-4">
                            <h4 className="App">Specialities Form</h4>
                            <form id="courses">
                                <div className="form-group">
                                    <label htmlFor="specNameField">Speciality</label>
                                    <input type="text"
                                        id="specNameField"
                                        className="form-control"
                                        placeholder="enter speciality name"
                                        value={this.state.specName}
                                        onChange={this.handleSpecNameChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="specIdField">ID</label>
                                    <input type="text"
                                        id="specIdField"
                                        className="form-control"
                                        placeholder="enter ID"
                                        value={(this.state.spec_id === 0 ? "" : this.state.spec_id)}
                                        onChange={this.handleSpecIdChange} />
                                </div>
                                <button onClick={this.addNewSpec}
                                    type="button"
                                    className="btn btn-outline-primary mr-3">add</button>
                                <button type="button"
                                    className="btn btn-outline-primary mr-3"
                                    onClick={this.updateSpec}>update</button>
                                <button onClick={(e) => this.deleteSpec()}
                                    type="button"
                                    className="btn btn-outline-primary mr-3">delete</button>
                                <button type="button"
                                    className="btn btn-outline-primary mr-3"
                                    onClick={this.clearForm}>clear form</button>
                            </form>
                        </div>

                        <div className="card card-body bg-light m-4">
                            <h4 className="App">Specialities</h4>
                            <Paper style={{ maxHeight: "250px", overflowY: 'auto' }}>
                                <Table id="myTable">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ width: "70%" }}>Speciality {" "}
                                                <i className="fa fa-sort"
                                                    onClick={() => sortTableNew(0, "myTable")}></i></TableCell>
                                            <TableCell>ID {" "}
                                                <i className="fa fa-sort"
                                                    onClick={() => sortTableNewNumber(1, "myTable")}></i></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody >
                                        {this.state.specs.map(spec => (
                                            <TableRow key={spec.id}>
                                                <TableCell>
                                                    <input type="radio" name="selected" onChange={(e) => this.showSpecName(spec)} /> {spec.name}</TableCell>
                                                <TableCell>{spec.speciality_id}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Speciality;

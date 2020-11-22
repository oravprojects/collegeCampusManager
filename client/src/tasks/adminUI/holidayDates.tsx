import React from 'react';
import CSS from 'csstype';
import "../../index.css"
import { Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import AdminNav from './AdminNav';
import { sortTableNew } from '../sorts';

const wrapperStyles: CSS.Properties = {
    margin: '2rem',
    maxHeight: '600px',
    overflowY: 'scroll'
};

type CalDatesData = {
    status: string;
    data: Array<calDates>;
};

type calDates = {
    cal_id: number;
    date: Date;
    holiday: number;
};

interface Props { }

interface State {
    dates: Array<calDates>;
    cal_id: number;
    holiday: number;
    selected: boolean;
    holidayDate: Date;
    fromDate: Date;
    toDate: Date;
}

const thisToken = localStorage.getItem("thisToken");
const rid = localStorage.getItem("rid");

class holidayDates extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            dates: [],
            cal_id: 0,
            holiday: 0,
            selected: false,
            holidayDate: new Date(9999, 1, 1),
            fromDate: new Date(0, 0, 1),
            toDate: new Date(9999, 1, 1)
        };
    }

    componentDidMount = () => {
        if (!localStorage.getItem("thisToken")) {
            window.location.href = "sessionEnd"
        }
        if (localStorage.getItem("userRole") !== "admin"
            && localStorage.getItem("userRole") != "demoAdmin") {
            if (localStorage.getItem("thisToken")) {
                localStorage.removeItem("thisToken")
            };
            alert("unauthorized access")
            window.location.href = "sessionEnd"
        }
    }

    datesList = () => {
        fetch('https://casul-campus.herokuapp.com/courses/findAllHolidays', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                fromDate: this.state.fromDate,
                toDate: this.state.toDate
            })
        })
            .then(res => res.json())
            .then((jsonRes: CalDatesData) => {
                if (jsonRes.data) {
                    this.setState({
                        dates: jsonRes.data
                    })
                } else {
                    alert('Session expired. Logout and login again.')
                }
            })
            .catch(error => console.log(error));
    }

    handleFromDateChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            fromDate: e.target.value
        })
    }

    handleToDateChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            toDate: e.target.value
        })
    }

    handleHolidayDateChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            holidayDate: e.target.value
        })
    }

    addHoliday = () => {
        if (new Date(this.state.holidayDate).getFullYear() === 9999) {
            alert("please, enter date");
            return;
        }

        fetch('https://casul-campus.herokuapp.com/courses/addHoliday', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                holidayDate: this.state.holidayDate,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to add holidays.")
                }
                if (res.ok) {
                    alert("Holiday added successfully.")
                    this.datesList();
                }
            })
            .catch(error => console.log(error));

    }

    deleteHoliday = () => {
        if (this.state.cal_id === 0) {
            alert("Please, select date to be deleted.");
            return;
        }

        fetch('https://casul-campus.herokuapp.com/courses/deleteHoliday', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                cal_id: this.state.cal_id,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to delete holidays.")
                }
                if (res.ok) {
                    alert("Date deleted successfully.");
                    this.datesList();
                    return;
                }
            })
            .catch(error => console.log(error));
    }

    updateHoliday = () => {
        if (this.state.cal_id === 0) {
            alert("Please, select date to be updated.");
            return;
        }

        if (new Date(this.state.holidayDate).getFullYear() === 9999) {
            alert("please, enter updated date.");
            return;
        }

        fetch('https://casul-campus.herokuapp.com/courses/updateHoliday', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                cal_id: this.state.cal_id,
                holidayDate: this.state.holidayDate,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to update holidays.")
                }
                if (res.ok) {
                    alert("Date updated successfully.");
                    this.datesList();
                    return;
                }
            })
            .catch(error => console.log(error));
    }

    clearSearchForm = () => {
        this.setState({
            fromDate: new Date(0, 0, 1),
            toDate: new Date(9999, 1, 1)
        })

        const fromDateField = document.getElementById("fromDateField") as HTMLInputElement;
        fromDateField!.value = "";
        const toDateField = document.getElementById("toDateField") as HTMLInputElement;
        toDateField!.value = "";

    }

    clearForm = () => {
        this.setState({
            cal_id: 0,
            holidayDate: new Date(9999, 1, 1),
            dates: []
        })

        const holidayDateField = document.getElementById("holidayDateField") as HTMLInputElement;
        holidayDateField!.value = "";
    }

    showDate = (date: calDates) => {
        this.setState({
            cal_id: date.cal_id,
            holidayDate: date.date
        })
        const holidayDateField = document.getElementById("holidayDateField") as HTMLInputElement;
        holidayDateField.valueAsDate = new Date(date.date.toString());
    }

    render() {
        return (
            <div>
                <AdminNav />
                <br />
                <br />
                <br />
                <h1 className="App">Holiday Dates</h1>

                {/* holiday schedule update */}
                <div className="card card-body bg-white w-100">
                    <div className="container-fluid">
                        <div className="row extra_margin">
                            <div className="col-sm-3">
                                <div className="card-body bg-light">
                                    <h4 className="App">Search Range</h4>
                                    <form id="HolidySearchRange">
                                        <div className="form-group">
                                            <label htmlFor="startDate">Start Date
                                                <span style={{ color: "red" }}>{" "} (optional field)</span></label>
                                            <input type="date"
                                                id="fromDateField"
                                                className="form-control"
                                                placeholder=""
                                                onChange={this.handleFromDateChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="startDate">End Date
                                                <span style={{ color: "red" }}>{" "} (optional field)</span></label>
                                            <input type="date"
                                                id="toDateField"
                                                className="form-control"
                                                placeholder=""
                                                onChange={this.handleToDateChange} />
                                        </div>
                                        <span className="short-text">
                                            <button type="button"
                                                className="btn btn-outline-primary mr-3 short-text"
                                                onClick={this.datesList}
                                                data-toggle="modal" data-target=".bd-example-modal-xl">search</button>
                                        </span>
                                        <span className="full-text">
                                            <button type="button"
                                                className="btn btn-outline-primary mr-3 full-text"
                                                onClick={this.datesList}>search</button>
                                        </span>
                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.clearSearchForm}>clear</button>
                                    </form>
                                </div>
                            </div>

                            <div className="col-sm-3">
                                <div className="card-body bg-light">
                                    <h4 className="App">Dates Manager</h4>
                                    <form id="HolidayDatesMan">
                                        <div className="form-group">
                                            <label htmlFor="holidayDateField">Holiday Date</label>
                                            <input type="date"
                                                id="holidayDateField"
                                                className="form-control"
                                                placeholder=""
                                                onChange={this.handleHolidayDateChange} />
                                        </div>

                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.addHoliday}>add</button>
                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.deleteHoliday}>delete</button>
                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.updateHoliday}>update</button>
                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.clearForm}>clear</button>
                                    </form>
                                </div>
                            </div>

                            {/* flow schedule */}

                            <div className="col-sm-6">
                                <div className="full-text">
                                    <div className="card-body bg-light">
                                        <h4 className="App">Holidays</h4>
                                        <div className="wrapper" style={{ maxHeight: "250px", overflowY: 'auto' }}>
                                            <Paper>
                                                <Table id="myHolidayTable">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell colSpan={3}>Date {" "}
                                                                <i className="fa fa-sort"
                                                                    onClick={() => sortTableNew(1, "myHolidayTable")}></i>
                                                            </TableCell>
                                                            <TableCell>
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {this.state.dates.map(date => (
                                                            <TableRow key={date.cal_id}>
                                                                <TableCell style={{ width: "5px" }}><input id={"radioSelect" + date.cal_id.toString()} type="radio" name="selected" onChange={(e) => this.showDate(date)} /></TableCell>
                                                                <TableCell >
                                                                    {date.date.toString().substr(0, 10)}</TableCell>
                                                                <TableCell id={"dateName" + date.cal_id.toString()}>{new Date(date.date).toDateString()}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Paper>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="short-text">

                    {/* <!-- Modal --> */}
                    <div className="short-text">
                        <div className="modal fade bd-example-modal-xl" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-xl modal-full" role="document">
                                <div className="modal-content">
                                    <div className="modal-body userManager">
                                        <div className="card-body bg-light m-1 userManager">
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span className="userM" aria-hidden="true">&times;</span>
                                            </button>
                                            <h4 className="App">Holidays</h4>
                                            <div className="userManWrapper">
                                                <Paper>
                                                    <Table id="myHolidayTableMobile">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell colSpan={3}>Date {" "}
                                                                    <i className="fa fa-sort"
                                                                        onClick={() => sortTableNew(1, "myHolidayTableMobile")}></i>
                                                                </TableCell>
                                                                <TableCell>
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {this.state.dates.map(date => (
                                                                <TableRow key={date.cal_id}>
                                                                    <TableCell style={{ width: "5px" }}><input id={"radioSelect" + date.cal_id.toString()} type="radio" name="selected" onChange={(e) => this.showDate(date)} /></TableCell>
                                                                    <TableCell >
                                                                        {date.date.toString().substr(0, 10)}</TableCell>
                                                                    <TableCell id={"dateName" + date.cal_id.toString()}>{new Date(date.date).toDateString()}</TableCell>
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
                </div>
            </div>
        );
    }
}


export default holidayDates;

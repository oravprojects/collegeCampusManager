import React, { Component } from 'react'
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import StudentNav from './StudentNav';



var first_name = window.localStorage.getItem('first_name');
var last_name = window.localStorage.getItem('last_name');
var user_id = window.localStorage.getItem('user_id');
var rid = window.localStorage.getItem('rid');
var greeting = "";
var reminder = "";
var newReminder = "";
var reminderDate = new Date(9999, 1, 1);
var remArr: any[] = [];
const thisToken = localStorage.getItem("thisToken");

export class StudentHome extends Component {
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
        this.getReminder();
    }

    getReminder = () => {
        var d = new Date();
        var offset = new Date().getTimezoneOffset();
        d.setHours(d.getHours() - offset / 60);

        fetch('https://casul-campus.herokuapp.com/login/getReminder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                user_id: user_id,
                date: new Date(d).toISOString().substr(0, 10)
            })
        })
            .then(res => res.json())
            .then((jsonRes) => {
                if (jsonRes.data) {
                    remArr = jsonRes.data
                    reminder = "";
                    for (var i = 0; i < remArr.length; i++) {
                        reminder += "<input type='checkbox' id='check"
                            + remArr[i].rem_id + "' style='opacity: 0.5'> " + remArr[i].reminder + "<br/>"
                    }
                    if (remArr.length === 0) {
                        document.getElementById("remList")!.innerHTML = "You have no reminders for today :)"
                        document.getElementById("updateListButton")!.style.display = "none";
                        document.getElementById("deleteRemButton")!.style.display = "none";
                    }
                    else {
                        document.getElementById("updateListButton")!.style.display = "inline";
                        document.getElementById("deleteRemButton")!.style.display = "inline";
                        document.getElementById("remList")!.innerHTML = "You have the following reminders for today:" + "<br/>" + reminder;
                        for (var j = 0; j < remArr.length; j++) {
                            if (remArr[j].complete === 1) {
                                var myChecked = document.getElementById("check" + remArr[j].rem_id) as HTMLInputElement
                                myChecked!.checked = true
                            }
                            if (remArr[j].complete === 0) {
                                var myChecked = document.getElementById("check" + remArr[j].rem_id) as HTMLInputElement
                                myChecked!.checked = false
                            }
                        }
                    }
                }
                else {
                    alert('Session expired. Logout and login again.');
                    return;
                }
            })
            .catch(error => { console.log(error) });
    };

    handleDateChange = (e: React.ChangeEvent<any>) => {
        reminderDate = e.target.value
    }

    handleReminderChange = (e: React.ChangeEvent<any>) => {
        newReminder = e.target.value
    }

    updateList = () => {
        if (localStorage.getItem("userRole") !== "student") {
            alert('This is a demo version. You do not have permission to update reminders.');
            return;
        }
        var newRequest = [];
        for (var j = 0; j < remArr.length; j++) {
            var checkVal = document.getElementById("check" + remArr[j].rem_id) as HTMLInputElement
            if (checkVal.checked) {
                newRequest.push({ "checked": true, "rem_id": remArr[j].rem_id })
            } else {
                newRequest.push({ "checked": false, "rem_id": remArr[j].rem_id })
            }
        }

        if (newRequest.length === 0) {
            alert("no reminders update");
            return;
        }
        fetch('https://casul-campus.herokuapp.com/login/completeReminder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                request: newRequest,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to update reminders.")
                }
                if (res.ok) {
                    this.clearRemForm();
                    this.getReminder();
                    alert("Reminders list updated!")
                    document.getElementById("collapseExample")!.className = "collapse"
                    document.getElementById("collapseExample1")!.className = "collapse"
                }
            })
            .catch(error => console.log(error));
    }

    deleteRem = () => {
        if (localStorage.getItem("userRole") !== "student") {
            alert('This is a demo version. You do not have permission to update reminders.');
            return;
        }
        var request = [];
        for (var j = 0; j < remArr.length; j++) {
            var checkVal = document.getElementById("check" + remArr[j].rem_id) as HTMLInputElement
            if (checkVal.checked) {
                request.push({ "checked": true, "rem_id": remArr[j].rem_id })
            }
        }
        if (request.length === 0) {
            alert("Please, choose a reminder to be deleted.");
            return;
        }

        fetch('https://casul-campus.herokuapp.com/login/deleteReminder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                request: request,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to delete reminders.")
                }
                if (res.ok) {
                    this.clearRemForm();
                    this.getReminder();
                    alert("Reminder deleted!")
                    document.getElementById("collapseExample")!.className = "collapse"
                    document.getElementById("collapseExample1")!.className = "collapse"
                }
            })
            .catch(error => console.log(error));
    }

    setReminder = () => {
        if (localStorage.getItem("userRole") !== "student") {
            alert('This is a demo version. You do not have permission to update reminders.');
            return;
        }

        if (new Date(reminderDate).getFullYear() === 9999) {
            alert("Please, select a date.");
            return;
        }

        if (newReminder === "") {
            alert("Please, add a reminder.");
            return;
        }

        fetch('https://casul-campus.herokuapp.com/login/setReminder', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                rid: rid,
                user_id: user_id,
                date: reminderDate.toString().substr(0, 10).replace(/-/g, ","),
                reminder: newReminder
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to add reminders.")
                }
                if (res.ok) {
                    this.clearRemForm();
                    this.getReminder();
                    alert("Reminder added!")
                    document.getElementById("collapseExample")!.className = "collapse"
                    document.getElementById("collapseExample1")!.className = "collapse"
                }
            })
            .catch(error => console.log(error));
    }

    clearRemForm = () => {
        var selDate = document.getElementById("remDateField") as HTMLInputElement;
        selDate!.value = "";

        var remField = document.getElementById("remField") as HTMLInputElement;
        remField!.value = "";

        newReminder = "";
        reminderDate = new Date(9999, 1, 1);
    }

    render() {
        if (new Date().getHours() >= 4 && new Date().getHours() < 12) {
            greeting = "Good morning, " + first_name + "!"
        }

        if (new Date().getHours() >= 12 && new Date().getHours() < 17) {
            greeting = "Good afternoon, " + first_name + "!"
        }

        if (new Date().getHours() >= 17 && new Date().getHours() < 21) {
            greeting = "Good evening, " + first_name + "!"
        }

        if (new Date().getHours() >= 21 || new Date().getHours() < 4) {
            greeting = "Good night, " + first_name + "!"
        }

        return (
            <div>
                <StudentNav />
                <br />
                <br />
                <div id="bgImage"><br />
                    <div className="container-fluid m-2" >

                        <div className="remContainer">
                            <div className="card-block special-card rounded" style={{
                                backgroundColor: 'rgba(245, 245, 245, 0.5)',
                                textAlign: 'center'
                            }}>
                                <h2 style={{ padding: "5px" }}>{greeting}</h2>
                                <p>
                                    <button className="btn btn-link collapsed" style={{ color: 'black' }} data-toggle="collapse" data-target="#collapseExample1" aria-expanded="false" aria-controls="collapseExample">
                                        Set Reminders
                                </button>
                                    <button className="btn btn-link collapsed" style={{ color: 'black' }} data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                                        View Reminders
                            </button>
                                </p>
                                <div className="collapse" id="collapseExample1">
                                    <div className="card-transparent" style={{ textAlign: 'left' }}>
                                        <form id="flowSchedUp">
                                            <div className="form-group mx-sm-3 mb-2">
                                                <label htmlFor="date" style={{ marginLeft: '5%' }}><b>Date</b></label>
                                                <input type="date" style={{ width: '90%', marginLeft: '5%' }}
                                                    id="remDateField"
                                                    className="form-control"
                                                    placeholder="mm/dd/yyyy"
                                                    onChange={this.handleDateChange} />
                                            </div>
                                            <div className="form-group mx-sm-3 mb-2">
                                                <label htmlFor="reminder" style={{ marginLeft: '5%' }}><b>Reminder</b></label>
                                                <input type="text" style={{ width: '90%', marginLeft: '5%' }}
                                                    id="remField"
                                                    className="form-control"
                                                    placeholder="enter reminder text"
                                                    onChange={this.handleReminderChange} />
                                            </div>

                                            <button type="button"
                                                className="btn btn-outline-primary mr-3 remList"
                                                onClick={this.setReminder}
                                            >submit</button>
                                            <button type="button"
                                                className="btn btn-outline-primary mr-3"
                                                onClick={this.clearRemForm}
                                                style={{ color: 'black', marginBottom: '10px' }}>clear</button>
                                        </form></div>
                                </div>
                                <div className="collapse" id="collapseExample">
                                    <div className="card-transparent" >
                                        <p id="remList" style={{ textAlign: 'left' }}></p>
                                        <button type="button"
                                            id="updateListButton"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.updateList}
                                            style={{ color: 'black', marginBottom: '10px' }}>update list</button>
                                        <button type="button"
                                            id="deleteRemButton"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.deleteRem}
                                            style={{ color: 'black', marginBottom: '10px' }}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        );
    };
}

export default StudentHome

import React, { Component } from 'react'
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

import "../../App.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import StudentNav from './StudentNav';
import { sortTableNew, sortTableNewNumber } from '../sorts';


var flow_id = (window.localStorage.getItem('flow_id'));
var courseId = (window.localStorage.getItem('courseId'));
var sectionId = (window.localStorage.getItem('sectionId'));
var section = (window.localStorage.getItem('section'));
var user_id = (window.localStorage.getItem('user_id'));
var courseName = window.localStorage.getItem("courseName");
var courseHours = window.localStorage.getItem("courseHours");
var lecFirstName = window.localStorage.getItem("lecFirstName");
var lecLastName = window.localStorage.getItem("lecLastName");
var lecId = window.localStorage.getItem("lecId");
var rid = window.localStorage.getItem("rid");
var filePath = window.localStorage.getItem("filePath");

var attendArr: Array<Lesson> = []
var gradeArr: { grade: string; }[] = [];

type Lesson = {
    lesson_id: number;
    present: number;
    date: Date;
};

type AnnouncementData = {
    status: string;
    data: Array<Announcement>;
};

type Announcement = {
    title: string;
    sub_date: Date;
    file_id: number;
    section_id: number;
    message: string;
    file_path: string;
};

var request = "";
var submitted = 0;

/* eslint-disable no-useless-concat */
const thisToken = localStorage.getItem("thisToken");

interface Props { }
interface State {
    post: string;
    subject: string;
    file_path: string;
    uploadFile: any;
    announcements: Array<Announcement>;
    title: string;
    sub_date: Date;
    file_id: number;
    section_id: number;
    message: string;
}

export class StudentCourseInfo extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            post: "",
            subject: "",
            file_path: "",
            uploadFile: null,
            announcements: [],
            title: "",
            sub_date: new Date(),
            file_id: 0,
            section_id: 0,
            message: ""
        };
    }

    refreshList = () => {
        if (!flow_id) {
            alert("course not active");
            return
        }
        fetch('https://casul-campus.herokuapp.com/myCourses/StudentCourseInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                user_id: user_id,
                section_id: sectionId
            })
        })
            .then(res => res.json())
            .then((jsonRes) => {
                if (jsonRes.status === "ok") {
                    attendArr = jsonRes.data[0];

                    gradeArr = jsonRes.data[1];
                }
                else {
                    alert('Session expired. Logout and login again.')
                }
                this.buildTable(attendArr);
            })
            .catch(error => console.log(error));
    };

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

    buildTable = (data: any[]) => {
        var table = document.getElementById("tableBody") as HTMLTableElement;
        var finalGrade = document.getElementById("grade");
        if (gradeArr.length > 0) {
            finalGrade!.innerHTML = "<b>final grade: </b>" + gradeArr[0].grade
        }
        for (var i = 0; i < data.length; i++) {
            var presColor = "";
            if (data[i].present === 0) {
                data[i].present = "absent"
                presColor = "color: red"
            } else {
                data[i].present = "present"
            }
            var bgStyle = ""

            if (i % 2 === 0) {
                bgStyle = "background-color: #d3d3d3"
            }

            var row = `<tr>
                <td style="width: 80px; ${bgStyle}; ${presColor}">${new Date(data[i].date).toDateString().substr(4, 12)}</td>
                <td style="width: 70px; ${bgStyle}; ${presColor}">${data[i].present}</td>
            </tr>`
            table.innerHTML += row
        }
    }

    handleUploadFileChange = (event: any) => {
        this.setState({
            uploadFile: event.target.files[0]
        })
    }

    addFile = (e: { preventDefault: () => void; }) => {
        if (localStorage.getItem("userRole") !== "student") {
            alert('This is a demo version. You do not have permission to upload files.');
            return;
        }
        e.preventDefault();
        if (this.state.uploadFile === null) {
            this.sendAssignment(e);
            return;
        }
        const fd = new FormData();
        fd.append('userFile', this.state.uploadFile, this.state.uploadFile.name);
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
                            file_path: path
                        })
                        this.sendAssignment(e);
                    })
            })
            .catch(error => console.log(error));
    };

    sendAssignment = (e: { preventDefault: () => void; }) => {
        if (localStorage.getItem("userRole") !== "student") {
            alert('This is a demo version. You do not have permission to upload files.');
            return;
        }
        e.preventDefault();
        if (this.state.subject === "") {
            alert("Please add a subject to your message.");
            return;
        }
        fetch('https://casul-campus.herokuapp.com/campUser/sendAssignment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                section_id: sectionId,
                user_id: user_id,
                file_path: this.state.file_path,
                post: this.state.post,
                title: this.state.subject,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to submit assignments.")
                }
                if (res.ok) {
                    alert("Assignment submitted successfully!")
                    this.clearForm();
                }
            })
            .catch(error => console.log(error));
    };

    handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            subject: e.target.value
        })
    }

    handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            post: e.target.value
        })
    }

    getAnnouncements = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        fetch('https://casul-campus.herokuapp.com/campUser/getAnnouncements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                section_id: sectionId,
                lecturer_id: lecId
            })
        })
            .then(res => res.json())
            .then((jsonRes: AnnouncementData) => {
                if (jsonRes.status === "401") {
                    alert("Session expired. Logout and login again.")
                    return;
                }

                for (var i = 0; i < jsonRes.data.length; i++) {
                    var date = jsonRes.data[i].sub_date.toString();
                    date = date.replace(/T|-|:/g, '').substr(0, 19);

                    var year = +date.substr(0, 4)
                    var month = +date.substr(4, 2) - 1
                    var day = +date.substr(6, 2)
                    var hour = +date.substr(8, 2)
                    var minute = +date.substr(10, 2)
                    var sec = +date.substr(12, 2)
                    jsonRes.data[i].sub_date = new Date(year, month, day, hour, minute, sec)
                }

                this.setState({
                    announcements: jsonRes.data
                });
            })
            .catch(error => console.log(error));
    }

    clearForm = () => {
        this.setState({
            post: "",
            subject: "",
            file_path: "",
            uploadFile: null
        });
        var subField = document.getElementById("subjectField") as HTMLFormElement
        var postField = document.getElementById("postField") as HTMLFormElement
        var fileField = document.getElementById("userFile") as HTMLFormElement

        subField.value = "";
        postField.value = "";
        fileField.value = null;
    }

    render() {
        return (
            <div>
                <StudentNav />
                <br />
                <br />
                <br />
                <div>
                    <h1 className="App">Flow {flow_id}</h1>
                    <br></br>
                </div>
                <div className="container-fluid">
                    <div className="row" style={{ marginLeft: "10px" }}>
                        <div className="col-md-3">
                            <p className="lead extra_margin">{courseName}</p>
                            <hr />
                            <h4><b>lecturer: </b>{lecFirstName}{" "}{lecLastName}</h4>
                            <h4><b>section: </b>{section}</h4>
                            <h4><b>total hours: </b>{courseHours}</h4>
                            <h4><b>course ID: </b>{courseId}</h4>
                        </div>
                        <div className="col-md-4">
                            <p className="lead extra_margin">Attendance</p>
                            <hr />
                            <div className="row"><div className="col-md-6"><b>Date</b></div>
                                <div className="col-md-6"><b>Status</b></div></div>
                            <div style={{ height: "300px", overflowY: "auto" }}>
                                <Paper>
                                    <Table >
                                        <TableHead>
                                        </TableHead>
                                        <TableBody id="tableBody">
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <p className="lead extra_margin">Grades</p>
                            <hr />
                            <h4 id="grade"></h4>
                        </div>
                    </div>
                    <div className="row" style={{ marginLeft: "10px" }}>

                        {/* <!-- Large modal --> */}
                        <button onClick={this.getAnnouncements} type="button" className="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Course Announcements</button>

                        <div className="modal fade bd-example-modal-lg" tabIndex={-1} role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="container-fluid" style={{ padding: "5%" }}>
                                        <div className="row form-inline">
                                            <div className="col"  >
                                                <br />
                                                <table className="table table-striped mb-0">
                                                    <thead>
                                                        <tr className="bg-info">
                                                            <th data-column="name" data-order="desc">
                                                                <div className="container-fluid">
                                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                        <span aria-hidden="true">&times;</span>
                                                                    </button>
                                                                    <div className="row">
                                                                        <div className="col-4">
                                                                            Title <i className="fa fa-sort"
                                                                                onClick={() => sortTableNew(0, "myTable")}></i>
                                                                        </div>
                                                                        <div className="col-8 App">
                                                                            Date <i className="fa fa-sort"
                                                                                onClick={() => sortTableNewNumber(1, "myTable")}></i>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                </table>
                                                <div style={{ height: "480px", overflowY: "auto", width: '100%' }}>
                                                    <table className="table table-striped mt-0" id="myTable">
                                                        <thead>
                                                            <tr></tr>
                                                        </thead>
                                                        <tbody>

                                                            {this.state.announcements.map(announcement => (
                                                                <tr key={announcement.file_id}>
                                                                    <td style={{ maxWidth: "180px" }}>


                                                                        <a className="btn btn-link" data-toggle="collapse" href={"#collapseExample" + announcement.file_id.toString()} role="button" aria-expanded="false" aria-controls="collapseExample">
                                                                            {announcement.title}
                                                                        </a>

                                                                        <div className="collapse" id={"collapseExample" + announcement.file_id.toString()}>
                                                                            <div className="card card-body" style={{ width: "150%" }}>
                                                                                {announcement.message}
                                                                                <a href={announcement.file_path}
                                                                                    style={(announcement.file_path === "" ? { display: "none" } : { display: "inline" })}>attachment</a>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td id={announcement.file_id.toString()}>{announcement.sub_date.toString().substr(0, 15)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className="row" style={{ marginLeft: "10px" }}>
                        <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">Submit Assignment</button>

                        {/* <!-- Modal --> */}
                        <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Post a Message</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="card-transparent" style={{ textAlign: "left", width: "90%" }}>
                                            <form name="formid">

                                                <div className="form-group">
                                                    <label htmlFor="subjectField">Subject</label>
                                                    <input
                                                        id="subjectField"
                                                        type="text"
                                                        className="form-control"
                                                        maxLength={255}
                                                        value={this.state.subject}
                                                        onChange={this.handleSubjectChange} />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="contentField">Message</label>
                                                    <textarea
                                                        id="postField"
                                                        maxLength={1000}
                                                        rows={5}
                                                        className="form-control"
                                                        placeholder="enter question or comment"
                                                        value={this.state.post}
                                                        onChange={this.handleContentChange} />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="uploadField">Upload File</label>
                                                    <input type="file"
                                                        id="userFile"
                                                        name="userFile"
                                                        className="form-control"
                                                        placeholder=""
                                                        onChange={this.handleUploadFileChange} />
                                                </div>

                                                <button type="submit" className="btn btn-primary btn-lg btn-block"
                                                    onClick={this.addFile} data-dismiss="modal">Send</button>
                                                <button type="button"
                                                    className="btn btn-outline-primary mr-3"
                                                    onClick={this.clearForm}>Clear Form</button>
                                            </form>
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
        )
    }
}

export default StudentCourseInfo

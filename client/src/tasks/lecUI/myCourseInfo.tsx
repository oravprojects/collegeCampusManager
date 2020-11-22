import React, { Component } from 'react'
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import CSS from 'csstype';

import "../../App.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import LecturerNav from './LecturerNav';
import { sortTableNew, sortTableNewNumber } from '../sorts'


var class_id = (window.localStorage.getItem('flow_id'));
var courseId = (window.localStorage.getItem('courseId'));
var sectionId = (window.localStorage.getItem('sectionId'));
var user_id = (window.localStorage.getItem('user_id'));
var rid = (window.localStorage.getItem('rid'));
var request = "";
var submitted = 0;
var noAttendance = true;
var update = false;
var close = document.getElementById("close") as HTMLButtonElement
var closeMessage = document.getElementById("closeMessage") as HTMLButtonElement


const wrapperStyles: CSS.Properties = {

    maxHeight: '300px',
    overflowY: 'scroll'
};

/* eslint-disable no-useless-concat */
const thisToken = localStorage.getItem("thisToken");

const subAttStyles: CSS.Properties = {

    position: 'relative',
    left: '75%',
    marginTop: '0.5rem',
    padding: '0.5rem',
    fontFamily: 'sans-serif',
    fontSize: '1.5rem',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)'
};


const subMesStyles: CSS.Properties = {
    position: 'fixed',
    color: 'green',
    left: '1rem',
    fontFamily: 'sans-serif',
    fontSize: '1.5rem',
};

type CourseListData = {
    status: string;
    data: Array<Course>;
};

type AttArray = {
    data: Array<Course>;
}
type Course = {
    user_id: number;
    first_name: string;
    last_name: string;
    lesson_id: number;
    date: Date;
    present: number;
    lesson_number: number;
    section_id: number;

};

type AnnouncementData = {
    status: string;
    data: Array<Announcement>;
};

type Announcement = {
    title: string;
    sub_date: Date;
    file_id: number;
    file_path: string;
    section_id: number;
    message: string;
    user_id: number;
};

interface Props { }
interface State {
    courses: Array<Course>;
    attArray: Array<Course>;
    user_id: number;
    first_name: string;
    last_name: string;
    lesson_id: number;
    date: Date;
    present: number;
    lesson_number: number;
    section_id: number;

    post: string;
    subject: string;
    file_path: string;
    uploadFile: any;
    announcements: Array<Announcement>;
    title: string;
    sub_date: Date;
    file_id: number;
    message: string;
}

var attArray: string | any[] = [];
var dataArray: any[] = [];
var totalStudents = 0;

export class MyCourseInfo extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            courses: [],
            attArray: [],
            user_id: 0,
            first_name: "",
            last_name: "",
            lesson_id: 0,
            date: new Date(),
            present: 0,
            lesson_number: 0,
            section_id: 0,
            post: "",
            subject: "",
            file_path: "",
            uploadFile: null,
            announcements: [],
            title: "",
            sub_date: new Date(),
            file_id: 0,
            message: ""
        };
    }

    refreshList = () => {

        fetch('https://casul-campus.herokuapp.com/myCourses/myCourseInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                flow_id: class_id,
                course_id: courseId,
                section_id: sectionId
            })
        })
            .then(res => res.json())
            .then((jsonRes) => {
                if (jsonRes.status === "ok") {
                    totalStudents = jsonRes.data.length;
                    dataArray = jsonRes.data
                }
                else {
                    alert('Session expired. Logout and login again.');
                    return
                }
            })

        fetch('https://casul-campus.herokuapp.com/myCourses/myClassInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                flow_id: class_id,
                course_id: courseId,
                section_id: sectionId
            })
        })
            .then(res => res.json())
            .then((jsonRes: CourseListData) => {
                if (jsonRes.data) {

                    if (jsonRes.data.length === 0) {

                        this.setState({
                            courses: dataArray
                        })
                        window.localStorage.setItem("nextLessonNumber", "1");
                    }
                    else {
                        noAttendance = false;
                        this.setState({
                            courses: jsonRes.data
                        });
                        totalStudents = jsonRes.data.length;
                        window.localStorage.setItem("nextLessonNumber", (jsonRes.data[0].lesson_number + 1).toString());
                    }
                } else {
                    alert('Session expired. Logout and login again.')
                    return;
                }
            })
            .catch(error => console.log(error));
    };


    componentDidMount() {
        if (!localStorage.getItem("thisToken")) {
            window.location.href = "sessionEnd"
        }
        if (localStorage.getItem("userRole") !== "lecturer"
            && localStorage.getItem("userRole") !== "demoLecturer") {
            if (localStorage.getItem("thisToken")) {
                localStorage.removeItem("thisToken")
            };
            alert("unauthorized access")
            window.location.href = "sessionEnd"
        }
        this.refreshList();
    };

    setAttendanceP = (course: Course) => {
        this.setState({
            user_id: course.user_id,
            first_name: course.first_name,
            last_name: course.last_name,
            present: course.present,
            date: course.date,
            lesson_number: course.lesson_number,
            section_id: course.section_id,
            courses: this.state.courses,
        });
        attArray = this.state.courses;
        course.present = 1;
        course.date = new Date();
    };

    setAttendanceA = (course: Course) => {
        this.setState({
            user_id: course.user_id,
            first_name: course.first_name,
            last_name: course.last_name,
            present: course.present,
            date: course.date,
            lesson_number: course.lesson_number,
            section_id: course.section_id,
            courses: this.state.courses
        });
        attArray = this.state.courses;
        course.present = 0;
        course.date = new Date();
    };

    subAtt = () => {
        if (localStorage.getItem("userRole") !== "lecturer") {
            alert('This is a demo version. You cannot submit attendance.')
            return;
        }
        if (submitted === 1) {
            return;
        }
        if (attArray.length === 0) {
            alert("all attendance fields must be filled");
            return;
        }
        for (var j = 0; j < attArray.length; j++) {
            if (attArray[j].present !== 0 && attArray[j].present !== 1) {
                alert("all attendance fields must be filled");
                return;
            }
        }

        var course_id = (window.localStorage.getItem('courseId'));
        var nextLessonNumber = (window.localStorage.getItem('nextLessonNumber'));
        for (var i = 0; i < attArray.length; i++) {
            if (i === attArray.length - 1) {
                request += "(" + attArray[i].user_id + ", " + course_id + ", " + sectionId + ", "
                    + attArray[i].present + ", " + nextLessonNumber + ", "
                    + "NOW());"
            }
            else {
                request += "(" + attArray[i].user_id + ", " + course_id + ", " + sectionId + ", "
                    + attArray[i].present + ", " + nextLessonNumber + ", "
                    + "NOW()), "
            }
        }

        fetch('https://casul-campus.herokuapp.com/myCourses/subAtt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                rid: rid,
                request: request
            })
        })
            .then(res => {
                if (res.ok) {
                    document.getElementById("submit")!.innerHTML = "Back to Courses"
                    document.getElementById("submit")!.setAttribute("onclick", "window.location.href='/MyCourses'")
                    submitted = 1;
                    document.getElementById("message")!.innerHTML = "attendance submitted successfully!"

                    document.getElementById("submitMobile")!.innerHTML = "Back to Courses"
                    document.getElementById("submitMobile")!.setAttribute("onclick", "window.location.href='/MyCourses'")

                    document.getElementById("messageMobile")!.innerHTML = "attendance submitted successfully!"

                }
                else if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to post attendance.")
                }
                else {
                    alert('Session expired. Logout and login again.')
                    return;
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

    handleUploadFileChange = (event: any) => {
        this.setState({
            uploadFile: event.target.files[0]
        })
    }

    addFile = (e: { preventDefault: () => void; }) => {
        if (localStorage.getItem("userRole") !== "lecturer") {
            alert('This is a demo version. You cannot post announcements.')
            return;
        }
        e.preventDefault();
        if (this.state.uploadFile === null && update === true) {
            this.updateAnnouncementNoFile(e);
            return;
        }

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
                        if (update) {
                            this.updateAnnouncement(e);
                            update = false;
                            return;
                        }
                        else { this.sendAssignment(e); }
                    })
                    .catch(error => console.log(error));
            })
    };

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

    sendAssignment = (e: { preventDefault: () => void; }) => {
        if (localStorage.getItem("userRole") !== "lecturer") {
            alert('This is a demo version. You cannot post assignments.')
            return;
        }
        e.preventDefault();

        if (this.state.subject === "") {
            alert("Please add a subject to your message");
            return;
        }

        fetch('https://casul-campus.herokuapp.com/campUser/sendAssignment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                rid: rid,
                section_id: sectionId,
                user_id: user_id,
                file_path: this.state.file_path,
                post: this.state.post,
                title: this.state.subject
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                    return;
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to send assignments.")
                    return;
                }
                if (res.ok) {
                    alert("Assignment submitted successfully!")
                    this.clearForm();
                    this.getAnnouncements(e);
                }
            })
            .catch(error => console.log(error));
    };


    getAnnouncements = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        fetch('https://casul-campus.herokuapp.com/campUser/getAnnouncementsLec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                section_id: sectionId
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


    updateAnnouncement = (e: { preventDefault: () => void; }) => {
        if (localStorage.getItem("userRole") !== "lecturer") {
            alert('This is a demo version. You cannot update announcements.')
            return;
        }
        update = false

        fetch('https://casul-campus.herokuapp.com/campUser/updateAnnouncement', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                rid: rid,
                file_id: this.state.file_id,
                file_path: this.state.file_path,
                subject: this.state.subject,
                message: this.state.post
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                    return;
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to update announcements.")
                    return;
                }
                if (res.ok) {
                    alert("Announcement updated successfully!");
                    this.clearForm();
                    this.refreshList();

                    document.getElementById("collapseExample" + this.state.file_id.toString())!.className = "collapse"
                    var close = document.getElementById("close") as HTMLButtonElement
                    close.click();
                    var closeMessage = document.getElementById("closeMessage") as HTMLButtonElement
                    closeMessage.click();

                }
            })
            .catch(error => console.log(error));
    }

    updateAnnouncementNoFile = (e: { preventDefault: () => void; }) => {
        if (localStorage.getItem("userRole") !== "lecturer") {
            alert('This is a demo version. You cannot update announcements.')
            return;
        }
        update = false

        fetch('https://casul-campus.herokuapp.com/campUser/updateAnnouncementNoFile', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                rid: rid,
                file_id: this.state.file_id,
                subject: this.state.subject,
                message: this.state.post
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                    return;
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to update announcements.")
                    return;
                }
                if (res.ok) {
                    alert("Announcement updated successfully!")
                    this.clearForm();
                    this.refreshList();

                    document.getElementById("collapseExample" + this.state.file_id.toString())!.className = "collapse"
                    var close = document.getElementById("close") as HTMLButtonElement
                    close.click();
                    var closeMessage = document.getElementById("closeMessage") as HTMLButtonElement
                    closeMessage.click();

                }
            })
            .catch(error => console.log(error));
    }

    updatePost = (announcement: Announcement) => {
        if (localStorage.getItem("userRole") !== "lecturer") {
            alert('This is a demo version. You cannot update announcements.')
            return;
        }
        update = true;
        this.setState({
            subject: announcement.title,
            post: announcement.message,
            file_id: announcement.file_id,
            announcements: this.state.announcements
        });

        var post = document.getElementById("post") as HTMLButtonElement
        post.click();
    }

    deletePost = (fileId: number) => {
        if (localStorage.getItem("userRole") !== "lecturer") {
            alert('This is a demo version. You cannot delete posts.')
            return;
        }

        fetch('https://casul-campus.herokuapp.com/campUser/deleteAnnouncement', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                file_id: fileId,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                    return;
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to delete announcements.")
                    return;
                }
                if (res.ok) {
                    alert("message deleted successfully!")
                    this.refreshList();
                    var close = document.getElementById("close") as HTMLButtonElement
                    close.click();
                }
            })
            .catch(error => console.log(error));
    }

    render() {
        return (
            <div>
                <LecturerNav />
                <br />
                <br />
                <br />
                <div>
                    <h2 className="App">Class {class_id}</h2>

                </div>

                <button onClick={this.getAnnouncements} type="button" className="btn btn-primary3" data-toggle="modal" data-target=".bd-example-modal-lg">Read Announcements</button>
                <br></br>
                <a href="#" className="button3" data-toggle="modal" data-target="#exampleModal">Post Announcements</a>

                <br></br>
                <a href={(noAttendance === false ? "/myAttendanceInfo" : "#")} className="button3">attendance</a>
                <br></br>
                <a href="/grades" className="button3">grades</a>
                <div className="App">
                    <h4><strong>Roll Call</strong></h4>

                </div>
                <div className="full-text">
                    <div style={wrapperStyles}>
                        <Paper>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>student ID</TableCell>
                                        <TableCell>First Name</TableCell>
                                        <TableCell>Last Name</TableCell>
                                        <TableCell>Present</TableCell>
                                        <TableCell>Absent</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.courses.map(course => (
                                        <TableRow key={course.user_id}>
                                            <TableCell>{course.user_id}</TableCell>
                                            <TableCell>{course.first_name}</TableCell>
                                            <TableCell>{course.last_name}</TableCell>
                                            <TableCell><input type="radio" name={course.user_id.toString()} value={0} onChange={(e) => this.setAttendanceP(course)} /></TableCell>
                                            <TableCell><input type="radio" name={course.user_id.toString()} value={0} onChange={(e) => this.setAttendanceA(course)} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>

                    <div className="container-fluid" >
                        <div className="row extra_margin">
                            <div className="col-md-4">
                                <div className="text-center">
                                    <div style={subMesStyles}>
                                        <br /><b />
                                        <p id="messageMobile"></p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <button id="submitMobile" type="button" onClick={this.subAtt} style={subAttStyles} className="btn btn-primary btn-lg">Submit Attendance</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="short-text">
                    <div style={{ maxHeight: '300px', overflowY: 'scroll', overflowX: 'hidden', width: '100%' }}>
                        <Paper>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>ID</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Present</TableCell>
                                        <TableCell>Absent</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.courses.map(course => (
                                        <TableRow key={course.user_id}>
                                            <TableCell>{course.user_id}</TableCell>
                                            <TableCell>{course.first_name} {course.last_name}</TableCell>
                                            <TableCell><input type="radio" name={course.user_id.toString()} value={0} onChange={(e) => this.setAttendanceP(course)} /></TableCell>
                                            <TableCell><input type="radio" name={course.user_id.toString()} value={0} onChange={(e) => this.setAttendanceA(course)} /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    </div>

                    <div className="container-fluid" >
                        <div className="row extra_margin">
                            <div className="col-md-4">
                                <div className="text-center">
                                    <div>
                                        <br /><b />
                                        <p id="message"></p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <button id="submit" type="button" onClick={this.subAtt} className="btn btn-primary btn-lg">Submit Attendance</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade bd-example-modal-lg" tabIndex={-1} role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="container-fluid" style={{ width: '96%' }}>
                                <div className="row form-inline">
                                    <div className="col-11" style={{ marginLeft: "4%" }}>
                                        <br />
                                        <table className="table table-striped mb-0">
                                            <thead>
                                                <tr className="bg-info">
                                                    <th data-column="name" data-order="desc">
                                                        <div className="container-fluid">
                                                            <button type="button" id="close" className="close" data-dismiss="modal" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                            <div className="row">
                                                                <div className="col-6">
                                                                    Title <i className="fa fa-sort"
                                                                        onClick={() => sortTableNew(0, "myTable")}></i>
                                                                </div>
                                                                <div className="col-6">
                                                                    <div style={{ width: '90%', marginLeft: "15%" }}>
                                                                        Date <i className="fa fa-sort"
                                                                            onClick={() => sortTableNewNumber(1, "myTable")}></i>
                                                                    </div>
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
                                                            <td style={{ width: '50%' }}>

                                                                <a className="btn btn-link" data-toggle="collapse" href={"#collapseExample" + announcement.file_id.toString()} role="button" aria-expanded="false" aria-controls="collapseExample">
                                                                    {announcement.title}
                                                                </a>
                                                                <br />
                                                                <br />
                                                                <div className="collapse" style={{ width: "200%" }} id={"collapseExample" + announcement.file_id.toString()}>
                                                                    <div className="card card-body" style={{ width: "100%" }}>
                                                                        {announcement.message}
                                                                        <a href={announcement.file_path}
                                                                            style={(announcement.file_path === "" ? { display: "none" } : { display: "inline" })}>attachment</a>

                                                                        <div className="row">
                                                                            <button type="button" className="btn btn-warning btn-sm m-2 mt-4" id={"update" + announcement.file_id.toString()}
                                                                                onClick={(e) => this.updatePost(announcement)}
                                                                                style={(announcement.user_id === +user_id! ? { display: "inline" } : { display: "none" })}>update</button>
                                                                            <button type="button" className="btn btn-danger btn-sm m-2 mt-4" id={"delete" + announcement.file_id.toString()}
                                                                                onClick={(e) => this.deletePost(announcement.file_id)}
                                                                                style={(announcement.user_id === +user_id! ? { display: "inline" } : { display: "none" })}>delete</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td id={announcement.file_id.toString()} style={{ width: '50%' }}>{announcement.sub_date.toString().substr(0, 15)}</td>
                                                        </tr>
                                                    ))}

                                                </tbody>
                                            </table>

                                        </div>
                                    </div>
                                </div>
                                <button type="button" id="post" className="btn btn-primary m-4 mr-5" data-toggle="modal" data-target="#exampleModal">Post Assignment</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <!-- Modal --> */}
                <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Post a Message</h5>
                                <button type="button" className="close" id="closeMessage" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="card-transparent" style={{ textAlign: "left", width: "100%" }}>
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
        )
    }
}

export default MyCourseInfo

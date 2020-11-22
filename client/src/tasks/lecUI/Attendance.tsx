import React, { Component } from 'react'
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import LecturerNav from './LecturerNav';
import CSS from 'csstype';

/* eslint-disable no-useless-concat */

var courseId = (window.localStorage.getItem('courseId'));
var sectionId = (window.localStorage.getItem('sectionId'));
var class_id = (window.localStorage.getItem('flow_id'));

// var a: number;
var DatesArray: any[] = [];
var NamesArray: string | any[] = [];
const thisToken = localStorage.getItem("thisToken");

const subMesStyles: CSS.Properties = {
    position: 'relative',
    color: 'green',
    marginLeft: '1.5rem',
    marginTop: '2rem',
    marginBottom: '1.5rem',
    fontFamily: 'sans-serif',
    fontSize: '1.5rem'
};

const butStyles: CSS.Properties = {
    marginLeft: '2rem',
};


type CourseListData = {
    status: string;
    data: Array<Course>;
};

var attArr: Array<Course>;
attArr = [];

type StudentList = {
    status: string;
    data: Array<Students>;
};

type Students = {
    student_id: number;
    first_name: string;
    last_name: string;
}

type DatesData = {
    status: string;
    data: Array<Dates>;
};
type Dates = {
    date: Date;
    UIdate: string;
    lesson_number: number;
}

type Course = {
    lesson_id: number;
    date: Date;
    course_id: number;
    section_id: number;
    student_id: number;
    present: number;
    lesson_number: number;
};

interface Props { }
interface State {
    dates: Array<Dates>;
    courses: Array<Course>;
    studentList: Array<Students>;
    lesson_id: number;
    date: Date;
    UIdate: string;
    course_id: number;
    section_id: number;
    student_id: number;
    present: number;
    lesson_number: number;
    first_name: string;
    last_name: string;
}

var firstNames: string | any[] = [];
var lastNames: string | any[] = [];
var stId: number[] = [];
var dates: string[] = [];
var present: number[] = [];

export class Attendance extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            dates: [],
            courses: [],
            studentList: [],
            lesson_id: 0,
            course_id: 0,
            section_id: 0,
            student_id: 0,
            first_name: "",
            last_name: "",
            date: new Date(),
            UIdate: "",
            present: 0,
            lesson_number: 0
        };
    }


    refreshList = () => {

        fetch('https://casul-campus.herokuapp.com/myCourses/myAttendanceInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                courseId: courseId,
                section_id: sectionId
            })
        })
            .then(res => res.json())
            .then((jsonRes: CourseListData) => {
                if (jsonRes.data) {
                    this.setState({
                        courses: jsonRes.data
                    });
                    attArr = jsonRes.data;
                    present = [];
                    for (var i = 0; i < attArr.length; i++) {
                        present.push(attArr[i].present);
                    }
                } else {
                    window.location.href = "sessionEnd"
                }
            })
            .catch(error => console.log(error));

        fetch('https://casul-campus.herokuapp.com/myCourses/myDatesInfo', {
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
            .then((jsonRes2: DatesData) => {
                if (jsonRes2.data) {
                    this.setState({
                        dates: jsonRes2.data
                    });
                    DatesArray = jsonRes2.data;
                    dates = [];
                    for (var i = 0; i < DatesArray.length; i++) {
                        dates.push(new Date(DatesArray[i].date).toDateString().substr(4, 12));
                    }
                } else {

                    window.location.href = "sessionEnd"
                }
            })
            .catch(error => console.log(error));

        fetch('https://casul-campus.herokuapp.com/myCourses/myStudentList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                courseId: courseId,
                section_id: sectionId
            })
        })
            .then(res => res.json())
            .then((jsonRes3: StudentList) => {
                if (jsonRes3.data) {
                    this.setState({
                        studentList: jsonRes3.data
                    });
                    NamesArray = jsonRes3.data;
                    firstNames = [];
                    lastNames = [];
                    stId = [];
                    for (var i = 0; i < NamesArray.length; i++) {
                        firstNames.push(NamesArray[i].first_name);
                        lastNames.push(NamesArray[i].last_name);
                        stId.push(NamesArray[i].student_id);
                    }
                    this.wtfTable();
                } else {
                    window.location.href = "sessionEnd"
                }
            })
            .catch(error => console.log(error));
    };

    editAtt() {
        console.log('hello');
    }

    wtfTable() {

        var x = 0;
        var r = present.length / lastNames.length;
        var m = (present.length) - (dates.length)


        var html = "<table class='table'>";
        html += "<tr>";
        html += "<th style='height:50px; min-width:150px'>Student ID</th>"
        html += "<th style='height:50px; min-width:150px'>First Name</th>"
        html += "<th style='height:50px; min-width:150px'>Last Name</th>"
        for (var i = 0; i < lastNames.length; i++) {
            html += "<tr><td style='width:150px'>" + stId[i] + "</td>" +
                "<td style='width:150px'>" + firstNames[i] + "</td>" +
                "<td style='width:150px'>" + lastNames[i] + "</td>";

            html += "</tr>";
        }
        html += "</table>";

        document.getElementById("box1")!.innerHTML = html;

        html = "";
        html += "<table class='table'>";
        html += "<tr>";
        for (var i = 0; i < dates.length; i++) {
            html += "<th style='height:50px;min-width:150px;text-align:center' id='" + dates[i] + "'><input type='radio' name='selected' /> " + dates[i] + "</th>"
        }

        for (i = 0; i < lastNames.length; i++) {
            html += "<tr style='text-align:center'>"
            for (var j = 0 + x; j < (present.length - m); j++) {
                html += "<td id='cell" + j.toString() + "' style='" + (present[j] === 0 ? "color: red" : "color: green") + "'>" + (present[j] === 0 ? "absent" : "present") + "</td>"
            }
            html += "</tr>";
            x = x + r
            m = (m - dates.length)
        }
        html += "</table>";
        document.getElementById("box2")!.innerHTML = html;
    }


    edit() {
        console.log("edit is on")
    }

    butVal() {
        var r = (+present.length) / (+lastNames.length);
        var radioBtn: any = document.getElementsByName("selected");
        var empty = true;
        for (var i = 0; i < radioBtn.length; i++) {
            if (radioBtn[i].checked === true) {
                empty = false;
                for (var j = i; j < present.length; j = j + r) {
                    var dateVal: any = document.getElementById('cell' + j.toString())
                    dateVal.innerHTML = "<select style='height:20px;' id='pr" + j.toString() + "'> <option value=" +
                        (present[j] === 0 ? 0 : 1) + ">" + (present[j] === 0 ? "absent" : "present") + "</option>" +
                        "<option value=" +
                        (present[j] === 0 ? 1 : 0) + ">" + (present[j] === 0 ? "present" : "absent") + "</option>" +
                        "</select>"
                    var dateCellVal: any = document.getElementById('pr' + j.toString())
                }

            } else {
                for (var j = i; j < present.length; j = j + r) {
                    var dateVal: any = document.getElementById('cell' + j.toString())
                    dateVal.innerHTML = "<td id='cell" + j.toString() + "' style='" + (present[j] === 0 ? "color: red" : "color: green") + "'>" + (present[j] === 0 ? "absent" : "present") + "</td>"
                    var dateCellVal: any = document.getElementById('pr' + j.toString())
                }
            }
        }

        if (empty) {
            document.getElementById("message")!.innerHTML = "<p style='color: red'>Choose a day to edit</p>"
            return;
        }

    }

    subEdit() {
        var r = (+present.length) / (+lastNames.length);
        var radioBtn: any = document.getElementsByName("selected");
        var request = [];

        for (var i = 0; i < radioBtn.length; i++) {
            if (radioBtn[i].checked === true) {
                var selectedDay = dates[i];
                for (var j = i; j < present.length; j = j + r) {
                    var dateCellVal: any = document.getElementById('pr' + j.toString());
                    if (!dateCellVal) {
                        document.getElementById("message")!.innerHTML = "<p style='color: red'>Click 'Edit' before submitting</p>"
                        return
                    }

                    request.push({
                        "dateCellVal": dateCellVal.value, "lesson_id": attArr[j].lesson_id, "lesson_number": attArr[j].lesson_number,
                        "student_id": attArr[j].student_id
                    })
                }
                i = radioBtn.length

                fetch('https://casul-campus.herokuapp.com/myCourses/subEdit', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + thisToken
                    },
                    body: JSON.stringify({
                        request: request
                    })
                })
                    .then(res => {
                        if (res.ok) {
                            document.getElementById("message")!.innerHTML = selectedDay + " attendance submitted successfully!" + " " +
                                "<button class='btn btn-outline-primary mr-3' onclick='window.location.reload(false)'>  close edit</button><br></br>"
                        } else {

                            window.location.href = "sessionEnd"
                        }
                    })
                    .catch(error => console.log(error));

            } else {
                document.getElementById("message")!.innerHTML = "<p style='color: red'>Choose date to edit and submit</p>"
            }
        }
    }

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

    showCourseName = (course: Course) => {
        this.setState({
            lesson_id: course.lesson_id,
            date: course.date,
            course_id: course.course_id,
            student_id: course.student_id,
            present: course.present,
            lesson_number: course.lesson_number
        });
    };

    render() {
        if (present.length === 0) {
            this.refreshList();
            return <div className="App">Attendance Loading . . .</div>;
        }
        return (
            <div>
                <LecturerNav />
                <div>
                    <br />
                    <br />
                    <br />
                    <h1 className="App">Class {class_id}</h1>
                </div>
                <a href="/myCourses" className="button3">Back</a>
                <div className="App">
                    <strong>Student Attendance List</strong>
                    <br></br>
                    <br></br>
                </div>

                <div style={{ display: "flex" }}>
                    <div style={{ flex: "2", overflow: "auto" }}>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td>
                                        <div style={{ float: 'left' }} id="box1"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={{ flex: "4", overflow: "auto" }}>
                        <table style={{ width: "100%" }}>
                            <tbody>
                                <tr>
                                    <td>
                                        <div style={{ float: 'left' }} id="box2"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div><br /><button style={butStyles} className="btn btn-outline-primary mr-3" onClick={this.butVal}>Edit</button> Edit selected day</div>

                <div style={{ display: "flex" }}>
                    <div style={{ flex: "2", overflow: "auto" }}>

                        <div style={{ float: 'left' }}><div><br /><button style={butStyles} className="btn btn-outline-primary mr-3" onClick={this.subEdit}>Submit</button> Submit selected day
                </div>

                        </div>
                        <div style={{ flex: "4", overflow: "auto" }}>

                            <div style={{ float: 'left' }}><div style={subMesStyles}>
                                <b />
                                <p id="message"></p>
                            </div></div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Attendance

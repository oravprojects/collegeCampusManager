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

var class_id = (window.localStorage.getItem('flow_id'));
var courseId = (window.localStorage.getItem('courseId'));
var sectionId = (window.localStorage.getItem('sectionId'));
var rid = (window.localStorage.getItem('rid'));
var request: any[] = [];
var dataArr: any[] = [];
var gradeArr: any[] = [];


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
    position: 'relative',
    color: 'green',
    left: '1rem',
    fontFamily: 'sans-serif',
    fontSize: '1.5rem'
};

type CourseListData = {
    status: string;
    data: Array<Course>;
};

type CourseGradeData = {
    status: string;
    data: Array<Grade>;
};

type Grade = {
    id: number;
    lecturer_id: number;
    student_id: number;
    course_id: number;
    grade: number;
};


type Course = {
    user_id: number;
    first_name: string;
    last_name: string;
    lesson_id: number;
    date: Date;
    present: number;
    lesson_number: number;
    grade: number;

};

interface Props { }
interface State {
    courses: Array<Course>;
    gradeArray: Array<Grade>;
    user_id: number;
    first_name: string;
    last_name: string;
    lesson_id: number;
    date: Date;
    present: number;
    lesson_number: number;
    grade: number;
}

const thisToken = localStorage.getItem("thisToken");

export class Grades extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            courses: [],
            gradeArray: [],
            user_id: 0,
            first_name: "",
            last_name: "",
            lesson_id: 0,
            date: new Date(),
            present: 0,
            lesson_number: 0,
            grade: 0
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
                    dataArr = jsonRes.data
                }
                else {
                    alert('Session expired. Logout and login again.')
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
                            courses: dataArr
                        })
                        window.localStorage.setItem("nextLessonNumber", "1");

                    } else {
                        this.setState({
                            courses: jsonRes.data
                        });
                        dataArr = jsonRes.data;
                        window.localStorage.setItem("nextLessonNumber", (jsonRes.data[0].lesson_number + 1).toString());
                    }
                } else {
                    window.location.href = "sessionEnd"
                }

            })
            .catch(error => console.log(error));

        fetch('https://casul-campus.herokuapp.com/myCourses/myClassInfoGrades', {
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
            .then((jsonRes2: CourseGradeData) => {
                if (jsonRes2.data) {
                    this.setState({
                        gradeArray: jsonRes2.data
                    });
                    gradeArr = jsonRes2.data;
                    for (var i = 0; i < gradeArr.length; i++) {
                        document.getElementById("grade" + gradeArr[i].student_id.toString())!.innerHTML = gradeArr[i].grade;
                        document.getElementById("gradeMobile" + gradeArr[i].student_id.toString())!.innerHTML = gradeArr[i].grade
                    }
                } else {
                    window.location.href = "sessionEnd"
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

    subGrade = () => {
        if (dataArr.length === 0) {
            alert("No grades submitted");
            return;
        }
        if (localStorage.getItem("userRole") !== "lecturer") {
            alert('This is a demo version. You cannot submit grades.')
            return;
        }
        for (var i = 0; i < dataArr.length; i++) {
            var formGrade: any = document.getElementById(dataArr[i].user_id.toString())

            var grade = formGrade.value

            if (grade > 100 || grade < 0 || !grade) {
                alert("Grades must be between 0 and 100")
                return
            }

            request.push({ "student_id": dataArr[i].user_id, "section_id": dataArr[i].section_id, "grade": grade })

            // += "replace into `course_n_grades` (student_id, section_id, grade) values (" + dataArr[i].user_id + ", " +
            // dataArr[i].section_id + ", " + grade + "); "
        }

        fetch('https://casul-campus.herokuapp.com/myCourses/subGrades', {
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
                    alert("This is a demo version. You do not have permission to post grades.")
                }
                if (res.ok) {
                    // document.getElementById("message")!.innerHTML="Grades submitted successfully!" + " " +
                    // "<button class='btn btn-outline-primary mr-3' onclick='window.location.reload()'>  close </button><br></br>"
                    alert("Grades submitted successfully!");
                    this.refreshList();
                }
            })
            .catch(error => console.log(error));
    };


    subGradeMobile = () => {
        if (dataArr.length === 0) {
            alert("No grades submitted");
            return;
        }
        if (localStorage.getItem("userRole") !== "lecturer") {
            alert('This is a demo version. You cannot submit attendance.')
            return;
        }
        for (var i = 0; i < dataArr.length; i++) {
            var formGrade: any = document.getElementById("mobile" + dataArr[i].user_id.toString())

            var grade = formGrade.value

            if (grade > 100 || grade < 0 || !grade) {
                alert("Grades must be between 0 and 100")
                return
            }

            request.push({ "student_id": dataArr[i].user_id, "section_id": dataArr[i].section_id, "grade": grade })

            // request += "replace into `course_n_grades` (student_id, section_id, grade) values (" + dataArr[i].user_id + ", " +
            //     dataArr[i].section_id + ", " + grade + "); "

        }

        fetch('https://casul-campus.herokuapp.com/myCourses/subGrades', {
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
                    alert("This is a demo version. You do not have permission to post grades.")
                }
                if (res.ok) {
                    alert("Grades submitted successfully!");
                    this.refreshList();
                }
            })
            .catch(error => console.log(error));
    };



    render() {
        return (
            <div>
                <LecturerNav />
                <br />
                <br />
                <br />
                <div>
                    <h1 className="App">Class {class_id}</h1>
                    <br></br>
                </div>
                <a href="/myCourses" className="button3">Back</a>
                <br></br>
                <div className="App">
                    <h4><strong>Grades</strong></h4>
                    <br></br>
                </div>
                <div className="full-text" >
                    <Paper>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>student ID</TableCell>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell>Final Grade</TableCell>
                                    <TableCell>Current Grade</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.courses.map(course => (
                                    <TableRow key={course.user_id}>
                                        <TableCell>{course.user_id}</TableCell>
                                        <TableCell>{course.first_name}</TableCell>
                                        <TableCell>{course.last_name}</TableCell>
                                        <TableCell style={{ width: "20%" }}><input style={{ maxWidth: "30%" }} type="number" id={course.user_id.toString()} /></TableCell>
                                        <TableCell id={"grade" + course.user_id.toString()}></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>

                    <div className="container-fluid" >
                        <div className="row extra_margin">
                            <div className="col-md-4">
                                <div className="text-center">
                                    <div style={subMesStyles}>
                                        <br /><b />
                                        <p id="message"></p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-8">
                                <button id="submit" type="button" onClick={this.subGrade} style={subAttStyles} className="btn btn-primary btn-lg">Submit Grades</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="short-text">
                    <div style={{ width: "70%" }}>

                        <Table style={{ margin: "1%", padding: "0" }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell style={{ width: "20px" }}>Grade</TableCell>
                                    <TableCell>Grade</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.courses.map(course => (
                                    <TableRow style={{ height: "150px" }} key={course.user_id}>
                                        <TableCell >{course.user_id}</TableCell>
                                        <TableCell >{course.first_name} {course.last_name}</TableCell>
                                        <TableCell ><input style={{ maxWidth: "50px", padding: "5px" }} type="number" id={"mobile" + course.user_id.toString()} /></TableCell>
                                        <TableCell id={"gradeMobile" + course.user_id.toString()} ></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>


                        <div className="container-fluid" >
                            <div className="row extra_margin">
                                <div className="col-md-4">
                                    <div className="text-center">

                                        <br /><b />
                                        <p id="messageMobile"></p>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <button id="submit" type="button" onClick={this.subGradeMobile} className="btn btn-primary btn-lg">Submit Grades</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Grades

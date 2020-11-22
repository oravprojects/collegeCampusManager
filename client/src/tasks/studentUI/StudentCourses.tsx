import React, { Component } from 'react'
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";

import "../../App.css";
import StudentNav from './StudentNav';
// import CSS from 'csstype';

var user_id = (window.localStorage.getItem('user_id'));

// var fileLinkStyle: CSS.Properties = {
//     display: 'none'
// }

type CourseListData = {
    status: string;
    data: Array<Course>;
};
type Course = {
    course_id: number;
    name: string;
    hours: number;
    lecturer_id: number;
    first_name: string;
    last_name: string;
    file_path: string;
    flow_id: number;
    section: number;
    section_id: number;
};
interface Props { }
interface State {
    courses: Array<Course>;
    courseId: number;
    courseName: string;
    lecturerFirstName: string;
    lecturerLastName: string;
    hours: number;
    lecturerId: number;
    file_path: string;
    flow_id: number;
    selected: boolean;
    section: number;
    section_id: number;

}


const thisToken = localStorage.getItem("thisToken");
var user_id = window.localStorage.getItem('user_id');


export class StudentCourses extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            courses: [],
            courseId: 0,
            courseName: "",
            lecturerFirstName: "",
            lecturerLastName: "",
            hours: 0,
            lecturerId: 0,
            file_path: "",
            flow_id: 0,
            selected: false,
            section: 0,
            section_id: 0
        };
    }

    refreshList = () => {

        fetch('https://casul-campus.herokuapp.com/myCourses/studentCourseList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                user_id: user_id
            })
        })
            .then(res => res.json())
            .then((jsonRes: CourseListData) => {
                if (jsonRes.data) {
                    this.setState({
                        courses: jsonRes.data
                    });
                    for (var i = 0; i < jsonRes.data.length; i++) {
                        var cell = document.getElementById("linkCell" + jsonRes.data[i].course_id.toString()) as HTMLTableCellElement;
                        if (jsonRes.data[i].file_path === "#") {
                            cell.innerHTML = "no file attached"
                        }
                    }
                } else {
                    alert('Session expired. Logout and login again.')
                }
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


    myCourseInfo = (course: Course) => {
        this.setState({
            courseName: course.name,
            hours: course.hours,
            courseId: course.course_id,
            lecturerId: course.lecturer_id,
            lecturerFirstName: course.first_name,
            lecturerLastName: course.last_name,
            file_path: course.file_path,
            flow_id: course.flow_id,
            section: course.section,
            section_id: course.section_id,
            courses: this.state.courses
        }, () => this.CourseInfoCont(course))
    }

    CourseInfoCont = (course: Course) => {
        localStorage.setItem("courseName", this.state.courseName);
        localStorage.setItem("courseHours", this.state.hours.toString());
        localStorage.setItem("courseId", this.state.courseId.toString());
        localStorage.setItem("flow_id", this.state.flow_id.toString());
        localStorage.setItem("lecFirstName", this.state.lecturerFirstName);
        localStorage.setItem("lecLastName", this.state.lecturerLastName);
        localStorage.setItem("lecId", this.state.lecturerId.toString());
        localStorage.setItem("filePath", this.state.file_path);
        localStorage.setItem("section", this.state.section.toString());
        localStorage.setItem("sectionId", this.state.section_id.toString());
        window.location.href = "StudentCourseInfo"
    }

    render() {

        return (
            <div>
                <StudentNav />
                <br />
                <br />
                <div className="card card-body bg-light m-4" style={{ width: "18rem" }}>
                    <div>Choose a course to view grades and attendance</div>
                </div>
                <div>
                    <h1 className="App">My Courses</h1>
                </div>
                <br />
                <div style={{ width: "100%" }}>
                    <table className="scheduleTable" style={{ width: "96%", marginLeft: "2%", tableLayout: "auto", fontSize: 25 }}>
                        <thead className="scheduleTable">
                            <tr className="scheduleTable">
                                <th className="scheduleTable">Course Name</th>
                                <th className="scheduleTable">Section</th>
                                <th className="scheduleTable">Hours</th>
                                <th className="scheduleTable">Course ID</th>
                                <th className="scheduleTable">Lecturer First Name</th>
                                <th className="scheduleTable">Lecturer Last Name</th>

                            </tr>
                        </thead>
                        <tbody>
                            {this.state.courses.map(course => (
                                <tr className="scheduleTable" key={course.course_id}>
                                    <td className="scheduleTable">
                                        <button type="button" name="selected" className="btn btn-link btn-lg" style={{ textAlign: 'left', padding: '0' }}
                                            onClick={(e) => this.myCourseInfo(course)}>{course.name}</button></td>
                                    <td className="scheduleTable">{course.section}</td>
                                    <td className="scheduleTable">{course.hours}</td>
                                    <td className="scheduleTable">{course.course_id}</td>

                                    <td className="scheduleTable">{course.first_name}</td>
                                    <td className="scheduleTable">{course.last_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default StudentCourses

import React from 'react';
import "../App.css";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CSS from 'csstype';
import AdminNav from './adminUI/AdminNav';
import { sortTable, sortTableNew, sortTableNewNumber } from './sorts'


const wrapperStyles: CSS.Properties = {
    margin: '2rem',
    maxHeight: '400px',
    overflowY: 'scroll'
};

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
};

type LecturerData = {
    status: string;
    data: Array<Lecturer>;
};

type Lecturer = {
    lecturer_id: number;
    first_name: string;
    last_name: string;
}


interface Props { }
interface State {
    courses: Array<Course>;
    lecturers: Array<Lecturer>;
    courseId: number;
    courseName: string;
    lecturerFirstName: string;
    lecturerLastName: string;
    hours: number;
    lecturerId: number;
    file_path: string;
    file: any;
    selected: boolean;

}

const thisToken = localStorage.getItem("thisToken");
const rid = localStorage.getItem("rid");

class Courses extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            courses: [],
            lecturers: [],
            courseId: 0,
            courseName: "",
            lecturerFirstName: "",
            lecturerLastName: "",
            hours: 0,
            lecturerId: 0,
            file_path: "",
            file: null,
            selected: false
        };
    }

    refreshList = () => {
        fetch('https://casul-campus.herokuapp.com/courses/courseList')
            .then(res => res.json())
            .then((jsonRes: CourseListData) => {
                this.setState({
                    courses: jsonRes.data
                });
                sortTable("myTable");
            })
            .catch(error => console.log(error));

        fetch('https://casul-campus.herokuapp.com/courses/lecturerList')
            .then(res => res.json())
            .then((jsonRes: LecturerData) => {
                this.setState({
                    lecturers: jsonRes.data
                });
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

    handleCourseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            courseName: e.target.value
        })
    };

    handleHoursChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            hours: e.target.value
        })
    };

    handleLecturerIdChange = (e: React.ChangeEvent<any>) => {
        this.setState({
            lecturerId: e.target.value
        })
    };

    handleUploadFileChange = (event: any) => {
        this.setState({
            file: event.target.files[0]
        })
    };

    addNewCourse = () => {
        if (this.state.courseName === "" || this.state.hours <= 0) {
            // || this.state.lecturerId <= 0
            // || this.state.file === null) {
            return alert("all fields must be completed");
        }

        for (var i = 0; i < this.state.courses.length; i++) {
            if (this.state.courses[i].name === this.state.courseName) {
                alert("Course name already exists. Choose another name.");
                return;
            }
        }
        fetch('https://casul-campus.herokuapp.com/courses/addCourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                courseName: this.state.courseName,
                hours: this.state.hours,
                lecturerId: this.state.lecturerId,
                file: this.state.file,
                file_path: this.state.file_path,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to add courses.")
                }
                if (res.ok) {
                    alert("Course added successfully!")
                    this.refreshList();
                }
            })
            .catch(error => console.log(error));
    };

    deleteCourse = () => {
        if (this.state.courseId === 0) {
            alert("Choose the course you would like to delete.");
            return;
        }
        fetch('https://casul-campus.herokuapp.com/courses/deleteCourse', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },
            body: JSON.stringify({
                courseId: this.state.courseId,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to delete courses.")
                }
                if (res.ok) {
                    this.refreshList();
                }
            })
            .catch(error => console.log(error));
    };

    clearForm = () => {
        this.setState({
            courseName: "",
            hours: 0,
            courseId: -1,
        });
    };

    addFile = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (this.state.file === null) {
            this.addNewCourse();
            return;
        }
        const fd = new FormData();
        fd.append('userFile', this.state.file, this.state.file.name);
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
                        this.addNewCourse();
                    })
            })
            .catch(error => console.log(error));
    };

    UpdateCourseAddFile = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (this.state.file === null) {
            this.setState({ file_path: "#" }, () => this.updateCourse())
            return;
        }
        const fd = new FormData();
        fd.append('userFile', this.state.file, this.state.file.name);
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
                        this.updateCourse();
                    })
            })
            .catch(error => console.log(error));
    };


    updateCourse = () => {
        if (this.state.courseId === 0) {
            alert("Choose the course you would like to update.");
            return;
        }

        fetch('https://casul-campus.herokuapp.com/courses/updateCourse', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + thisToken
            },

            body: JSON.stringify({
                courseId: this.state.courseId,
                courseName: this.state.courseName,
                hours: this.state.hours,
                rid: rid
            })
        })
            .then(res => {
                if (res.status === 401) {
                    alert("Session expired. Logout and login again.")
                }
                if (res.status === 403) {
                    alert("This is a demo version. You do not have permission to update courses.")
                }
                if (res.ok) {
                    alert("course updated successfully!")
                    this.refreshList();
                }
            })
            .catch(error => console.log(error));
    };

    showCourseName = (course: Course) => {
        this.setState({
            courseName: course.name,
            hours: course.hours,
            courseId: course.course_id,
            courses: this.state.courses
        });
    };


    render() {
        return (
            <div>
                <AdminNav />
                <br />
                <div className="full-text">
                    <div className="card card-body bg-white w-100">
                        <div className="row no-gutters">
                            <div className="col-6 col-md-3">
                                <div className="card-body bg-light m-4">
                                    <h4 className="App">Courses Form</h4>
                                    <form id="courses">
                                        <div className="form-group">
                                            <label htmlFor="nameField">Course Name</label>
                                            <input type="text"
                                                id="courseName"
                                                className="form-control"
                                                placeholder="enter course name"
                                                value={this.state.courseName}
                                                onChange={this.handleCourseNameChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="nameField">Hours</label>
                                            <input type="text"
                                                id="courseHours"
                                                className="form-control"
                                                placeholder="enter total hours"
                                                value={(this.state.hours === 0 ? "" : this.state.hours)}
                                                onChange={this.handleHoursChange} />
                                        </div>
                                        <button onClick={this.addNewCourse}
                                            type="button"
                                            className="btn btn-outline-primary mr-3">add</button>
                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.updateCourse}>update</button>
                                        <button onClick={(e) => this.deleteCourse(/*task.student_id*/)}
                                            type="button"
                                            className="btn btn-outline-primary mr-3">delete</button>
                                        <button type="button"
                                            className="btn btn-outline-primary mr-3"
                                            onClick={this.clearForm}>clear form</button>
                                    </form>
                                </div>
                            </div>

                            <div className="col-12 col-sm-6 col-md-9">
                                <div className="card-body bg-light m-4">
                                    <h4 className="App">Courses Table</h4>

                                    <div className="row" style={{ marginLeft: "30px", height: "20px" }}>

                                        <div className="col-md-6"><b>Course Name {" "}
                                            <i className="fa fa-sort"
                                                onClick={() => sortTableNew(0, "myTable")}></i></b>
                                        </div>

                                        <div className="col-md-3" style={{ marginLeft: "40px" }}><b>Hours{" "}
                                            <i className="fa fa-sort" onClick={() => sortTableNewNumber(1, "myTable")}></i></b>
                                        </div>

                                        <div className="col-md-3" style={{ marginLeft: "-50px", maxWidth: "150px" }}><b>Course ID{" "}
                                            <i className="fa fa-sort" onClick={() => sortTableNewNumber(2, "myTable")}></i></b>
                                        </div>
                                    </div>

                                    <div className="wrapper" style={wrapperStyles}>
                                        <Paper>
                                            <Table id="myTable">
                                                <TableHead>
                                                    <TableRow>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.courses.map(course => (
                                                        <TableRow key={course.course_id}>
                                                            <TableCell style={{ maxWidth: "180px" }}>
                                                                <input type="radio" name="selected" onChange={(e) => this.showCourseName(course)} /> {course.name}</TableCell>
                                                            <TableCell>{course.hours}</TableCell>
                                                            <TableCell>{course.course_id}</TableCell>
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

                <div className="short-text">
                    <div className="card card-body bg-white w-100">
                        <div className="card-body bg-light m-4">
                            <h4 className="App">Courses Form</h4>
                            <form id="coursesMobile">
                                <div className="form-group">
                                    <label htmlFor="nameField">Course Name</label>
                                    <input type="text"
                                        id="courseNameMobile"
                                        className="form-control"
                                        placeholder="enter course name"
                                        value={this.state.courseName}
                                        onChange={this.handleCourseNameChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="nameField">Hours</label>
                                    <input type="text"
                                        id="courseHoursMobile"
                                        className="form-control"
                                        placeholder="enter total hours"
                                        value={(this.state.hours === 0 ? "" : this.state.hours)}
                                        onChange={this.handleHoursChange} />
                                </div>
                                <button onClick={this.addNewCourse}
                                    type="button"
                                    className="btn btn-outline-primary mr-3">add</button>
                                <button type="button"
                                    className="btn btn-outline-primary mr-3"
                                    onClick={this.updateCourse}>update</button>
                                <button onClick={(e) => this.deleteCourse()}
                                    type="button"
                                    className="btn btn-outline-primary mr-3">delete</button>
                                <button type="button"
                                    className="btn btn-outline-primary mr-3"
                                    onClick={this.clearForm}>clear form</button>
                            </form>
                        </div>
                    </div>

                    <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                        <table className="adminCourseTable">
                            <thead className="adminCourseTable">
                                <tr className="adminCourseTable">
                                    <th className="adminCourseTable">Course</th>
                                    <th className="adminCourseTable">Hours</th>
                                    <th className="adminCourseTable">ID</th>
                                </tr>
                            </thead>
                            <tbody className="adminCourseTable">
                                {this.state.courses.map(course => (
                                    <tr className="adminCourseTable" key={course.course_id}>
                                        <td className="adminCourseTable" >
                                            <input type="radio" name="selected" onChange={(e) => this.showCourseName(course)} /> </td>
                                        <td className="adminCourseTable">{course.name}</td>
                                        <td className="adminCourseTable">{course.hours}</td>
                                        <td className="adminCourseTable">{course.course_id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}


export default Courses;

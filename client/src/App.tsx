import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import Tasks from './tasks/Tasks';
import AdminHome from './tasks/adminUI/AdminHome';
import LecturerHome from './tasks/lecUI/LecturerHome';
import StudentHome from './tasks/studentUI/StudentHome';
import Courses from './tasks/Courses';
// import Lecturers from './tasks/Lecturers';
// import User from './tasks/User';
import login from './components/login'
import { Switch, Route } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

// import schedCourseFlow from "./components/schedCourseFlow";
// import TeacherAssignment from "./components/TeacherAssignment";
import Chat from "./components/Chat";
import MyCourses from "./tasks/lecUI/MyCourses";
import MyCourseInfo from "./tasks/lecUI/myCourseInfo";
import Attendance from "./tasks/lecUI/Attendance";
import Registration from "./tasks/adminUI/Registration";
import UserManager from "./tasks/adminUI/UserManager";
import Speciality from "./tasks/adminUI/Speciality";
import SpecManager from "./tasks/adminUI/SpecManager";
import '../node_modules/@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '../node_modules/@fortawesome/fontawesome-free/css/solid.min.css';
import Calendar from "./components/Calendar";
import Grades from "./tasks/lecUI/Grades";
import Flow from "./tasks/adminUI/Flow";
import FlowStudent from "./tasks/adminUI/FlowStudent";
import JoinChat from "./components/JoinChat";
import sessionEnd from "./tasks/adminUI/sessionEnd";
import holidayDates from "./tasks/adminUI/holidayDates";
import StudentCourses from "./tasks/studentUI/StudentCourses";
import StudentCourseInfo from "./tasks/studentUI/StudentCourseInfo";
import StudentProfile from "./tasks/studentUI/StudentProfile";
import Forum from "./components/Forum";
import Sections from "./tasks/Sections";
import ChatHistory from "./tasks/adminUI/ChatHistory";
// import AppSched from "./components/AppSched";


const App: React.FC = () => {
    return (
        <div>
            <div>
                <Switch>
                    <Route exact path="/courses" component={Courses} />
                    <Route exact path="/sections" component={Sections} />
                    <Route exact path="/" component={login} />
                    <Route exact path="/Chat" component={Chat} />
                    <Route exact path="/joinChat" component={JoinChat} />
                    <Route exact path="/MyCourses" component={MyCourses} />
                    <Route exact path="/StudentCourses" component={StudentCourses} />
                    <Route exact path="/AdminHome" component={AdminHome} />
                    <Route exact path="/LecturerHome" component={LecturerHome} />
                    <Route exact path="/StudentHome" component={StudentHome} />
                    <Route exact path="/myCourseInfo" component={MyCourseInfo} />
                    <Route exact path="/StudentCourseInfo" component={StudentCourseInfo} />
                    <Route exact path="/Registration" component={Registration} />
                    <Route exact path="/Specialities" component={Speciality} />
                    <Route exact path="/SpecManager" component={SpecManager} />
                    <Route exact path="/UserManager" component={UserManager} />
                    <Route exact path="/myAttendanceInfo" component={Attendance} />
                    <Route exact path="/grades" component={Grades} />
                    <Route exact path="/UserManager" component={UserManager} />
                    <Route exact path="/Calendar" component={Calendar} />
                    <Route exact path="/Forum" component={Forum} />
                    <Route exact path="/flows" component={Flow} />
                    <Route exact path="/flowStudent" component={FlowStudent} />
                    <Route exact path="/sessionEnd" component={sessionEnd} />
                    <Route exact path="/holidayDates" component={holidayDates} />
                    <Route exact path="/chatHistory" component={ChatHistory} />
                    <Route exact path="/studentProfile" component={StudentProfile} />
                    {/* <Route exact path="/AppSched" component={AppSched} /> */}
                    </Switch>
            </div>
        </div>
    );
};

export default App;
import React, { Component } from 'react';
export class sessionEnd extends Component {

    render() {
        return (
            <div>
                <h4 className="m-4">Session Expired. Please login again.</h4>
                <a style={{marginLeft:"20px", padding:"10px"}} className="btn btn-primary" href="/" role="button">Login</a>
            </div>
        );
    };
}

export default sessionEnd;
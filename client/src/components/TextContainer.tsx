import React from 'react';
import onlineIcon from '../chatIcons/onlineIcon.png';
import './TextContainer.css';
import CSS from 'csstype';

const textContainerStyle: CSS.Properties = {
  display: "flex",
  flexDirection: "column",
  marginLeft: "10px",
  marginRight: "0px",
  color: "white",
  height: "100%",
  justifyContent: "space-between",
  overflowY: "auto",
  minWidth:"350px",
  maxWidth:"350px",
  minHeight:"400px",
  maxHeight: "400px"
};

const TextContainer = ({ users }:{users:any}) => (
  <div className="textContainer" style={textContainerStyle}>
    {
      users
        ? (
          <div>
            <h2>currently chatting:</h2>
            <div className="activeContainer">
              <h3>
              {users.map(({name}:{name:any}) => (
                  <div key={name} className="activeItem">
                  <img alt="Online Icon" src={onlineIcon} style={{padding: "10px"}}/>
                  {name}
                </div>
                ))}
              </h3>
            </div>
          </div>
        )
        : null
    }
  </div>
);

export default TextContainer;

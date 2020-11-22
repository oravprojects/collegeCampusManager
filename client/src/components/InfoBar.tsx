import React from 'react';
import closeIcon from '../chatIcons/closeIcon.png';
import onlineIcon from '../chatIcons/onlineIcon.png';

import './InfoBar.css';

/* eslint-disable no-debugger, no-console */

const InfoBar = ({ room }: { room: any }) => (
    <div className="infoBar" >
        <div className="leftInnerContainer" >
            <img className="onlineIcon" src={onlineIcon} alt="onlineIcon" />
            <h3>{room}</h3>
        </div>
        <div className="rightInnerContainer">
            <a href="/joinChat"><img src={closeIcon} alt="closeIcon" /></a>
        </div>
    </div>
    );

export default InfoBar;
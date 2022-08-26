import React from 'react';
import {NavDropdown} from "react-bootstrap";
import {Link} from "react-router-dom";

const SelectionBar = () => {

    return (

        <ul className="nav navbar-nav">
            <li className="active"><a href="#">Home</a></li>
            <li><a href="#about">About</a></li>
            <li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                   aria-expanded="true"> <span className="nav-label">Services</span> <span className="caret"></span></a>
                <ul className="dropdown-menu">
                    <li><a href="#">Service A</a></li>
                    <li><a href="#">Service B</a></li>
                    <li className="dropdown-submenu">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
                           aria-haspopup="true" aria-expanded="false"> <span className="nav-label">Service C</span><span
                            className="caret"></span></a>
                        <ul className="dropdown-menu">
                            <li><a href="#">Service C1</a></li>
                            <li><a href="#">Service C2</a></li>
                            <li><a href="#">Service C3</a></li>
                            <li><a href="#">Service C4</a></li>
                            <li><a href="#">Service C5</a></li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    )
}
export default SelectionBar;

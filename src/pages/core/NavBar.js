import React , {Component} from 'react';
import {Navbar ,Button ,Nav ,NavDropdown} from "react-bootstrap";
import { Link } from 'react-router-dom'

// import Nav from "react-bootstrap";
// import NavDropdown from "react-bootstrap";
// import Button from "react-bootstrap";

class NavBar extends Component{

    render() {
        return(
            <Navbar bg="light" expand="lg" style={{paddingLeft:'250px',paddingRight:'250px'}}>
                {/*<Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>*/}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link >
                            <Link to="/">Home</Link>
                        </Nav.Link>
                        <Nav.Link>
                            <Link to="/about">About</Link>
                        </Nav.Link>
                        <NavDropdown title="Studios" id="basic-nav-dropdown">
                            <NavDropdown.Item>
                                <Link to="/studios" >Willow</Link>
                            </NavDropdown.Item>
                            {/*<NavDropdown.Item href="#action/3.2">Studio 2</NavDropdown.Item>*/}
                            {/*<NavDropdown.Item href="#action/3.3">Studio 3</NavDropdown.Item>*/}
                            {/*<NavDropdown.Divider />*/}
                            {/*<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
                        </NavDropdown>
                    </Nav>
                    <div inline>
                        <Button variant="">Contact us</Button>
                    </div>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
export default NavBar;

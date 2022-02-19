import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'

function NavBar() {
  return (
    <Navbar bg="dark" variant="dark">
        <Container>
            <Nav>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
            </Nav>
        </Container>
  </Navbar>
  )
}

export default NavBar
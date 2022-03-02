import React, { useContext } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import UserContext from '../context/userContext'
import { useNavigate } from 'react-router-dom'

function NavBar() {


  const {loggedIn, setLoggedIn} = useContext(UserContext)
  const navigate = useNavigate();
  console.log(loggedIn)

  const handleLogout = (e) => {
    e.preventDefault();
    setLoggedIn(false)
    navigate('/login')
}

  return (
    <Navbar bg="dark" variant="dark">
        <Container>
            <Nav>
            {loggedIn && <Nav.Link href="/home">Home</Nav.Link>}
            {loggedIn && <Nav.Link href="/">Profile</Nav.Link>}
            {loggedIn && <Nav.Link href="/login" onClick={(e) => handleLogout(e)}>Logout</Nav.Link>}
            {!loggedIn && <Nav.Link href="/login">Login</Nav.Link>}
            {!loggedIn && <Nav.Link href="/login">Register</Nav.Link>}
            </Nav>
        </Container>
  </Navbar>
  )
}

export default NavBar
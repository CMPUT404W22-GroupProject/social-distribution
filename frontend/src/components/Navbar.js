import React, { useContext, useEffect } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import UserContext from '../context/userContext'
import { Link, useNavigate } from 'react-router-dom'


const linkStyle = {
  margin: "1rem",
  textDecoration: "none",
  color: 'white'
};

function NavBar() {


  let {loggedIn, setLoggedIn} = useContext(UserContext)
  const {token, setToken} = useContext(UserContext)
  //const {id, setId} = useContext(UserContext)
  const id =  'ad35500f-14e6-42c4-af9e-6eec0b8a29a5'
  const navigate = useNavigate();


  useEffect(() => {
    
  })

  const handleLogout = (e) => {
    e.preventDefault();
    setLoggedIn(false)
    setToken('')
    //setId('')
    navigate('/login')
}

  return (
    <Navbar bg="dark" variant="dark">
        <Container>
            <Nav>
            {loggedIn && (<Link style={linkStyle} to='/home'>Home</Link>)}
            {loggedIn && (<Link style={linkStyle} to={`/profile/:${id}`}>Profile</Link>)}
            {loggedIn && (<Link style={linkStyle} onClick={(e) => handleLogout(e)} to='/login'>Logout</Link>)}

            {!loggedIn && (<Link style={linkStyle} to='/login'>Login</Link>)}
            </Nav>
        </Container>
  </Navbar>
  )
}

export default NavBar
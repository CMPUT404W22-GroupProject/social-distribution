import React, { useContext, useEffect, useState } from 'react'
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

  //const {id, setId} = useContext(UserContext)
  const [user, setUser] = useState(localStorage.getItem('user'))
  const navigate = useNavigate();


  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user')
    setUser(null)
    console.log("LOUGOUT",localStorage.getItem('user'))
    navigate('/login')
  }

  useEffect(() => {
    setUser(localStorage.getItem('user'))
  }, [localStorage.getItem('user')])


  return (
      <Navbar bg="dark" variant="dark">
      <Container>
          <Nav> 
            {user && (<Link style={linkStyle} to={`/profile/${JSON.parse(user).user.uuid}`}>Inbox</Link>)}
            {user && (<Link style={linkStyle} to={`/profile/${JSON.parse(user).user.uuid}`}>Home</Link>)}
            {user && (<Link style={linkStyle} onClick={(e) => handleLogout(e)} to='/login'>Logout</Link>)}
            {!user && (<Link style={linkStyle} to={'/login'}>Login</Link>)}
            {!user && (<Link style={linkStyle} to={'/register'}>Register</Link>)}
          </Nav>
      </Container>
      </Navbar>
    )
}

export default NavBar
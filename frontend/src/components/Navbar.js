import React, { useContext, useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import UserContext from '../context/userContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
const API_URL = "https://cmput-404-w22-group-10-backend.herokuapp.com/"


const linkStyle = {
  margin: "1rem",
  textDecoration: "none",
  color: 'white'
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'))
};

function NavBar() {

  //const {id, setId} = useContext(UserContext)
  const [user, setUser] = useState(localStorage.getItem('user'))
  const navigate = useNavigate();


<<<<<<< HEAD
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user')
    setUser(null)
    console.log("LOUGOUT",localStorage.getItem('user'))
=======
  useEffect(() => {
    
  })

  const logout = () => {
    var current = getCurrentUser();
    localStorage.removeItem('user');
    return axios.post(API_URL+'logout/', {}, {
      headers: {
        'Authorization': 'token ' + current.token
      }
    }
    )
    .then((response) => {
      console.log(response.data)
        return response.data
    });
};

  const handleLogout = (e) => {
    e.preventDefault();
    var current = getCurrentUser();
    console.log(current);
    logout()
>>>>>>> a4d3d84473d07ad59a8aa16266d36289c9c71781
    navigate('/login')
  }

  useEffect(() => {
    setUser(localStorage.getItem('user'))
  }, [localStorage.getItem('user')])


  return (
      <Navbar bg="dark" variant="dark">
      <Container>
          <Nav> 
            {user && (<Link style={linkStyle} to={`/authors/${JSON.parse(user).user.uuid}/inbox`}>Inbox</Link>)}
            {user && (<Link style={linkStyle} to={`/authors/${JSON.parse(user).user.uuid}/posts`}>Posts</Link>)}
            {user && (<Link style={linkStyle} to={`/profile/${JSON.parse(user).user.uuid}`} state={{state: user}}>Profile</Link>)}
            {user && (<Link style={linkStyle} onClick={(e) => handleLogout(e)} to='/login'>Logout</Link>)}
            {!user && (<Link style={linkStyle} to={'/login'}>Login</Link>)}
            {!user && (<Link style={linkStyle} to={'/register'}>Register</Link>)}
          </Nav>
      </Container>
      </Navbar>
    )
}

export default NavBar
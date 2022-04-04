import React, { useContext, useEffect, useState } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import UserContext from '../context/userContext'
import { Link, useNavigate } from 'react-router-dom'
import PublicIcon from '@mui/icons-material/Public';
import LogoutIcon from '@mui/icons-material/Logout';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import PersonIcon from '@mui/icons-material/Person';
import './navbar.css'
import axios from "axios";
const API_URL = "https://cmput-404-w22-group-10-backend.herokuapp.com/"


// const linkStyle = {
//   margin: "1rem",
//   textDecoration: "none",
//   color: 'black'
// };

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'))
};

function NavBar() {

  //const {id, setId} = useContext(UserContext)
  const [user, setUser] = useState(localStorage.getItem('user'))
  const navigate = useNavigate();


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
    navigate('/login')
  }

  const currentPage = (e) => {
    e.preventDefault();
    console.log("heyyyyyyyy",e)
    var oldElement = document.getElementByClassName("currentPage");
    oldElement.classList.remove("currentPage");
    var newElement = document.getElementById(e);
    newElement.classList.add("currentPage")
  }
  let navLink = document.getElementsByClassName('nav-item');
    for (let i = 0; i < navLink.length; i++) {
      if(navLink[i].href === window.location.href) {
          navLink[i].classList.add('style-change');
        }
      else {
        navLink[i].classList.remove('style-change');
      }
    }

  useEffect(() => {
    setUser(localStorage.getItem('user'))
  }, [localStorage.getItem('user')])


  return (
      <Navbar bg="light" variant="light" fixed="top">
      <Container>
          <Nav id="here"> 
            {/* {user && (<Link style={linkStyle} to={`/authors/${JSON.parse(user).user.uuid}/posts/`}>Posts</Link>)} */}
            {user && (<Link class="nav-item" to='/publicPosts'><PublicIcon></PublicIcon>Public Posts</Link>)}
            {user && (<Link class="nav-item style-change" id="inbox" to={`/authors/${JSON.parse(user).user.uuid}/inbox/`}><MoveToInboxIcon></MoveToInboxIcon>Inbox</Link>)}
            {user && (<Link class="nav-item" to={`/profile/${JSON.parse(user).user.uuid}`} state={{state: user}}><PersonIcon></PersonIcon>Profile</Link>)}
            {user && (<Link onClick={(e) => handleLogout(e)} to='/login'>Logout<LogoutIcon></LogoutIcon></Link>)}
            {!user && (<Link class="nav-item" to={'/login'}>Login</Link>)}
            {!user && (<Link class="nav-item" to={'/register'}>Register</Link>)}
          </Nav>
      </Container>
      </Navbar>
    )
}

export default NavBar
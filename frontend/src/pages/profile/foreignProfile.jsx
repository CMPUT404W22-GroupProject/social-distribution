import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios'
import { useLocation } from 'react-router-dom'
import Post from '../../components/Post'
import Feed from '../../components/feed/Feed';

function ForeignProfile() {
  
  const [page, setPage] = useState(1);
  const location = useLocation()
  const user = JSON.parse(location.state.state)
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const [auth, setAuth] = useState(null)
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(1);
  const [recievedData, setRecievedData] = useState([]);
  const team0 = "http://tik-tak-toe-cmput404.herokuapp.com/authors"
  const team4 = "http://backend-404.herokuapp.com"
  const team9 = "https://cmput-404-w22-project-group09.herokuapp.com/service"
  const team0Authorization = btoa("admin:tX7^iS8a5Ky$^S");
  const team9Authorization = btoa("group10:pwd1010");
  const team4Authorization = btoa("Team10:abcdefg");
  const host = user.user.host
  const feedId = JSON.stringify({id: user.user.uuid})
  
  

  useEffect(() => {
    const getAuth = async () => {
        if (host == team0){
            setAuth(team0Authorization)
        }
        if (host == team4){
            setAuth(team4Authorization)
        }
        if (host == team9){
            setAuth(team9Authorization)
        }
    }
    const fetchAuthors = async () => {
        const result = await axios.get(team9 + '/authors',{
            headers: {
              'Authorization': 'Basic ' + team9Authorization
            }});

        console.log(result.data.items)
    }


    getAuth()
    fetchAuthors()
  },[user.user.uuid])

  const handleCallBack = (childData) => {
    //https://www.geeksforgeeks.org/how-to-pass-data-from-child-component-to-its-parent-in-reactjs/
    setPage(childData);
   }

  return (
    <div>
        <h1>Remote author</h1>
        <h2>{user.user.displayName}</h2>
        
        <div>

          <Feed id={feedId} feedType={'posts'} />

        </div>

    </div>
  )
}

export default ForeignProfile
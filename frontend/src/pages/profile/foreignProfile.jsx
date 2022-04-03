import React, { useEffect } from 'react'
import { useState } from 'react';
import axios from 'axios'
import { useLocation } from 'react-router-dom'

function ForeignProfile() {
  
  const [page, setPage] = useState(1);
  const location = useLocation()
  const user = JSON.parse(location.state.state)
  const [auth, setAuth] = useState(null)
  const [posts, setPosts] = useState([]);
  const [count, setCount] = useState(1);
  const [recievedData, setRecievedData] = useState([]);
  const team0 = "http://tik-tak-toe-cmput404.herokuapp.com/authors/"
  const team4 = "http://backend-404.herokuapp.com"
  const team9 = "https://cmput-404-w22-project-group09.herokuapp.com/service"
  const team0Authorization = btoa("admin:tX7^iS8a5Ky$^S");
  const team9Authorization = btoa("group10:pwd1010");
  const team4Authorization = btoa("Team10:abcdefg");
  const host = "https://cmput-404-w22-project-group09.herokuapp.com/service"

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

    const fetchPosts = async (host) => {
            if (page === 1){
                const result = await axios.get(host + "/authors/" + user.user.uuid + "/posts", {
                    headers: {
                      'Authorization': 'Basic ' + team9Authorization
                    }});
                setRecievedData(result);
                setCount(result.data.count);
                 //puts posts in array + sorts from newest to oldest
                setPosts(result.data.items.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));
            }else {
                const result = await axios.get(host + "/authors/" + user.user.uuid+ "/posts?page=" + page, {
                    headers: {
                      'Authorization': 'Basic ' + team9Authorization
                    }});
                setCount(result.data.count);
                setRecievedData(result);
                //puts posts in array + sorts from newest to oldest
                setPosts(result.data.results.sort((p1, p2) => {
                return new Date(p2.published) - new Date(p1.published)
            }));
            }

    
    }

    getAuth()
    fetchPosts(host)
  })

  const handleCallBack = (childData) => {
    //https://www.geeksforgeeks.org/how-to-pass-data-from-child-component-to-its-parent-in-reactjs/
    setPage(childData);
   }

  return (
    <div>
        <h1>Remote author</h1>
        <h2>{user.user.displayName}</h2>
        
    </div>
  )
}

export default ForeignProfile
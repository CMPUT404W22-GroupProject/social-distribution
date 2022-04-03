import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PaginationControlled from '../paginationFeed'

function AuthorsList({host}) {

  const URL0 = "http://tik-tak-toe-cmput404.herokuapp.com/authors/"
  const URL4 = "http://backend-404.herokuapp.com"
  const URL9 = "https://cmput-404-w22-project-group09.herokuapp.com/service"
  const URL10 = "https://cmput-404-w22-group-10-backend.herokuapp.com"
  const team0Authorization = btoa("admin:tX7^iS8a5Ky$^S");
  const team9Authorization = btoa("group10:pwd1010");
  const team4Authorization = btoa("Team10:abcdefg");
  const user = JSON.parse(localStorage.getItem('user'))
  const team10Authorization = user.token


  const [localAuthors, setLocalAuthors] = useState([])
  const [page, setPage] = useState([1])
  const [recievedData, setRecievedData] = useState([]);
  const [count, setCount] = useState(1);

  useEffect(()=> {

      const fetchAuthors = async () => {
        const result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/",{
          headers: {
            'Authorization': 'Basic ' + team10Authorization
          }});

        console.log(result)
      }

    fetchAuthors()
  },[page])


  const handleCallBack = (childData) => {
    //https://www.geeksforgeeks.org/how-to-pass-data-from-child-component-to-its-parent-in-reactjs/
    setPage(childData);
  }


  return (
    <div>
        <ul>
            <button>Local Authors</button>
            <button>Remote Authors</button>           
        </ul>

        <div>
          <PaginationControlled count = {count} parentCallBack = {handleCallBack}/>
          <ul>
            {console.log('DIRECT', localAuthors)}
          </ul>
        </div>
    </div>
  )
}

export default AuthorsList
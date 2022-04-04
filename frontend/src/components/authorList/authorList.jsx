import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PaginationControlled from '../paginationFeed'
import { Card } from '@mui/material';
import { Avatar } from '@mui/material';
import { CardHeader } from '@mui/material';
import { Link } from 'react-router-dom';

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
  const [id, setId] = useState(null)

  useEffect(()=> {


      const fetchAuthors = async () => {

        if (page == 1){
          const result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors",{
            headers: {
              'Authorization': 'token ' + team10Authorization
            }});
          setCount(result.data.count)
          setLocalAuthors(result.data.items)
        }else{
          const result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/?page="+ page  ,{
            headers: {
              'Authorization': 'token ' + team10Authorization
            }});
          setLocalAuthors(result.data.items)
          setCount(result.data.count)
        }
      }



    fetchAuthors()
  },[page])


  const handleCallBack = (childData) => {
    //https://www.geeksforgeeks.org/how-to-pass-data-from-child-component-to-its-parent-in-reactjs/
    setPage(childData);
  }

  function getId(id){
    var n = id.lastIndexOf('/');
    var result = id.substring(n + 1); 
    return result 
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
            {console.log(localAuthors)}
              {localAuthors.map(author => (
                <li>
                  <Link to={`/profile/${getId(author.id)}`}>
                    <Card>
                    <CardHeader
                        avatar={<Avatar alt="An apple" src={author.profileImage} />}
                        title={author.displayName}
                        titleTypographyProps={{ variant: "h4", component: "span" }}
                      />
                    </Card>
                  </Link>
                </li>
              ))}

          </ul>

        </div>
    </div>
  )
}

export default AuthorsList
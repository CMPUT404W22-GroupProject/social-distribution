import React, { useContext, useEffect, useState } from 'react' 
import FollowerCard from '../followerCard/followerCard'
import axios from 'axios'

import './followerList.css'

function FollowerList({profileId}) {

  const [followers, setFollowers] = useState([])
  const [foreignFollowers, setForeignFollowers] = useState([])
  const URL10 = "https://cmput-404-w22-group-10-backend.herokuapp.com"
  const URL9 = "https://cmput-404-w22-project-group09.herokuapp.com/service"
  const URL4 = "http://backend-404.herokuapp.com"
  const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
  const team9Authorization = btoa("group10:pwd1010");
  const team4Authorization = btoa("Team10:abcdefg");
  const team10token = JSON.parse(localStorage.getItem('user')).token

  useEffect(() => {

    const fetchLocalFollowers = async () => {
        const result = await axios.get(URL10 + "/authors/" + profileId + "/followers", {
            headers: {
              'Authorization': 'token ' + team10token
              //'Authorization': 'Basic ' + team10Authorization
            }});
        setFollowers(result.data.items)
        return 0     
    }
    const fetchTeam9Followers = async () => {
      const result = await axios.get(URL9 + "/authors/" + profileId + "/followers", {
        headers: {
          'Authorization': 'token ' + team9Authorization
          //'Authorization': 'Basic ' + team10Authorization
        }});
      setForeignFollowers(...result.data.items)
      return 0
    }

    const fetchTeam4Followers = async () => {
      const result = await axios.get(URL10 + "/authors/" + profileId + "/followers", {
        headers: {
          'Authorization': 'token ' + team9Authorization
          //'Authorization': 'Basic ' + team10Authorization
        }});
      setForeignFollowers(...result.data.items)
      return 0
    }

    fetchLocalFollowers()
  },[])
  

  return (
    <div className='followersContainer'>
            <ul className='list'>
                {followers.map(follower => (<li><FollowerCard follower={follower}/></li>))}
            </ul>
    </div>
  )
}

export default FollowerList
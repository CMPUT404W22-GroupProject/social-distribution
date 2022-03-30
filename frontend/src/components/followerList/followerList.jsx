import React, { useContext, useEffect, useState } from 'react' 
import FollowerCard from '../followerCard/followerCard'
import axios from 'axios'

import './followerList.css'

function FollowerList({profileId}) {

  const [followers, setFollowers] = useState([])
  const URL10 = "https://cmput-404-w22-group-10-backend.herokuapp.com"
  const URL9 = "https://cmput-404-w22-project-group09.herokuapp.com/service"
  const URL4 = "http://backend-404.herokuapp.com"
  const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
  const team9Authorization = btoa("group10:pwd1010");
  const team4Authorization = btoa("Team10:abcdefg");

  useEffect(() => {

    const fetchFollowers = async () => {

        const result = await axios.get(URL10 + "/authors/" + profileId + "/followers", {
            headers: {
              'Authorization': 'Basic ' + team10Authorization
            }});
        
        setFollowers(result.data.items)
        
        return 0
        
    }
    fetchFollowers()
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
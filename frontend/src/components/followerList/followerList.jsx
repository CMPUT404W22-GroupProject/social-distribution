import React, { useContext, useEffect, useState } from 'react' 
import FollowerCard from '../followerCard/followerCard'
import axios from 'axios'

import './followerList.css'

function FollowerList({profileId}) {

  const [followers, setFollowers] = useState([])
  const URL10 = "https://cmput-404-w22-group-10-backend.herokuapp.com"
  const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");

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
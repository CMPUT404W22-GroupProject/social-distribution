import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { DriveEtaRounded } from '@mui/icons-material';
import axios from 'axios';



function FollowerCard({follower}) {

  const team10token = JSON.parse(localStorage.getItem('user')).token
  const URL10 = "https://cmput-404-w22-group-10-backend.herokuapp.com"
  const [localAuthor, setLocalAuthor] = useState(true)
  const [isFriend, setIsFriend] = useState(false)
  const author = follower.id
  const currentUser = JSON.parse(localStorage.getItem('user'))
  const id = author.substring(author.lastIndexOf('/') + 1)

  var followerObject = {
    user: {
      uuid: id,
      displayName: follower.displayName,
      email: follower,
      host: follower.host
    }
  }
  const user = JSON.stringify(followerObject)


  useEffect(() => {

    if(follower.host != URL10){
      setLocalAuthor(false)
  }


    const checkFriendship = async () => {
      const res = await axios.get(URL10 + "/authors/" + id + "/followers", {
          headers: {
            'Authorization': 'token ' + team10token
            //'Authorization': 'Basic ' + team10Authorization
          }});
      
      const followers = res.data.items

      for(var i =0; i<followers.length; i++){
        if (followers[i].displayName === currentUser.user.displayName){
          setIsFriend(true)
        }
      }

      return 0     
  }

  checkFriendship()

  },[])

  return (
    <div>

    {localAuthor ? (
        <Link to={`/profile/${id}`} state={{state: user}}>
          <Card sx={{ maxWidth: 900 }}>
            <CardActionArea >
              <CardContent>
                  <Typography align='start' gutterBottom variant="h5" component="div">
                  {follower.displayName}
                  </Typography>
                  <Typography align='start' variant="body2" color="text.secondary">
                  {follower.host}
                  </Typography>
                  {isFriend && (
                    <Typography align='end' variant="body2" color="text.secondary">
                    Friend 
                    </Typography>
                  )}
              </CardContent>
            </CardActionArea>
        </Card>
        </Link>
    ): (
      <Link to={`/fprofile/${id}`} state={{state: user}}>
      {console.log("card", follower)}
      <Card sx={{ maxWidth: 900 }}>
        <CardActionArea >
          <CardContent>
              <Typography align='start' gutterBottom variant="h5" component="div">
              {follower.displayName}
              </Typography>
              <Typography align='start' variant="body2" color="text.secondary">
              {follower.host}
              </Typography>
              {isFriend && (
                <Typography align='end' variant="body2" color="text.secondary">
                Friend 
                </Typography>
              )}
          </CardContent>
        </CardActionArea>
    </Card>
    </Link>
    )}

  </div>
  )
}

export default FollowerCard;
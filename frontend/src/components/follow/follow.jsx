import {Card} from 'react-bootstrap'
import PersonIcon from '@mui/icons-material/Person'
import {Button} from 'react-bootstrap'
import './follow.css'
import {useState, useEffect} from 'react'
import axios from "axios"
import {format} from "timeago.js"

function Follow({follow}){
    //This is the follow card displayed in the inbox to notify if a follow request has been recieved,
    //and handles accept and decline of requests

    const team4Authorization = btoa("Team10:abcdefg");
    const team9Authorization = btoa("group10:pwd1010");
    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
    const team10token = JSON.parse(localStorage.getItem('user')).token

    console.log("WHO HAS FOLLOWED: ", follow)

    const acceptFollow = async () => {
        //if user chooses accept
        //sends POST request to ***/followers of logged in user (so my AuthorId), with follower object
        console.log("Follow Accepted!");
        alert("You have accepted the request!");
        console.log("FOLLLOW REQUEST: ", follow)
        const foreignAuthorIdUrl = new URL(follow.actor.id);
        const foreignAuthorIdPathname = foreignAuthorIdUrl.pathname;
        //const foreignAuthorId = foreignAuthorIdPathname.replace("/service/authors/", "")//for team9
        const foreignAuthorId = foreignAuthorIdPathname.replace("/authors/", "").replace("/", "")


        await axios.put(follow.object.id + "/followers/" + foreignAuthorId, follow, {
            headers: {
              'Authorization': 'token ' + team10token
              //'Authorization': 'Basic ' + team10Authorization
            }
          })
            .then((response) => {
                if (response.status === 201){
                    alert("Succesfully accepted follow request!");
                } else {
                    alert("Oops, something went wrong!");
                }
            })

           /* var followRe  =     {
                "type": "Follow",      
                "summary":"Greg wants to follow Lara",
                "actor":{
                    "type":"author",
                    "id":"https://cmput-404-w22-group-10-backend.herokuapp.com/authors…b6d8-c8b9440a75c4/posts/02080038-62af-4db2-921f-cd283648fca6",
                    "url":"https://cmput-404-w22-group-10-backend.herokuapp.com/authors…b6d8-c8b9440a75c4/posts/02080038-62af-4db2-921f-cd283648fca6",
                    "host":"https://cmput-404-w22-group-10-backend.herokuapp.com",
                    "displayName":"Greg Johnson",
                    "github": "http://github.com/gjohnson",
                    "profileImage": "https://i.imgur.com/k7XVwpB.jpeg"
                },
                "object": follow.actor
            }

        await axios.post(foreignAuthorIdUrl + '/inbox', followRe)
            .then((response) => {
                if (response.status === 201){
                    alert("Succesfully accepted follow request!");
                } else {
                    alert("Oops, something went wrong!");
                }
            })
 */
  
    
    }

    return(
        <div className='followCard'>
            <Card >
                <Card.Header>
                    <div className="followTopLeft">
                    {/* <img className="postProfileImg" /> */}
                    <PersonIcon className="followProfileImg"/>
                    <span className="followUsername">{follow.actor.displayName}</span>
                    <span className="followDate">{format(follow.published)}</span>
                     </div> 
                </Card.Header>
                <div className="followDetails">
                    <Card.Text>
                        {follow.summary}
                    </Card.Text>
                    <div className="followButtons">
                        <Button  className="acceptFollowButton" onClick={acceptFollow}>Accept</Button>
                        <Button  className="declineFollowButton" onClick={declineFollow} >Decline</Button>
                    </div>
                </div>

            </Card>

        </div>
    )


    function declineFollow () {
        //if a user chooses decline
        //send DEL request to ***/inbox of logged in user and deletes this follower object
        console.log("Follow Declined!");
        alert("You have declined the request!");
        
    };
   


}

export default Follow;
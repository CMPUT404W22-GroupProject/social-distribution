import {Card} from 'react-bootstrap'
import PersonIcon from '@mui/icons-material/Person'
import {Button} from 'react-bootstrap'
import './follow.css'
import {useState, useEffect} from 'react'
import axios from "axios"
import {format} from "timeago.js"

function Follow({follow, team}){
    //This is the follow card displayed in the inbox to notify if a follow request has been recieved,
    //and handles accept and decline of requests

    const acceptFollow = async () => {
        //if user chooses accept
        //sends POST request to ***/followers of logged in user (so my AuthorId), with follower object
        console.log("Follow Accepted!");
        alert("You have accepted the request!");

        await axios.post(follow.object.id + "/followers/")
            .then((response) => {
                if (response.status === 201){
                    alert("Succesfully accepted follow request!");
                } else {
                    alert("Oops, something went wrong!");
                }
            })

    
    }

    return(
        <div className='followCard'>
            <Card >
                <Card.Header>
                    <div className="followTopLeft">
                    {/* <img className="postProfileImg" /> */}
                    <PersonIcon className="followProfileImg"/>
                    <span className="followUsername">{follow.actor.displayName}</span>
                    <span className="followDate">{}</span>
                     </div> 
                </Card.Header>
                <Card.Body className="text-center">
                        <Card.Text>
                            {follow.summary}
                        </Card.Text>
                     
                </Card.Body>
                <Card.Footer>
                <Button  className="acceptFollowButton" onClick={acceptFollow}>Accept</Button>
                <Button  className="declineFollowButton" onClick={declineFollow} >Decline</Button>
                </Card.Footer>

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
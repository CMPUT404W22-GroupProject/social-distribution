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
    const foreignAuthorIdUrl = new URL(follow.actor.id);
    const foreignAuthorIdHostname = foreignAuthorIdUrl.hostname;
    const foreignAuthorIdPathname = foreignAuthorIdUrl.pathname;
    const [accepted, setAccepted] = useState(false);

    console.log("WHO HAS FOLLOWED: ", follow)
    console.log("PAthname: ", foreignAuthorIdPathname)

    console.log("HOSTNAME: ", foreignAuthorIdPathname.replace("/authors/", "").replace("/", ""))

    const deleteFollow = async () => {

        await axios.delete(follow.object.id + "/inbox/follow-request/" + follow.id, {
            headers: {
              'Authorization': 'token ' + team10token
              //'Authorization': 'Basic ' + team10Authorization
            }
          }).then((response) => {
              if (response.status === 204){
                window.location.href = window.location.href;
              }
          });   
    }
    
    const sendingFollower = async (foreignAuthorId) => {

        await axios.put(follow.object.id + "/followers/" + foreignAuthorId, follow, {
            headers: {
              'Authorization': 'token ' + team10token
              //'Authorization': 'Basic ' + team10Authorization
            }
          })
            .then((response) => {
                if (response.status === 201){
                    alert("Succesfully accepted follow request!");
                    setAccepted(true);
                    deleteFollow();
                } else {
                    alert("Oops, something went wrong!");
                }
            })

    }


    const acceptFollow = async () => {
        //if user chooses accept
        //sends POST request to ***/followers of logged in user (so my AuthorId), with follower object
        console.log("Follow Accepted!");
        alert("You have accepted the request!");
        var foreignAuthorId
        if (foreignAuthorIdHostname === "cmput-404-w22-group-10-backend.herokuapp.com" ){

            foreignAuthorId = foreignAuthorIdPathname.replace("/authors/", "").replace("/", "")//for team10
            sendingFollower(foreignAuthorId)

        } else if ( foreignAuthorIdHostname === "cmput-404-w22-project-group09.herokuapp.com"){

            foreignAuthorId = foreignAuthorIdPathname.replace("/service/authors/", "")//for team9
            sendingFollower(foreignAuthorId)

        } else if (foreignAuthorIdHostname === "backend-404.herokuapp.com"){//for team4
            foreignAuthorId = foreignAuthorIdPathname.replace("/authors/", "").replace("/", "")//for team10
            sendingFollower(foreignAuthorId)

        } else if (foreignAuthorIdHostname ===  "tik-tak-toe-cmput404.herokuapp.com"){//for team0
            foreignAuthorId = foreignAuthorIdPathname.replace("/authors/", "").replace("/", "")//for team10
            sendingFollower(foreignAuthorId)

        }
    }

    /* const checkFollowerExist = async () => {
        try {
            await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com" + postPath + "/likes", {
                headers: {
                  'Authorization': 'token ' + team10token
                  //'Authorization': 'Basic ' + team10Authorization
                }
              })
            .then((response) => {

           
        });
    } catch (error) {
        //console.log(error)
    }

    } */

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
                <Card.Body className="text-center">
                        <Card.Text>
                            {follow.summary}
                        </Card.Text>
                     
                </Card.Body>
                <Card.Footer>
                { (accepted === false) && <Button  className="acceptFollowButton" onClick={acceptFollow}>Accept</Button>}
                { (accepted === true) && <Button  className="acceptedFollowButton" onClick={acceptFollow}>Accepted</Button>}
                <Button  className="declineFollowButton" onClick={deleteFollow} >Decline</Button> 
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
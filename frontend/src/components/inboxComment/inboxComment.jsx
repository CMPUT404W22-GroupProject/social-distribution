import {Card} from 'react-bootstrap'
import PersonIcon from '@mui/icons-material/Person'
import './inboxComment.css'
import {useState, useEffect} from 'react'
import axios from "axios"
import {format} from "timeago.js"

function InboxComment({inboxComment, team}){
    //this is how the like object will appear in the inbox
    //console.log("INBOXCOMMENT: ", inboxComment);

    return(
        <div className='inboxCommentCard'>
            <Card >
                <Card.Header>
                    <div className="inboxCommentTopLeft">
                    {/* <img className="postProfileImg" /> */}
                    <PersonIcon className="inboxCommentProfileImg"/>
                    <span className="inboxCommentUsername">{inboxComment.author.displayName}</span>
                    <span className="inboxCommentDate">{format(inboxComment.published)}</span>
                     </div> 
                </Card.Header>
                <Card.Title className="text-center">
                        <Card.Text>
                            {inboxComment.author.displayName} commented on your post!
                        </Card.Text>
                     
                </Card.Title>
                <Card.Body className="text-center">
                        <Card.Text>
                            {inboxComment.comment}
                        </Card.Text>
                     
                </Card.Body>

            </Card>

        </div>
    )
}

export default InboxComment;
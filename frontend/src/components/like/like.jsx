import {Card} from 'react-bootstrap'
import PersonIcon from '@mui/icons-material/Person'
import './like.css'
import {useState, useEffect} from 'react'
import axios from "axios"
import {format} from "timeago.js"

function Like({like}){
    //this is how the like object will appear in the inbox

    return(
        <div className='likeCard'>
            <Card >
                <Card.Header>
                    <div className="likeTopLeft">
                    {/* <img className="postProfileImg" /> */}
                    <PersonIcon className="likeProfileImg"/>
                    <span className="likeUsername">{like.displayName}</span>
                    <span className="likeDate">{like.published}</span>
                     </div> 
                </Card.Header>
                <Card.Body className="text-center">
                        <Card.Text>
                            {like.displayName} likes your post!
                        </Card.Text>
                     
                </Card.Body>

            </Card>

        </div>
    )
}

export default Like;
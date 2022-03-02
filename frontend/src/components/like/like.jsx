import {Card} from 'react-bootstrap'
import PersonIcon from '@mui/icons-material/Person'
import './like.css'
import {useState, useEffect} from 'react'
import axios from "axios"
import {format} from "timeago.js"

function Like({}){

    return(
        <div className='likeCard'>
            <Card >
                <Card.Header>
                    <div className="likeTopLeft">
                    {/* <img className="postProfileImg" /> */}
                    <PersonIcon className="likeProfileImg"/>
                    <span className="likeUsername">{}</span>
                    <span className="likeDate">{}</span>
                     </div> 
                </Card.Header>
                <Card.Body className="text-center">
                        <Card.Text>
                            This person likes your "Title of post" post!
                        </Card.Text>
                     
                </Card.Body>

            </Card>

        </div>


    )


}

export default Like;
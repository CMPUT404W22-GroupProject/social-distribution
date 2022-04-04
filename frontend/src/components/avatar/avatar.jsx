import React from 'react'
import { useState } from 'react'
import {useEffect} from 'react'
import AvatarEditor from 'react-avatar-editor'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'

import './avatar.css'

function AvatarPhoto({user}) {


    const [file, setFile] = useState(null);
    const [encodedFile, setEncodedFile] = useState(null);

    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
    const team10token = JSON.parse(localStorage.getItem('user')).token

    const URL = "https://cmput-404-w22-group-10-backend.herokuapp.com"
    const currentUser = JSON.parse(localStorage.getItem('user'))


    useEffect(() => {

    },[file])


    const handleChange = async (event)  => {
        if (event.target.value) {
            const image = event.target.value
            console.log("uploading image");
            setFile(image)
            var imagePost = {
                "profileImage": image
            }

            const uuid = JSON.parse(localStorage.getItem('user')).user.uuid
            axios.post(URL + '/authors/' + uuid + "/", imagePost, {
                headers: {
                  'Authorization': 'token ' + team10token
                  
                }
              }

            ).then( res => {
                console.log("RESPONSE", res.data)
            })
        }
        return 0
    };

    return (
      <React.Fragment>
          
          <div className='avatarContainer'>
            <input type="url" onChange={handleChange} id="upload" accept="https://.*" placeholder={user.profileImage}/>
                <IconButton color="primary" aria-label="upload picture" component="span">
                    <Avatar id="avatar" src={user.profileImage}
                            style={{

                                width: "200px",
                                height: "200px",
                            }}/>
                </IconButton>
        </div>


      </React.Fragment>
    )
}

export default AvatarPhoto;
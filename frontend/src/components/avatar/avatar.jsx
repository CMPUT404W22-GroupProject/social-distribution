import React from 'react'
import { useState } from 'react'
import {useEffect} from 'react'
import AvatarEditor from 'react-avatar-editor'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'
import {useParams} from 'react-router-dom';
import './avatar.css'

function AvatarPhoto({user}) {


    const [file, setFile] = useState(null);
    const params = useParams();
    const profileId = params.id.replace(":","")
    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
    const team10token = JSON.parse(localStorage.getItem('user')).token

    const URL = "https://cmput-404-w22-group-10-backend.herokuapp.com"
    const currentUser = JSON.parse(localStorage.getItem('user'))

    const [upload, setUpload] = useState(false)


    useEffect(() => {


      const allowUpload = async () => {
        if(currentUser.user.uuid == profileId){
          setUpload(true)
        }
      }


      
      allowUpload()
    },[upload])


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
                window.location.reload()
            })
        }
        return 0
    };

    return (
      <React.Fragment>
          <div className='avatarContainer'>
              {console.log("AVATAR ID", user)}
              <Avatar id="avatar" src={user.profileImage}
                              style={{
                                  width: "200px",
                                  height: "200px",
                              }}/>
            
        </div>
        {upload && (
          <input type="url" onChange={handleChange} id="upload" accept="https://.*" placeholder={user.profileImage}/>)}
      </React.Fragment>
    )
}

export default AvatarPhoto;
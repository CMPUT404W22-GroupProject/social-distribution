import React from 'react'
import { useState } from 'react'
import {useEffect} from 'react'
import AvatarEditor from 'react-avatar-editor'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import axios from 'axios'

function AvatarPhoto({id}) {


    const [file, setFile] = useState(null);
    const [encodedFile, setEncodedFile] = useState(null);

    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
    const team10token = JSON.parse(localStorage.getItem('user')).token

    const URL = "https://cmput-404-w22-group-10-backend.herokuapp.com"


    useEffect(() => {

        const path = URL + "/authors/" + id +  "/" 
        axios.get(path, {
            headers: {
              'Authorization': 'token ' + team10token
              //'Authorization': 'Basic ' + team10Authorization
            }
          }).then(res => {
            const base64 = res.data.profileImage
            setFile(base64)
    }) },[id])


    const handleChange = async (event)  => {
        if (event.target.files.length > 0) {
            const image = event.target.files[0]
            const encodedImage = await convertToBase64(image)
            console.log("uploading image");
            setFile(encodedImage)
            setEncodedFile(encodedImage)
            console.log(encodedImage)
            var imagePost = {
                "profileImage": encodedImage,
            }

            const path = URL + "/authors/" + id +  "/" 
            
            axios.post(path, imagePost, {
                headers: {
                  'Authorization': 'token ' + team10token
                  //'Authorization': 'Basic ' + team10Authorization
                }
              }

            ).then( res => {
                console.log("RESPONSE", res.data)
            })
        }
    };


    const convertToBase64 = (uploadedFile) => {
        //converts image to Base64
        //ADD CITATION
        return new Promise((resolve, reject) => {
  
          const fileReader = new FileReader();
          console.log("file", uploadedFile)
          fileReader.readAsDataURL(uploadedFile);
          fileReader.onload = (() => {
            resolve(fileReader.result);
          });
          fileReader.onerror = ((error)=>{
            reject(error);
          });
        });
  
      };


    return (
      <React.Fragment>
          
          <div className="App">
            <input type="file" onChange={handleChange} id="upload" accept="image/*" style={{display: "none"}}/>
            <label htmlFor="upload">
                <IconButton color="primary" aria-label="upload picture" component="span">
                    <Avatar id="avatar" src={file}
                            style={{

                                width: "200px",
                                height: "200px",
                            }}
                    />
                </IconButton>
            </label>
            <label htmlFor="avatar"/>
        </div>


      </React.Fragment>
    )
}

export default AvatarPhoto;

/*<IconButton>
<Avatar 
src="https://thepowerofthedream.org/wp-content/uploads/2015/09/generic-profile-picture.jpg"
style={{
    margin: "10px",
    width: "200px",
    height: "200px",
}} 
/>
</IconButton>*/
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
                "github": "example.com",
                //"id": "https://cmput-404-w22-group-10-backend.herokuapp.com/authors/f05ace80-4ee0-4f43-ba3c-ae644b607c22",
                //"profileImage": "https://th-thumbnailer.cdn-si-edu.com/xg8ymcfArLplIH3H3l457Xu7ThI=/fit-in/1072x0/filters:focal(1014x799:1015x800)/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/93/ea/93ea364e-6fc3-4a67-970a-c71db4118181/bluesun.jpg"
            }

            const uuid = JSON.parse(localStorage.getItem('user')).user.uuid
            axios.post(URL + '/authors/' + uuid, imagePost, {
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
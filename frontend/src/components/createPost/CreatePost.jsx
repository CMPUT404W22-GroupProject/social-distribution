import './createPost.css'
import {Button} from 'react-bootstrap'
import {PermMedia} from '@mui/icons-material'
import PersonIcon from '@mui/icons-material/Person'
import PublicIcon from '@mui/icons-material/Public'
import LockIcon from '@mui/icons-material/Lock'
import PeopleIcon from '@mui/icons-material/People'
import { useRef } from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'



function CreatePost(){
    const postContent = useRef();
    const postDescription = useRef();
    const postTitle = useRef();
    const postTags = useRef();
    const [file, setFile] = useState(null); //used for storing the file that is uploaded
    const [base64, setBase64] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [isUnlisted, setIsUnlisted] = useState(false);
    const [author, setAuthor] = useState([]);



    useEffect(() => {

      const fetchAuthor = async () => {
          const result = await axios.get("/authors/1");
          setAuthor(result.data)
      }

      fetchAuthor();
      
  },[])
    
    const uploadImage = async (e) => {
      const uploadedFile = e.target.files[0];
      const encodedImage = await convertToBase64(uploadedFile)
      console.log("uploading image");
      alert("Image Uploaded!")
      setFile(uploadedFile);
      setBase64(encodedImage);
    }

    const convertToBase64 = (uploadedFile) => {

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

    const submitPost = async (e) =>{
        e.preventDefault() //prevents screen from refreshing when submit button is clicked
        /* console.log("Body: ", postContent.current.value)
        console.log("file:", file, "base64:", base64) */

        var newPost = {
          "type": "post",
          "title": postTitle.current.value,
          "source": "",
          "origin": "",
          "description": postDescription.current.value,
          "contentType": "text/plain",
          "author": author,
          "content": postContent.current.value,
          "categories": postTags.current.value,
          "count": 0,
          "published": "",
          "visibility": "",
          "unlisted": false
        }

        var date = new Date();
        var formattedDate = date.toISOString();
        newPost["published"] = formattedDate;


        if (isPublic === true){
          newPost["visibility"] = "PUBLIC";
        } else {
          newPost["visibility"] = "FRIENDS";
        }
        
        if (isUnlisted === true){
          newPost["unlisted"] = true;
        }



        console.log(newPost)

        try {

         await axios.create("/authors/1/posts", newPost);

        } catch (error) {
          console.log(error)


        }


    }

    return (
        <div className="createPost">
          <div className="createPostWrapper">
            <div className="createPostTop">
              {/* <img className="pofile-pic" src="/assets/person/1.jpeg" alt="" /> */}
              <PersonIcon className='createPostProfilepic'/>
              <input
                placeholder="Title!"
                className="createPostInput"
                ref={postTitle}
              />
              <input
                placeholder="Description"
                className="createPostInput"
                ref={postDescription}
              />
              <input
                placeholder="Create a Post!"
                className="createPostInput"
                ref={postContent}
              />
              <input
                placeholder="Add tags!"
                className="createPostInput"
                ref={postTags}
              />
            </div>
            <hr className="createPostHr"/>



            <form className="createPostBottom" onSubmit={submitPost}>
                <div className="createPostOptions">

                    <label htmlFor = "file" className="createPostOption">
                        <PermMedia htmlColor="tomato" className="createPostIcon" />
                        <span className="createPostOptionText" >Photo</span>
                        <input 
                        //hides this ugly button and lets the image act as the button to upload instead
                        style = {{display: "none"}}
                        type="file" id="file" 
                        accept=".png, .jpeg" 
                        onChange={(e) => uploadImage(e)}
                        >
                        </input>
                    </label>

                    <div className="createPostOption" onClick={choosePublic}>
                        <PublicIcon htmlColor="green" className="createPostIcon" />
                        <span className="createPostOptionText">Public?</span>
                    </div>

    

                    <div className="createPostOption" onClick={choosePrivate}>
                        <LockIcon htmlColor="red" className="createPostIcon" />
                        <span className="createPostOptionText">Private?</span>
                    </div>

                    <div className="createPostOption" onClick={chooseFriend}>
                        <PeopleIcon htmlColor="blue" className="createPostIcon" />
                        <span className="createPostOptionText">Choose friend</span>
                    </div>

                    <div className="createPostOption" onClick={chooseUnlisted}>
                        <PeopleIcon htmlColor="blue" className="createPostIcon" />
                        <span className="createPostOptionText">Unlisted?</span>
                    </div>

                    

                </div>

                <Button className="createPostButton" type = "submit">Share</Button>
        
            </form>
          </div>
        </div>
      );

    

      function chooseFriend(){

            console.log("I choose friend!");
            setIsFriend(true);
    }

        function choosePublic(){

            console.log("I choose public post");
            setIsPublic(true);
    }

        function choosePrivate(){

            console.log("I choose private post");
            setIsPrivate(true);
    }
      function chooseUnlisted(){

      console.log("I choose unlisted post");
      setIsUnlisted(true);
}

}

export default CreatePost;
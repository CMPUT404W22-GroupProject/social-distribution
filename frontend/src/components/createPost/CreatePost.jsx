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
import UserContext from '../../context/userContext';

function CreatePost(){
    const postContent = useRef();
    const postDescription = useRef();
    const postTitle = useRef();
    const postTags = useRef();
    const [file, setFile] = useState(null); //used for storing the image that is uploaded
    const [base64, setBase64] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [isUnlisted, setIsUnlisted] = useState(false);
    const [author, setAuthor] = useState([]);
    const {id, setId} = useState(UserContext);
    const authorId = "a168a4c4-f76f-4c9d-bf0a-986c7c46b51a";
    
    useEffect(() => {
      //fetches author when component is called
      const fetchAuthor = async () => {
          //fetches auhor
          const result = await axios.get("/authors/" + authorId);
          setAuthor(result.data)
      }
      fetchAuthor();
  },[])

    
    const uploadImage = async (e) => {
      //handles uploading image
      //ADD CITATION
      const uploadedFile = e.target.files[0];
      const encodedImage = await convertToBase64(uploadedFile)
      console.log("uploading image");
      alert("Image Uploaded!")
      setFile(uploadedFile);
      setBase64(encodedImage);
    }

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

    const submitPost = async (e) =>{
        //Handles the submition of the post, sends post to server

        e.preventDefault() //prevents screen from refreshing when submit button is clicked
        
        var newPost = { //the json file that will be sent
          "type": "post",
          "title": postTitle.current.value,
          "source": "",
          "origin": "",
          "description": postDescription.current.value,
          "contentType": "text/plain",
          "author": authorId,
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

        //if image is selected and there is no content, so image only post
        if ((base64 !== "") && (postContent.current.value === "")){
          newPost["content"] = base64;
          newPost["contentType"] = "image/base64";
          console.log("newPOST W BASE64: ", newPost)
        }

        var status = null;

        try {
         await axios.post("/authors/" + authorId + "/posts/", newPost)
         .then((response) => {
           status = response.status;
         })
        } catch (error) {
          console.log(error)
        }
        if (status === 201) {
        alert("Shared! Check profile to see post!");
        window.location.href = window.location.href;
        } else {
          alert("Oops! Something went wrong! Please make sure all fields are filled, and try again!");
        }

        /*console.log("Body: ", postBody.current.value)
        console.log("file:", file, "base64:", base64)
        axios({
          method: 'post',
          url: `http://127.0.0.1:8000/authors/${id}/posts/`,
          data: {
            "type": "post",
            "title": "placeholder title",
            "source": "",
            "origin": "",
            "description": "test post",
            "contentType": "text/plain",
            "content": `${postBody.current.value}`,
            "author": `${id}`,
            "categories": "nothing",
            "count": 0,
            "commentsSrc": {},
            "published": "2022-03-04T06:56:48Z",
            "visibility": "PUBLIC",
            "unlisted": false
          }
        }).then((res)=> {
          console.log(res)
        })*/

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
                placeholder="Describe it a little"
                className="createPostInput"
                ref={postDescription}
              />
              <input
                placeholder="What's in your mind?"
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

                <Button className="createPostButton" type = "submit"  >Share</Button>
        
            </form>
          </div>
        </div>
      );

  
      function chooseFriend(){
        //if user chooses friend icon

            console.log("I choose friend!");
            setIsFriend(true);
    }
      function choosePublic(){
        //if user chooses public icon

          console.log("I choose public post");
          setIsPublic(true);
    }
      function choosePrivate(){
        //if user chooses private icon

          console.log("I choose private post");
          setIsPrivate(true);
    }
      function chooseUnlisted(){
        //if user chooses unlisted

          console.log("I choose unlisted post");
          setIsUnlisted(true);
    }

}

export default CreatePost;
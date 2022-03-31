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
import PopupSmall from '../popupSmall/PopupSmall'

function CreatePost({loggedInAuthor, loggedInAuthorId, loggedInAuthorFollowers}){
    const postContent = useRef();
    const postDescription = useRef();
    const postTitle = useRef();
    const postTags = useRef();
    const postContentType = useRef();
    const [file, setFile] = useState(null); //used for storing the image that is uploaded
    const [base64, setBase64] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isFriend, setIsFriend] = useState(false);
    const [friend, setFriend] = useState({});
    const [isUnlisted, setIsUnlisted] = useState(false);
    const [author, setAuthor] = useState(loggedInAuthor);
    const {id, setId} = useState(UserContext);
    const [followers, setFollowers] = useState(loggedInAuthorFollowers);// followers of loggedInAuthorID, initial is empty object
    const [buttonPopup, setButtonPopup] = useState(false);
    const [isPlain, setisPlain] = useState(false);
    const [isMarkdown, setIsMarkdown] = useState(false);
    const team0Authorization = btoa("admin:tX7^iS8a5Ky$^S");
    const team4Authorization = btoa("Team10:abcdefg");
    const team9Authorization = btoa("group10:pwd1010");
    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");
    const team10token = JSON.parse(localStorage.getItem('user')).token
    
    
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
          "author": author,
          "content": postContent.current.value,
          "categories": postTags.current.value,
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

        if (isPlain === true){
          newPost["contentType"] = "text/plain";
        }

        if (isMarkdown === true){
          newPost["contentType"] = "text/markdown";
        }

        console.log(newPost)

        //if image is selected and there is no content, so image only post
        if ((base64 !== "") && (postContent.current.value === "")){
          newPost["content"] = base64;
          var fileType = file.type;
          newPost["contentType"] = fileType + ";base64";
          console.log("newPOST W BASE64: ", newPost)
        }

        //sending CSRF token as header
        //axios.defaults.headers.post['X-CSRF-Token'] = "qaa2nlJZPsbuH7knWoZ1OqeJqQqz3eZIkgDK8uIuCqs7vMawMwDLveJgdvaQxoTO";

         //sending post to author's posts 
         //only being sent to team10
         var status = null;
         try {
         await axios.post("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/" + loggedInAuthorId + "/posts/", newPost, {
          headers: {
            'Authorization': 'token ' + team10token
            //'Authorization': 'Basic ' + team10Authorization
          }
        })
         .then((response) => {
           status = response.status;
           const postId = response.data.id;
           newPost["id"] = postId;
         })
         } catch (error) {
           //console.log(error)
         }
         if (status === 201) {
         alert("Shared! Check profile to see post!");
         //window.location.href = window.location.href;
         } else {
           alert("Oops! Something went wrong! Please make sure all fields are filled, and try again!");
         } 

         //IF POST IS NOT PUBLIC
         if (!isPublic){
              //sending post to followers
            if (isFriend === true){ //is one specific follower selected
              var status = null;
              try {
                  const friendPathname = new URL(friend.id).hostname;
                  console.log("SELECTED FRIEND PATHNAME: ", friendPathname)
                  //REMEBER TEAM10 HAS TRAILING / AFTER INBOX
                  if (friendPathname === "cmput-404-w22-group-10-backend.herokuapp.com"){
                      await axios.post(friend.id + "/inbox/", newPost, {
                        headers: {
                          'Authorization': 'token ' + team10token
                          //'Authorization': 'Basic ' + team10Authorization
                        }
                      })
                      .then((response) => {
                      status = response.status;
                      })
                  } else if (friendPathname === "cmput-404-w22-project-group09.herokuapp.com"){
                    ////REMEBER TEAM9 DOES NOT HAVE TRAILING / AFTER INBOX
                    await axios.post(friend.id + "/inbox", newPost, {
                      headers: {
                        'Authorization': 'Basic ' + team9Authorization
                      }
                    })
                      .then((response) => {
                      status = response.status;
                      })
                  } else if (friendPathname === "backend-404.herokuapp.com"){
                    await axios.post(friend.id + "/inbox/", newPost, {
                      headers: {
                        'authorization': 'Basic ' + team4Authorization
                      }
                    })
                      .then((response) => {
                      status = response.status;
                      })
                  } else if (friendPathname === "tik-tak-toe-cmput404.herokuapp.com"){
                    await axios.post(friend.id + "/inbox/", newPost, {
                      headers: {
                        'authorization': 'Basic ' + team0Authorization
                      }
                    })
                      .then((response) => {
                      status = response.status;
                      })
                  }
                  
              } catch (error) {
                //console.log(error)
              }
                  if (status === 201) {
                  alert("Shared! Check profile to see post!");
                  //window.location.href = window.location.href;
                  } else {
                    alert("Oops! Something went wrong! Please make sure all fields are filled, and try again!");
                  }
            } else {// if all friends i.e. not one specific friend
                //sending post to each follower's inbox
              /* for (var i in followers["items"]){
                const follower = followers["items"][i]; */
              for (var i in followers){
                const follower = followers[i];
                var status = null;
                try {
                  const followerPathname = new URL(follower.id).hostname;
                  if (followerPathname === "cmput-404-w22-group-10-backend.herokuapp.com"){
                      await axios.post(follower.id + "/inbox/", newPost, {
                        headers: {
                          'Authorization': 'token ' + team10token
                          //'Authorization': 'Basic ' + team10Authorization
                        }
                      })
                      .then((response) => {
                      status = response.status;
                      })
                  } else if (followerPathname === "cmput-404-w22-project-group09.herokuapp.com"){
                      await axios.post(follower.id + "/inbox", newPost, {
                        headers: {
                          'Authorization': 'Basic ' + team9Authorization
                        }
                      })
                        .then((response) => {
                        status = response.status;
                        })
                  } else if (followerPathname === "backend-404.herokuapp.com"){
                    // TODO: VERIFY URL FORMATTING  
                    await axios.post(follower.id + "/inbox/", newPost, {
                        headers: {
                          'authorization': 'Basic ' + team4Authorization
                        }
                      })
                        .then((response) => {
                        status = response.status;
                        })
                  }
                } catch (error) {
                  //console.log(error)
                }
                if (status === 201) {
                alert("Shared! Check profile to see post!");
                //window.location.href = window.location.href;
                } else {
                  alert("Oops! Something went wrong! Please make sure all fields are filled, and try again!");
                }
              }

            }
         
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
              <label htmlFor="contentType">Choose contentType:</label>
              <select name = "contentType">
                <option value = "text/plain" onClick = {() => setisPlain(true)}>text/plain</option>
                <option value = "text/markdown" onClick = { () => setIsMarkdown(true)}>text/markdown</option>
                </select>
              {/* <input
                placeholder="What's in your mind?"
                className="createPostInput"
                ref={postContent}
              /> */}
              <textarea
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

                    <div className="createPostOption" onClick={() => setButtonPopup(true)}>
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
              {/*popup with createPost component in it, called when button is clicked*/}
           <PopupSmall 
                trigger = {buttonPopup} 
                setTrigger = {setButtonPopup}
                > 
              {(followers.length !== 0) && // Fetched data is being displayed here, if post array isnt empty
                         
                          followers.map((follower) => (
                            <div className="createPostOption" onClick={() => chooseFriend(follower)}>
                            { (friend === follower) && <PersonIcon htmlColor="red" className="createPostIcon" /> }
              
                            {(friend != follower ) &&  <PersonIcon htmlColor="blue" className="createPostIcon" />}
                             
                            
                            <span className="createPostOptionText">{follower.displayName}</span>
                        </div>
                          ))
              }
            </PopupSmall>
           
        </div>
        
      );

  
      function chooseFriend(follower){
        //if user chooses friend icon

            //console.log("I choose friend!, and his name is: ", follower.displayName);
            console.log("I choose friend!, and his name is: ", follower);
            setIsFriend(true);
            setFriend(follower);

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
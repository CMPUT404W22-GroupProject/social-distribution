import React, { useContext, useEffect, useState } from 'react' 
import UserContext from '../../context/userContext';
import axios from "axios"
import Post from '../../components/Post'
import { useLocation } from 'react-router-dom';
import {useParams} from 'react-router-dom';
import PaginationControlled from '../../components/paginationFeed'
import CreatePost from '../../components/createPost/CreatePost';
import Popup from '../../components/popup/Popup';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
//Components
import AvatarPhoto from '../../components/avatar/avatar'
import FollowerList from '../../components/followerList/followerList';
import FollowerCard from '../../components/followerCard/followerCard';
import Feed from '../../components/feed/Feed';

function Profile(){
    
    const [authorData, setAuthorData] = useState('')
    const [followers, setFollowers] = useState([])
    const params = useParams();
    const profileId = params.id.replace(":","")
    const idObject = JSON.stringify({"id": profileId})

    const location = useLocation()
    //const user = JSON.parse(location.state.state)
    const currentUser = JSON.parse(localStorage.getItem('user'))
    const [showFollowers, setShowFollowers] = useState(false)


    const URL10 = "https://cmput-404-w22-group-10-backend.herokuapp.com"

    const team0Authorization = btoa("admin:tX7^iS8a5Ky$^S");
    const team4Authorization = btoa("Team10:abcdefg");
    const team9Authorization = btoa("group10:pwd1010");
    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");


    const [teamServer, setTeamServer] = useState("");
    const [urlAuthor, setUrlAuthor] = useState([]);


    const [showFollowBtn, setShowFollowBtn] = useState(true)
    const team10token = JSON.parse(localStorage.getItem('user')).token



    useEffect(() => {


        
    })

    useEffect(() => {

        const fetchUrlAuthorFollowers = async (team) => {
            var result;
            if (team === "team10"){
                result = await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/" + profileId + "/followers/", {
              headers: {
                
                'Authorization': 'token ' + team10token
                //'Authorization': 'Basic ' + team10Authorization
                }
                })
            } else if (team === "team9"){
                result = await axios.get("https://cmput-404-w22-project-group09.herokuapp.com/service/authors/" + profileId + "/followers", {
              headers: {
                'Authorization': 'Basic ' + team9Authorization
                }
                })
            } else if (team === "team4"){
                result = await axios.get("https://backend-404.herokuapp.com/authors/" + profileId + "/followers/", {
              headers: {
                'authorization': 'Basic ' + team4Authorization
                }
                })
            } else if (team === "team0"){
                result = await axios.get("http://tik-tak-toe-cmput404.herokuapp.com/authors/" + profileId + "/followers/", {
              headers: {
                'authorization': 'Basic ' + team0Authorization
                }
                })
            }
            setFollowers(result.data.items)

        }

        const getAuthorsPagination = async (page, team) => {
            if (team === "team10"){
                await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/?page=" + page, {
                    headers: {
                      
                      'Authorization': 'token ' + team10token
                      //'Authorization': 'Basic ' + team10Authorization
                    }
                  })
                .then((response) => {
                    //console.log("TEAM 10 RESPONSE: ", response.data);
                    //setTeam10Authors(response.data);
                    const team10data = response.data.items; 
                    team10data.forEach((foreignAuthor) => {
                        const foreignAuthorURL = new URL(foreignAuthor.id);
                        const foreignAuthorPath = foreignAuthorURL.pathname;
                        if ("/authors/"+ profileId === foreignAuthorPath) {
                            
                            setTeamServer("team10");
                            fetchUrlAuthorFollowers("team10");
                            setUrlAuthor(foreignAuthor);
                        }
                    })
                });
            } else if (team === "team9"){
                await axios.get("https://cmput-404-w22-project-group09.herokuapp.com/service/authors/?page=" + page, {
                    headers: {
                      'Authorization': 'Basic ' + team9Authorization
                    }
                  })
                .then((response) => {
                    //console.log("TEAM 9 RESPONSE: ", response);
                    //setTeam9Authors(response.data); //authors in response.data.result
                    const team9data = response.data.items;
                    team9data.forEach((foreignAuthor) => {
                        const foreignAuthorURL = new URL(foreignAuthor.id);
                        const foreignAuthorPath = foreignAuthorURL.pathname;
                        if ("/service/authors/"+ profileId === foreignAuthorPath) {
                           setTeamServer("team9");
                           fetchUrlAuthorFollowers("team9");
                           setUrlAuthor(foreignAuthor);
                            
                        }
                    })
                });
    
    
            } else if (team === "team4"){
                await axios.get("https://backend-404.herokuapp.com/authors/?page=" + page, {
                    headers: {
                      'authorization': 'Basic ' + team4Authorization
                    }
                  })
                .then((response) => {
                    //console.log("TEAM 4 RESPONSE: ", response);
                    //setTeam9Authors(response.data); //authors in response.data.result
                    const team4data = response.data.items;
                    team4data.forEach((foreignAuthor) => {
                        const foreignAuthorURL = new URL(foreignAuthor.id);
                        const foreignAuthorPath = foreignAuthorURL.pathname;
                        if ("/authors/"+ profileId === foreignAuthorPath) {
                            //console.log("TEAM 4 AUTHOR FOUND")
                           setTeamServer("team4")
                           fetchUrlAuthorFollowers("team4");
                           setUrlAuthor(foreignAuthor);
                            
                        }
                    })
                });
    
            } else if (team === "team0"){
                await axios.get("http://tik-tak-toe-cmput404.herokuapp.com/authors/?page=" + page, {
                    headers: {
                      'authorization': 'Basic ' + team0Authorization
                    }
                  })
                .then((response) => {
                    //console.log("TEAM 0 RESPONSE: ", response);
                    const team0data = response.data.items;
                    team0data.forEach((foreignAuthor) => {
                        const foreignAuthorURL = new URL(foreignAuthor.id);
                        const foreignAuthorPath = foreignAuthorURL.pathname;
                        if ("/authors/"+ profileId === foreignAuthorPath) {
                            //console.log("TEAM 4 AUTHOR FOUND")
                           setTeamServer("team0");
                           fetchUrlAuthorFollowers("team0");
                           setUrlAuthor(foreignAuthor);
                            
                        }
                    })
                });
    
            }
    
        }

        const getAuthorServer = async () => {
            
            //getting authors from team 10, and storing
            //await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/service/authors/")
            await axios.get("https://cmput-404-w22-group-10-backend.herokuapp.com/authors/", {
                headers: {
                  'Authorization': 'token ' + team10token
                  //'Authorization': 'Basic ' + team10Authorization
                }
              })
            .then((response) => {
                console.log("TEAM 10 RESPONSE: ", response.data);
                //setTeam10Authors(response.data); 
                const team10data = response.data.items; 
                team10data.forEach((foreignAuthor) => {
                    const foreignAuthorURL = new URL(foreignAuthor.id);
                    const foreignAuthorPath = foreignAuthorURL.pathname;
                    if ("/authors/"+ profileId === foreignAuthorPath) {
                        console.log("TEM10 AUTHOR")
                        setTeamServer("team10");
                        fetchUrlAuthorFollowers("team10");
                        setUrlAuthor(foreignAuthor);
                    }
                })
                //if author page has more pages then do same process as above on other pages too, to find appropriate author
                const authorPages = Math.ceil(response.data.count/5)
                if (authorPages > 1){
                    for (let i = 2; i<= authorPages; i++){
                        getAuthorsPagination(i, "team10")
                    }
                }
            });
            
            //getting authors from team 9, and storing
            await axios.get("https://cmput-404-w22-project-group09.herokuapp.com/service/authors", {
                headers: {
                  'Authorization': 'Basic ' + team9Authorization
                }
              })
            .then((response) => {
                //console.log("TEAM 9 RESPONSE: ", response);
                //setTeam9Authors(response.data); //authors in response.data.result
                const team9data = response.data.items;
                team9data.forEach((foreignAuthor) => {
                    const foreignAuthorURL = new URL(foreignAuthor.id);
                    const foreignAuthorPath = foreignAuthorURL.pathname;
                    if ("/service/authors/"+ profileId === foreignAuthorPath) {
                       setTeamServer("team9");
                       fetchUrlAuthorFollowers("team9");
                       setUrlAuthor(foreignAuthor);
                        
                    }
                })
                 //if author page has more pages then do same process as above on other pages too, to find appropriate author
                 const authorPages = Math.ceil(response.data.count/5)
                 if (authorPages > 1){
                     for (let i = 2; i<= authorPages; i++){
                         getAuthorsPagination(i, "team9")
                     }
                 }
            });


            //getting authors from team 4, and storing 
            await axios.get("https://backend-404.herokuapp.com/authors/", {
                headers: {
                  'authorization': 'Basic ' + team4Authorization
                }
              })
            .then((response) => {
                console.log("TEAM 4 RESPONSE: ", response);
                //setTeam9Authors(response.data); //authors in response.data.result
                const team4data = response.data.items;
                team4data.forEach((foreignAuthor) => {
                    const foreignAuthorURL = new URL(foreignAuthor.id);
                    const foreignAuthorPath = foreignAuthorURL.pathname;
                    if ("/authors/"+ profileId === foreignAuthorPath) {
                        //console.log("TEAM 4 AUTHOR FOUND")
                       setTeamServer("team4");
                       fetchUrlAuthorFollowers("team4");
                       setUrlAuthor(foreignAuthor);
                        
                    }
                })
                 //if author page has more pages then do same process as above on other pages too, to find appropriate author
                 const authorPages = Math.ceil(response.data.count/5)
                 if (authorPages > 1){
                     for (let i = 2; i<= authorPages; i++){
                         getAuthorsPagination(i, "team4")
                     }
                 }
            });
            
            // Team 0
            await axios.get("http://tik-tak-toe-cmput404.herokuapp.com/authors/9d090d84-0501-4a5b-9ce3-259a46a0ea0e/posts/", {
                headers: {
                  'authorization': 'Basic ' + team0Authorization
                }
              })
            .then((response) => {
                console.log("TEAM 0 RESPONSE: ", response);
                const team0data = response.data.items;
                team0data.forEach((foreignAuthor) => {

                    const foreignAuthorURL = new URL(foreignAuthor.id);
                    const foreignAuthorPath = foreignAuthorURL.pathname;
                    if ("/authors/"+ profileId === foreignAuthorPath) {
                        //console.log("TEAM 4 AUTHOR FOUND")
                       setTeamServer("team0");
                       fetchUrlAuthorFollowers("team0");
                       setUrlAuthor(foreignAuthor);
                        
                    }
                })
                 //if author page has more pages then do same process as above on other pages too, to find appropriate author
                 const authorPages = Math.ceil(response.data.count/5)
                 if (authorPages > 1){
                     for (let i = 2; i<= authorPages; i++){
                         getAuthorsPagination(i, "team0")
                     }
                 }
            });
            //checking if author ID from url is in team10 or team9
            //declaring what server to use then 
        }
        const checkFollowing = async () => {
            if(profileId == currentUser.user.uuid){
                setShowFollowBtn(false)
            }else{
                for(var i=0; i<followers.length; i++ ){
                
                    if (followers[i].displayName == currentUser.user.displayName){
                        setShowFollowBtn(true)
                        break
                    }
                }
            }
        }

        getAuthorServer();
        checkFollowing()
        

    },[profileId])



    //current user will make follow request to current users profile
    /*function handleFollow(e){
        console.log("AUTHOR DATA ID", authorData.id)
        console.log("currentUser ID", currentUser.user.uuid)
        //this isnt working right now 
        var followRequest = { //the json file that will be sent
            "type": "follow",
            "summary": currentUser.user.displayName + "wants to follow you",
            "actor":{
                "type": "author",
                "id": URL10 + "/authors/" + currentUser.user.uuid,
                "url": URL10 + "/authors/" + currentUser.user.uuid,
                "host": URL10 + "/",
                "displayName": currentUser.user.displayName,
                "github": '',
                "profileImage": authorData.profileImage
            },
            "object":{
                "type":"author",
                "id": URL10 + "/authors/" + user.user.uuid,
                "host": URL10 + "/",
                "displayName": user.user.uuid,
                "url":URL10 + "/authors/" + user.user.uuid,
                "github": " ",
                "profileImage": authorData.profileImage
            }      
        }

        axios.post(URL10 + '/authors/' + user.user.uuid + '/inbox/', followRequest, {
            headers: {
              'Authorization': 'token ' + currentUser.token
            }
          }).then( res => {
              console.log(res)
          });

    }*/
    
    function showFollowersButton(e){
        setShowFollowers(false)

    }

    function showPostsButton(e){
        setShowFollowers(true)
    }



    return (
        <div>
            <AvatarPhoto user={urlAuthor}/>
            <h2>{urlAuthor.displayName}</h2>

            {!showFollowers &&
                <button onClick={showPostsButton}>Followers</button>
            }

            {showFollowers &&
                <button onClick={showFollowersButton}>Posts</button>
            }

            {showFollowBtn && (
                <button>Follow</button>
            )}

            {!showFollowers && 
                <div key={profileId}>
                    <Feed id={idObject} feedType={'posts'}/>

                </div>
                }
            {showFollowers && 
                <div>
                    <ul>
                        {followers.map(follower => (<li key={follower.id}><FollowerCard follower={follower}/></li>))}
                    </ul>
                </div>
            }


        </div>
    )
}

/*<CreatePost loggedInAuthorId={profileId} loggedInAuthor={loggedInAuthor} loggedInAuthorFollowers={loggedInAuthorFollowers}/>*/
export default Profile;
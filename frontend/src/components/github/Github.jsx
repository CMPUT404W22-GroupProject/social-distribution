import './github.css';
import axios from "axios";
import { useEffect, useState } from 'react';


function Github({githubURL}) {

    const [github, setGithub] = useState([])
    const githubUsername = new URL(githubURL).pathname;

    const callGithub = async () => {
        await axios.get("https://api.github.com/users"+ githubUsername + "/events")
        .then((response) =>{
            if (response.status === 200){
                console.log("GITHUB RESPONSE", response.data)
                setGithub(response.data)
            }
           
        })


    }

    useEffect(()=>{
        const interval = setInterval(() => {
            console.log('Logs every minute');
            callGithub();
          }, 300000);//5 mins (300,000)
        return () => clearInterval(interval); 
    })


    const displayEvent = (item) =>{
        console.log("is this working",item)

        return <div className='githubEvent'>
        <span className='githubPushevent'>{item.type}</span>
        <span>{item.created_at}</span>
        <span>{item.repo.name}</span>
    </div> 

    }

    return(
        <div className="githubBox">
            {
                (github.length !== 0) &&
                    <div className='githubUserDisplay'>
                    <img className = "githubAvatar" src = {github[0].actor.avatar_url}/>
                    <span className='githubDisplayname'> {github[0].actor.display_login}</span>
                </div>
               
            }
            { (github.length === 0) &&
            <span className='githubDisplayname'> Github URL not working :(</span>}
            {/* <div className='githubEvent'>
                    <span className='githubPushevent'>{github[0].type}</span>
                    <span>{github[0].created_at}</span>
                    <span>{github[0].repo.name}</span>
            </div> */}
            {/* <div className='githubEvent'>
                    <span className='githubPushevent'>{item.type}</span>
                    <span>{item.created_at}</span>
                    <span>{item.repo.name}</span>
            </div> */}
            {/* {(github.length !== 0) &&
                github.forEach((item) =>  
                displayEvent(item)
                )} */}
            {(github.length !== 0) &&
                <div className='githubEvent'>
                <span className='githubPushevent'>{github[0].type}</span>
                <span>{github[0].created_at}</span>
                <span>{github[0].repo.name}</span> </div>}
                {(github.length !== 0) &&
                <div className='githubEvent'>
                <span className='githubPushevent'>{github[1].type}</span>
                <span>{github[1].created_at}</span>
                <span>{github[1].repo.name}</span> </div>}
                {(github.length !== 0) &&
                <div className='githubEvent'>
                <span className='githubPushevent'>{github[2].type}</span>
                <span>{github[2].created_at}</span>
                <span>{github[2].repo.name}</span> </div>}
                {(github.length !== 0) &&
                <div className='githubEvent'>
                <span className='githubPushevent'>{github[3].type}</span>
                <span>{github[3].created_at}</span>
                <span>{github[3].repo.name}</span> </div>}
                {(github.length !== 0) &&
                <div className='githubEvent'>
                <span className='githubPushevent'>{github[4].type}</span>
                <span>{github[4].created_at}</span>
                <span>{github[4].repo.name}</span> </div>}

                </div>
                    

                
           
       
    )
}

export default Github;
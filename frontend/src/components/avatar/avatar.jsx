import React from 'react'
import { useState } from 'react'
import AvatarEditor from 'react-avatar-editor'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'

function AvatarPhoto() {


    const [file, setFile] = useState(null);

    const handleChange = function loadFile(event) {
        if (event.target.files.length > 0) {
            const file = URL.createObjectURL(event.target.files[0]);
            setFile(file);
        }
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
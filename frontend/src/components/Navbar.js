import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';


function Navbar (){
    return (
        <AppBar >
            <Toolbar>
                <Button color="inherit">Home</Button>
                <Button color="inherit">Upload</Button>
                <Button color="inherit">Profile</Button>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar

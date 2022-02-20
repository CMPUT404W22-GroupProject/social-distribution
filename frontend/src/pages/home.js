import React from 'react' 
import Grid from '@material-ui/core/Grid';


function home(){
    return (
        <Grid container spacing={16}>
            <Grid item sm={8} xs={12}>
                <h1>Feed</h1>
                <h3>Post 1</h3>
                <h3>Post 1</h3>
                <h3>Post 1</h3>
                <h3>Post 1</h3>
            </Grid>
        </Grid>    
    )
}

export default home;


import React from 'react'

import { Link } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';



function FollowerCard({follower}) {

  const author = follower.id

  const id = author.substring(author.lastIndexOf('/') + 1)

  console.log(id)
  return (
    <Link to={`/profile/:${id}`}>
        <Card sx={{ maxWidth: 900 }}>
            <CardActionArea >
            <CardContent>
                <Typography align='start' gutterBottom variant="h5" component="div">
                {follower.displayName}
                </Typography>
                <Typography align='start' variant="body2" color="text.secondary">
                {follower.host}
                </Typography>
            </CardContent>
            </CardActionArea>
    </Card>
  </Link>
  )
}

export default FollowerCard
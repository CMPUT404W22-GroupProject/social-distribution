import React, {Component} from 'react';
import withStyles from '@material-ui/core/styles/withStyles';


const styles = {
    card: {
        display: 'flex'
    }
}

class Scream extends Component {
    render(){
        const{ classes } = this.props
        return (
            <div></div>
        )
    }
} 

export default withStyles(styles)(Scream);
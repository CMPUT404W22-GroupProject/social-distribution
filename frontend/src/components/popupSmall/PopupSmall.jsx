import React from 'react'
import './popupSmall.css'
import {Button} from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close';

function PopupSmall(props) {
    //This is the general popup template and functionality

    return (props.trigger) ? (

        <div className='popupSmallWrapper'>
            <div className='popupSmallInner'>
            <CloseIcon className ='closeSmallButton' htmlColor="black" onClick={() => props.setTrigger(false)}>
                Close
                </CloseIcon>
                {props.children}
                

            </div>
        </div>
    ) : "";
}

export default PopupSmall;
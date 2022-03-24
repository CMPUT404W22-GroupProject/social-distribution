import React from 'react'
import './popupSmall.css'
import {Button} from 'react-bootstrap'

function PopupSmall(props) {
    //This is the general popup template and functionality

    return (props.trigger) ? (

        <div className='popupSmallWrapper'>
            <div className='popupSmallInner'>
            <Button className ='closeSmallButton' variant='primary' onClick={() => props.setTrigger(false)}>
                Close
                </Button>
                {props.children}
                

            </div>
        </div>
    ) : "";
}

export default PopupSmall;
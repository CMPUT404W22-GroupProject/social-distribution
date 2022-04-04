import React from 'react'
import './popup.css'
import {Button} from 'react-bootstrap'

function Popup(props) {
    //This is the general popup template and functionality

    const closePopup = () => {
        if (Array.isArray(props.setTrigger) === true){
            props.setTrigger[0](false)
            props.setTrigger[1]()
        } else{
            props.setTrigger(false)
        }
       
    }

    return (props.trigger) ? (

        <div className='popupWrapper'>
            <div className='popupInner'>
            <Button className ='closeButton' variant='primary' onClick={() => closePopup()}>
                Close
                </Button>
                {props.children}

            </div>
        </div>
    ) : "";
}

export default Popup;
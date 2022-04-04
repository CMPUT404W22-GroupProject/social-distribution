import React from 'react'
import './popup.css'
import {Button} from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close';

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

        <div className='popupWrapper' role="dialog">
            <div className='popupInner'>
            <CloseIcon className ='closeButton' htmlColor="black" onClick={() => closePopup()}>
                </CloseIcon>
            {/* <Button className ='closeButton' variant='primary' onClick={() => closePopup()}>
                Close
                </Button> */}
                {props.children}

            </div>
        </div>
    ) : "";
}

export default Popup;
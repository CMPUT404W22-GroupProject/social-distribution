import React from 'react'
import './popup.css'
import {Button} from 'react-bootstrap'
import CloseIcon from '@mui/icons-material/Close';

function Popup(props) {
    //This is the general popup template and functionality

    return (props.trigger) ? (

        <div className='popupWrapper' role="dialog">
            <div className='popupInner'>
            <CloseIcon className ='closeButton' htmlColor="black" onClick={() => props.setTrigger(false)}>
                </CloseIcon>
                {props.children}

            </div>
        </div>
    ) : "";
}

export default Popup;
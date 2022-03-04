import React from 'react'
import './popup.css'
import {Button} from 'react-bootstrap'

function Popup(props) {

    return (props.trigger) ? (

        <div className='popupWrapper'>
            <div className='popupInner'>
            <Button className ='closeButton' variant='primary' onClick={() => props.setTrigger(false)}>
                Close
                </Button>
                {props.children}

            </div>


        </div>



    ) : "";





}

export default Popup;
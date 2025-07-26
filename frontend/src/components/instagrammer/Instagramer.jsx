import React, { useState } from "react";
import Catalog from "./catalog";
import '../../css/Instagramer.css'
function Instagramer () {

    return(
    <>
    <div className='instagramer-container'>
        <div className='instagramer-content'>
            <Catalog/>
        </div>
    </div>
    </>
    )
}

export default Instagramer;

import React, { useState } from "react";
import Catalog from "./catalog";
import Scraper from "./Scraper"
import '../../css/Instagramer.css'
function Instagramer () {

    return(
    <>
    <div className='instagramer-container'>
        <div className='instagramer-content'>
            <Catalog/>
        </div>
        <div className='instgramer-scraper'>
            <Scraper/>
        </div>
    </div>
    </>
    )
}

export default Instagramer;

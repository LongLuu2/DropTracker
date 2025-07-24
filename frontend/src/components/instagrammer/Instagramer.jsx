import React, { useState } from "react";
import Catalog from "./catalog";
import '../../css/Instagramer.css'
function Instagramer () {
    const [buttons, setButtons] = useState('catalog');

    const renderTool = () => {
        switch(buttons) {
            case 'catalog':
                return <Catalog/>;
            
            default:
                return <Catalog />
        }
    }
    return(
    <>
    <div className='instagramer-container'>
        <div className='instagramer-topbar'>
            <button onClick={() => setButtons('catalog') }>catalog</button>
        </div>
        <div className='instagramer-content'>
            {renderTool()}
        </div>
    </div>
    </>
    )
}

export default Instagramer;

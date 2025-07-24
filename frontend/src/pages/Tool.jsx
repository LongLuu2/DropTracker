import Dashboard from "../components/Dashboard";
import Instagramer from "../components/instagrammer/Instagramer.jsx"
import React, { useState } from "react";
import '../css/Tool.css'

function Tool() {
    const [tool, setTool] = useState('Dashboard');

    const renderTool = () => {
        switch(tool) {
            case 'Dashboard':
                return <Dashboard />;
            case 'OtherSellers':
                return <Instagramer />;
        
            default:
                return <Dashboard />;
        }
    };

    return(
        <div className="top">
            <div className="sideBar">  
                <div class="buttons">
                    <button onClick= {() => setTool('Dashboard')}>Dashboard</button>
                    <br/>
                    <button onClick={() => setTool('OtherSellers')}>Other Sellers</button>

                </div>   
            </div>
            <div className="content">
                {renderTool()}
            </div>
        </div>
    )
}

export default Tool;
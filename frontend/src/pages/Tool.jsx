import Dashboard from "../components/Dashboard";
import React, { useState } from "react";
import '../css/Tool.css'

function Tool() {
    const [tool, setTool] = useState('Dashboard');

    const renderTool = () => {
        switch(setTool) {
            case 'Dashboard':
                return <Dashboard />;
        
            default:
                return <Dashboard />;
        }
    };

    return(
        <div class="top">
            <div class="sideBar">  
                <div class="buttons">
                    <button onClick= {() => setTool('Dashboard')}>Dashboard</button>
                    <br/>
                    <button>placeholder</button>

                </div>   
            </div>
            <div class="content">
                {renderTool()}
            </div>
        </div>
    )
}

export default Tool;
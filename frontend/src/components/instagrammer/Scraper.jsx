import axios from 'axios'
import '../../css/Scraper.css'
import React, { useEffect, useState } from 'react';

function Scraper () {
    const [username, setUsername] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingDelete, setPendingDelete] = useState(null);
    const [queueAccounts, setQueueAccounts] = useState([]);
    const [showQueueConfirm, setShowQueueConfirm] = useState(false);
    const [pendingQueueDelete, setPendingQueueDelete] = useState(null);


    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const addAccount = async () => {
        try {
            const res = await axios.post(`http://localhost:8080/api/addInsta/${username}`);
            setMessage(res.data.message);
            setError(null);
            setUsername('');

            await fetchAccounts();
            await fetchQueueAccounts();
        } catch (err) {
            setError(err.response?.data?.error || "Unknown error");
            setMessage(null);
        }
    }
    const handleDelete = async (username) => {
        try {
            await fetch(`http://localhost:8080/api/removeDB/${username}`, { method: 'DELETE' });
            setAccounts(prev => prev.filter(acc => acc !== username));
        } catch (err) {
            console.error(`Failed to delete ${username}:`, err);
        }
    };
    const fetchAccounts = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/scrapedAccs');
            const data = await res.json();
            setAccounts(data);
        } catch (err) {
            console.error('Failed to fetch accounts:', err);
        }
    };
    const confirmDelete = (username) => {
        setPendingDelete(username);
        setShowConfirm(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            await fetch(`http://localhost:8080/api/removeDB/${pendingDelete}`, { method: 'DELETE' });
            setAccounts(prev => prev.filter(acc => acc !== pendingDelete));
            setShowConfirm(false);
            setPendingDelete(null);
        } catch (err) {
            console.error(`Failed to delete ${pendingDelete}:`, err);
        }
    };

    const handleCancel = () => {
        setShowConfirm(false);
        setPendingDelete(null);
    };
    const confirmQueueDelete = (username) => {
    setPendingQueueDelete(username);
    setShowQueueConfirm(true);
    };

    const handleQueueDeleteConfirmed = async () => {
    try {
        await fetch(`http://localhost:8080/api/removeQ/${pendingQueueDelete}`, { method: 'DELETE' });
        setQueueAccounts(prev => prev.filter(acc => acc !== pendingQueueDelete));
        setShowQueueConfirm(false);
        setPendingQueueDelete(null);
    } catch (err) {
        console.error(`Failed to delete ${pendingQueueDelete}:`, err);
    }
    };

    const handleQueueCancel = () => {
    setShowQueueConfirm(false);
    setPendingQueueDelete(null);
    };

    const fetchQueueAccounts = async () => {
    try {
        const res = await fetch('http://localhost:8080/api/getQ');
        const data = await res.json();
        setQueueAccounts(data);
    } catch (err) {
        console.error('Failed to fetch queue accounts:', err);
    }
    };

    const triggerScraper = async () => {
    try {
        const res = await fetch("http://localhost:8080/api/scrape", {
            method: "POST"
        });
        if (res.ok) {
            setMessage("Scraper started successfully.");
            setError(null);
        } else {
            const data = await res.json();
            setError(data.error || "Failed to run scraper.");
            setMessage(null);
        }
    } catch (err) {
        setError("Failed to trigger scraper.");
        setMessage(null);
        console.error(err);
    }
    };

    useEffect(() => {
        fetchAccounts();
        fetchQueueAccounts();
    }, []);

    return(
        <div className='scraper-container'>
            <div className='scraper-input'>
                <input
                type="text"
                placeholder="Enter Instagram username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
                <button onClick={addAccount}>Add to Queue</button>
                <button onClick={triggerScraper}>Process Accounts</button>
            </div>
            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>} 

            <div className='scraper-info'>
                <div className='scraper-acc'>
                    <h3>Account Logged</h3>
                     <ul className="account-list">
                        {accounts.map((acc, i) => (
                            <li className="account-item" key={i}>
                                {acc}
                                <span className="delete-button" onClick={() => confirmDelete(acc)}>×</span>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className='scraper-processing'>
                    <h3>Accounts in Q</h3>
                    <ul className="account-list">
                        {queueAccounts.map((acc, i) => (
                            <li className="account-item" key={i}>
                                {acc}
                                <span className="delete-button" onClick={() => confirmQueueDelete(acc)}>×</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>Are you sure you want to delete <strong>{pendingDelete}</strong>?</p>
                        <div className="modal-buttons">
                            <button onClick={handleDeleteConfirmed}>Yes, Delete</button>
                            <button onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {showQueueConfirm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <p>Are you sure you want to delete <strong>{pendingQueueDelete}</strong> from the queue?</p>
                        <div className="modal-buttons">
                            <button onClick={handleQueueDeleteConfirmed}>Yes, Delete</button>
                            <button onClick={handleQueueCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Scraper;
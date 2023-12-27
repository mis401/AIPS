import React from 'react';
import '../styles/Welcome.css';
import { useNavigate } from 'react-router-dom';

function Welcome() {
    const navigate = useNavigate();
    const handleParagraphClick = () => {
        navigate('auth');
      };
    return (
        <div className="welcome-container">
            <p className="join-us" onClick={handleParagraphClick}>
                Join us
            </p>

        <div className="main-container">
            <h1 className="heading">Event Driven</h1>
            <p className="paragraph">
                Welcome to our collaborative calendar app, where events come to life! Our platform is designed to provide a seamless and interactive experience for users to organize and manage events effortlessly.
            </p>
        </div>
    </div>
    );
}

export default Welcome;
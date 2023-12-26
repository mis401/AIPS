import React, { useState } from "react";
import '../styles/Auth.css'

function Auth(){
    const [signIn, setSignIn] = useState<boolean>(true);
    
    const handleSignInClick = () => setSignIn(false);
    const handleSignUpClick = () => setSignIn(true);
    return(
        <div className="container">
            <div className={`signUpContainer ${signIn ? 'signUpContainer-nonSignedIn' : ''}`}>
                <form className="form">
                <h1 className="title">Create Account</h1>
                    <input type='text' placeholder='Name' className="input" />
                    <input type='text' placeholder='Last Name' className="input" /> 
                    <input type='email' placeholder='Email' className="input" />
                    <input type='password' placeholder='Password' className="input" />
                    <input type='password' placeholder='Confirm Password' className="input" />
                    <button className="button">{signIn ? 'Sign Up' : 'Sign In'}</button>
                </form>
            </div>  
            <div className={`signInContainer ${signIn ? ' signInContainer-nonSignedIn' : ''}`}>
                <form className="form">
                <h1 className="title">Sign In</h1>
                    <input type="email" placeholder="Email" className="input" />
                    <input type="password" placeholder="Password" className="input" />
                    <a href="#" className="anchor">Forgot your password?</a>
                    <button className="button">Sign In</button>
                </form>
            </div> 
            <div className={`overlayContainer ${signIn ? ' overlayContainer-nonSignedIn' : ''}`}>
                    <div className={`overlay ${signIn ? ' overlay-nonSignedIn' : ''}`}>
                        <div className={`leftOverlayPanel ${signIn ? ' leftOverlayPanel-nonSignedIn' : ''}`}>
                            <h1 className="title">Welcome Back!</h1>
                            <p className="paragraph">
                                To keep connected with us please login with your personal info
                            </p>
                            <button className="ghostButton" onClick={handleSignInClick}>Sign In</button>
                        </div>

                        <div className={`rightOverlayPanel ${signIn ? ' rightOverlayPanel-nonSignedIn' : ''}`}>
                            <h1 className="title">Hello, Friend!</h1>
                            <p className="paragraph">
                                Enter Your personal details and start the journey with us
                            </p>
                            <button className="ghostButton" onClick={handleSignUpClick}>Sign Up</button>
                        </div> 
                    </div>
                </div>
        </div>
);
}

export default Auth;
import React, { useState } from "react";
import '../styles/Auth.css'
import { useNavigate } from "react-router-dom";
import { error } from "console";

function Auth(){
    const [signIn, setSignIn] = useState<boolean>(true);
    
    const handleSignInClick = () => setSignIn(false);
    const handleSignUpClick = () => setSignIn(true);

    const navigate = useNavigate();
    const handleParagraphClick = () => {
        navigate('/home');
      };

    //connect
    const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault(); 

        const formData = new FormData();
        const formObject: { [key:string] : string } = {};
        formData.forEach((value, key) => {
            formObject[key] = value.toString();
        });

        if(formObject.password !== formObject.confirmPasword){
            console.error('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('auth/signup', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    firstName: formObject.firstName,
                    lastName: formObject.lastName,
                    email: formObject.email,
                    password: formObject.password,
                }),
            });

            if(response.ok) {
                navigate('/home');
            } else {
                const errorData = await response.json();

                console.error('Signup failed: ', errorData.message);
            }
        }
        catch (error) {
            console.error('Fetch error:', error);
        }
    }
    return(
        <div className="authContainer">
            <div className={`signUpContainer ${signIn ? 'signUpContainer-nonSignedIn' : ''}`}>
                <form className="form">
                <h1 className="title">Create Account</h1>
                    <input type='text' placeholder='First Name' className="input" />
                    <input type='text' placeholder='Last Name' className="input" /> 
                    <input type='email' placeholder='Email' className="input" />
                    <input type='password' placeholder='Password' className="input" />
                    <input type='password' placeholder='Confirm Password' className="input" />
                    <button className="button" onClick={(e) => handleSignUp(e)}>Sign Up</button>
                    {/*trebalo bi nekako da se nakon sign up-a da ga prebaci na sign in*/}
                </form>
            </div>  
            <div className={`signInContainer ${signIn ? ' signInContainer-nonSignedIn' : ''}`}>
                <form className="form">
                <h1 className="title">Sign In</h1>
                    <input type="email" placeholder="Email" className="input" />
                    <input type="password" placeholder="Password" className="input" />
                    <a href="#" className="anchor">Forgot your password?</a>
                    <button className="button" onClick={handleParagraphClick}>Sign In</button>
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
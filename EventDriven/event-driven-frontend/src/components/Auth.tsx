import React, { useState } from "react";
import '../styles/Auth.css'
import { useNavigate } from "react-router-dom";
import { error } from "console";

function Auth(){
    const [signIn, setSignIn] = useState<boolean>(true);
    
    const handleSignInClick = () => setSignIn(false);
    const handleSignUpClick = () => setSignIn(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();
    const handleParagraphClick = () => {
        navigate('/home');
      };

    function handleFirstName(event: React.ChangeEvent<HTMLInputElement>) {
        setFormData((currentFormData) => {
            return {
                ...currentFormData,
                firstName: event.target.value,
            };
        });
    }
    function handleLastName(event: React.ChangeEvent<HTMLInputElement>) {
        setFormData((currentFormData) => {
            return {
                ...currentFormData,
                lastName: event.target.value,
            };
        });
    }
    function handleEmail(event: React.ChangeEvent<HTMLInputElement>) {
        setFormData((currentFormData) => {
            return {
                ...currentFormData,
                email: event.target.value,
            };
        });
    }
    function handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
        setFormData((currentFormData) => {
            return {
                ...currentFormData,
                password: event.target.value,
            };
        });
    }
    function handleConfirmPassword(event: React.ChangeEvent<HTMLInputElement>) {
        setFormData((currentFormData) => {
            return {
                ...currentFormData,
                confirmPassword: event.target.value,
            };
        });
    }
    //connect
    const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault(); 
        

        if(formData.password !== formData.confirmPassword){
            console.error('Passwords do not match');
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/auth/signup', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if(response.ok) {
                handleSignInClick();
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
                <form name="signupForm" className="form">
                <h1 className="title">Create Account</h1>
                    <input type='text' placeholder='First Name' className="input" onChange={handleFirstName}/>
                    <input type='text' placeholder='Last Name' className="input" onChange={handleLastName} /> 
                    <input type='email' placeholder='Email' className="input" onChange={handleEmail} />
                    <input type='password' placeholder='Password' className="input" onChange={handlePassword} />
                    <input type='password' placeholder='Confirm Password' className="input"onChange={handleConfirmPassword}  />
                    <button className="button" onClick={(e) => handleSignUp(e)}>Sign Up</button>
                    {/*trebalo bi nekako da se nakon sign up-a da ga prebaci na sign in*/}
                </form>
            </div>  
            <div className={`signInContainer ${signIn ? ' signInContainer-nonSignedIn' : ''}`}>
                <form name="signinForm" className="form">
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
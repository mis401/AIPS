import React, { useState } from "react";
import '../../styles/Auth.css'
import { useDispatch } from 'react-redux';
import { loginSuccess } from "../../redux/authReducer";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Auth() {
    const [signIn, setSignIn] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { setAuth } = useAuth();
    
    const handleSignInClick = () => setSignIn(false);
    const handleSignUpClick = () => setSignIn(true);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleFieldChange = (fieldName: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
    };
    
    const handleSignUp = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault(); 
        setIsLoading(true);
        setError('');
    
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
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

            if (response.ok) {
                handleSignInClick();
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            setError('Signup failed');
        }
        setIsLoading(false);
    }

    const handleSignIn = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/auth/signin', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            if (response.ok) {
                const userData = await response.json();
                dispatch(loginSuccess(userData.user));
                setAuth({ user: {
                    id: userData.user.id,
                    firstName: userData.user.firstName,
                    lastName: userData.user.lastName,
                    email: userData.user.email,
                    role: userData.user.role,
                } });
                navigate('/home');
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            setError('Signin failed');
        }
        setIsLoading(false);
    }
    
    return(
        <div className="authContainer">
            {isLoading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            <div className={`signUpContainer ${signIn ? 'signUpContainer-nonSignedIn' : ''}`}>
                <form name="signupForm" className="form">
                    <h1 className="title">Create Account</h1>
                    <input type='text' placeholder='First Name' className="input" onChange={(e) => handleFieldChange('firstName', e.target.value)}/>
                    <input type='text' placeholder='Last Name' className="input" onChange={(e) => handleFieldChange('lastName', e.target.value)} /> 
                    <input type='email' placeholder='Email' className="input" onChange={(e) => handleFieldChange('email', e.target.value)} />
                    <input type='password' placeholder='Password' className="input" onChange={(e) => handleFieldChange('password', e.target.value)} />
                    <input type='password' placeholder='Confirm Password' className="input" onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}  />
                    <button className="button" onClick={(e) => handleSignUp(e)}>Sign Up</button>
                </form>
            </div>  
            <div className={`signInContainer ${signIn ? ' signInContainer-nonSignedIn' : ''}`}>
                <form name="signinForm" className="form">
                    <h1 className="title">Sign In</h1>
                    <input type="email" placeholder="Email" className="input" onChange={(e) => handleFieldChange('email', e.target.value)} />
                    <input type="password" placeholder="Password" className="input" onChange={(e) => handleFieldChange('password', e.target.value)} />
                    <a href="#" className="anchor">Forgot your password?</a>
                    <button className="button" onClick={(e) => handleSignIn(e)}>Sign In</button>
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

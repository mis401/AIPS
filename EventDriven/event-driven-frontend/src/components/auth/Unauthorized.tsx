import { useNavigate } from "react-router-dom"
import '../../styles/Welcome.css'

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => navigate(-1);

    return (
        <div className="welcome-container">
            <div className="main-container">
                <h1 className="heading">Unauthorized</h1>
                <br />
                <p className="paragraph">You do not have access to the requested page.</p>
                
                <button className="join-us btn" onClick={goBack}>Go Back</button>
            </div>
        </div>
    )
}

export default Unauthorized
import Calendar from "./Calendar";
import '../styles/Home.css'
import Sidebar from "./Sidebar";
import '../styles/Sidebar.css'
import Iconbar from "./Iconbar";
import '../styles/Iconbar.css'
function Home() {
    return (
        <div className="container">
           <Sidebar/>
           <Calendar/>
           <Iconbar/>
        </div>
    );
} 

export default Home;
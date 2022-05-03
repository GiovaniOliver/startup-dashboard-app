import "./home.scss"

import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar"; 
import Widget from "../../Components/widget/Widget"

const Home = () => {
  return (
    <div className="home">
        <Sidebar/>
    <div className="homeContainer">
    <Navbar/>
    <div className="widget"> 
      <Widget/>
      <Widget/>
      <Widget/>
      <Widget/>
          </div>
        </div>
      </div>  
    
  
  );
};

export default Home
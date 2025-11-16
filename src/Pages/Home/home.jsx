import "./home.scss";

import Sidebar from "../../Components/sidebar/Sidebar";
import Navbar from "../../Components/navbar/Navbar";
import Widget from "../../Components/widget/Widget";
import { widgetData } from "../../data/widgetData";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="team" data={widgetData.team} />
          <Widget type="budget" data={widgetData.budget} />
          <Widget type="tasks" data={widgetData.tasks} />
          <Widget type="interns" data={widgetData.interns} />
        </div>
      </div>
    </div>
  );
};

export default Home;
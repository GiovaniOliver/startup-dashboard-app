import "./sidebar.scss"
import { memo } from "react";
import { Link } from "react-router-dom";

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GroupsIcon from '@mui/icons-material/Groups';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import PaidIcon from '@mui/icons-material/Paid';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import FolderIcon from '@mui/icons-material/Folder';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Sidebar = memo(() => {
    return (
        <div className='sidebar'>
            <div className="top">
                <span className="logo">NCE Dashboard Management</span>
                </div>
                
                <hr/>

            <div className="center">
                
                <ul>

                <p className="title">Main</p>
                <li>
                <DashboardIcon className="icon"/>
                <span className="menuitems">Dashboard</span>
                </li>

               
                
                <hr/>
               
               
                
                
                

                <p className="title">Learning & Resources</p>

                <Link to="/learn" style={{ textDecoration: 'none' }}>
                  <li>
                    <SchoolIcon className="icon"/>
                    <span className="menuitems">Learning Center</span>
                  </li>
                </Link>

                <Link to="/resources" style={{ textDecoration: 'none' }}>
                  <li>
                    <FolderIcon className="icon"/>
                    <span className="menuitems">Resources</span>
                  </li>
                </Link>

                <Link to="/help" style={{ textDecoration: 'none' }}>
                  <li>
                    <HelpOutlineIcon className="icon"/>
                    <span className="menuitems">Help & Support</span>
                  </li>
                </Link>

                <hr/>

                     <p className="title">Team Builder & Manager</p>
                    <li>
                        <GroupsIcon className="icon"/>
                        <span className="menuitems">Team Selector</span>
                    </li>


                    <li>
                        <CurrencyExchangeIcon className="icon"/>
                        <span className="menuitems" >Team Salary</span>
                    </li>

                
                </ul>

                 <ul>
                <Link to="/tasks" style={{ textDecoration: 'none' }}>
                  <li>
                    <PlaylistAddIcon className="icon"/>
                    <span className="menuitems">Task Dashboard</span>
                  </li>
                </Link>

                <Link to="/task-timeline" style={{ textDecoration: 'none' }}>
                  <li>
                    <AccessTimeIcon className="icon"/>
                    <span className="menuitems">Task Timeline</span>
                  </li>
                </Link>

                <Link to="/task-cost" style={{ textDecoration: 'none' }}>
                  <li>
                    <AttachMoneyIcon className="icon"/>
                    <span className="menuitems">Task Cost</span>
                  </li>
                </Link>

                 </ul>


            
                <hr/>

                
                <ul>

                <p className="title">Intern Builder & Manager</p>

                <Link to="/interns" style={{ textDecoration: 'none' }}>
                  <li>
                    <PeopleOutlineIcon className="icon"/>
                    <span className="menuitems">Intern List</span>
                  </li>
                </Link>

                <Link to="/interns/new" style={{ textDecoration: 'none' }}>
                  <li>
                    <PlaylistAddIcon className="icon"/>
                    <span className="menuitems">Add New Intern</span>
                  </li>
                </Link>

                <li>
                  <CurrencyExchangeIcon className="icon"/>
                  <span className="menuitems">Intern Stipend</span>
                </li>

                <li>
                  <AccessTimeIcon className="icon"/>
                  <span className="menuitems">Task Timeline</span>
                </li>

                <li>
                  <AttachMoneyIcon className="icon"/>
                  <span className="menuitems">Task Cost</span>
                </li>

                </ul>



               
                <hr/>

                <ul>

                     <p className="title">Payout Manager</p>

                <Link to="/team-payout" style={{ textDecoration: 'none' }}>
                  <li>
                    <PaidIcon className="icon"/>
                    <span className="menuitems">Team Payout</span>
                  </li>
                </Link>

                <Link to="/intern-payout" style={{ textDecoration: 'none' }}>
                  <li>
                    <PaidIcon className="icon"/>
                    <span className="menuitems">Intern Payout</span>
                  </li>
                </Link>

                <Link to="/financial-overview" style={{ textDecoration: 'none' }}>
                  <li>
                    <AssessmentIcon className="icon"/>
                    <span className="menuitems">Financial Overview</span>
                  </li>
                </Link>

                </ul>
             <hr />

                </div>

                

                <div className="bottom">

                    <ul>    
                     <p className="title">Settings</p>                                                
                    <li>    
                        <AccountBoxIcon className="icon"/>
                        <span className="menuitems">Profile</span>                       
                    </li>
                        <li>
                            <ExitToAppIcon className="icon"/>
                            <span className="menuitems">Logout</span>                               
                        </li>
                    </ul>    

                    <InvertColorsIcon/>            
        <div
          className="colorOption"
         
        ></div>
        <div
          className="colorOption"
          
        ></div>
      </div>


         </div>

         
        
    );

});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
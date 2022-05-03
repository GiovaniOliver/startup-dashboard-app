import  "./sidebar.scss"

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

const Sidebar = ()  => {
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
               
               
                
                
                

                <p className="title">Courses</p>
                        <li>
                        <WorkIcon className="icon"/>
                        <span className="menuitems">Framework</span>

                        
                        </li>

                       

                        
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
                <li>

                <PlaylistAddIcon className="icon"/>
                <span className="menuitems">Task Selector</span>
                
               
                </li>


                <li>
                <AccessTimeIcon className="icon"/>
                <span className="menuitems"> Task Timeline</span>
                </li>


                <li>
                    <AttachMoneyIcon className="icon"/>
                <span className="menuitems"> Task Cost</span>
                 </li>
                
              


                 </ul>


            
                <hr/>

                
                <ul>

                <li>

                <span className="title"> Intern Builder & Manager </span>
                
                </li>


               
                 <li>
                <PeopleOutlineIcon className="icon"/>
                <span className="menuitems">Inter Selector</span>
                
                </li>


                <li>
                <CurrencyExchangeIcon className="icon"/>
                <span className="menuitems">Intern Cost</span>

                </li>



                <li>
                <PlaylistAddIcon className="icon"/>
                <span className="menuitems">Task Selector</span>
                
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

                <li>
                <PaidIcon className="icon"/>
                <span className="menuitems">Team Payout</span>
                
                </li>


                <li>
                <PaidIcon className="icon"/>
                <span className="menuitems">Intern Payout</span>
                
                </li>

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

};
export default Sidebar;
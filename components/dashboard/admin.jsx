import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleSwitch from './switch1'; // Adjust the path to the actual location of your ToggleSwitch component
import styles from '../styles/bg.module.css'; // Adjust the relative path to match your project structure
import Logs from '../../components/dashboard/inventory';
import Adding from '../../components/dashboard/Adddispensermodal';
import Switch from '../../components/dashboard/switch1';
import Disp from  '../../components/dashboard/dispenser';
import Scroll from '../../components/dashboard/scrolalbleTable';
import Invbutton from '../../components/dashboard/invbutton';
import AddCon from '../../components/dashboard/AddContainer';
import Limit from './limit';



function DateTimeComponent() {
  const [currentDateTime, setCurrentDateTime] = useState('');

  useEffect(() => {
    // Function to update the full date and time
    function updateFullDateTime() {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      };
      const dateTimeString = now.toLocaleDateString(undefined, options);
      setCurrentDateTime(dateTimeString);
    }

    // Update the full date and time initially and every second
    updateFullDateTime(); // Call the function initially
    const intervalId = setInterval(updateFullDateTime, 1000); // Update every second

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="d-fixed position-absolute top-0 end-0 p-1">
      <p>{currentDateTime}</p>
    </div>
  );
}

export default function Dashboard({ user }) {
  const dateTimeContainerStyle = {
    position: 'relative',
    top: '20px',
    right: '20px',
    padding: '1px',
    
    color: 'black',
  };
  let roleName = '';
  switch (user.role) {
    case 'admin':
      roleName = 'Admin';
      break;
    case 'personnel':
      roleName = 'Personnel';
      break;
    case 'student':
      roleName = 'Student';
      break;
    default:
      roleName = 'User';
  }

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [maxRefills, setMaxRefills] = useState(0); // State to store the maximum refills



  // Function to save the entered text to local storage
 

  // Function to handle changes in maximum refills
  const handleMaxRefillsChange = () => {
    // Implement the logic to change the maximum refills here
    console.log('Set maximum refills:', maxRefills);
  };

 
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


  const renderSavedTexts = () => { 
    
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
      return (
        <div className="row justify-content-justify align-items-justify">
           <Adding />
          <Disp />
         
        

        </div>
      );


  case 'RefillLogs':
  
        return (
          <div style={{ textAlign: "center" }}>
          <Scroll />
            <h2></h2>
            <div style={{ marginTop: "20px" }}>
              <Invbutton  style={{ marginLeft: "580px", width: "150px" }} />
            </div>
            <div style={{ marginTop: "5px" }}>
              <AddCon 
                
                style={{
                  marginLeft: "580px",
                  width: "150px",
                  backgroundColor: "blue", // Set background color to blue
                  borderRadius: "2px", // Set border radius to 2px
                }}
              />
            </div>
          </div>
        );
   

      case 'Change':
        return (
          <div>
            <h2 className="fw-bold fs-5" style ={{backgroundColor:'Background', border:'3px solid #694e4e'}}>Set the Maximum Refills of each Dispenser</h2>
            <Limit/>
          </div>
        );   
        case 'Switch':
          return (
            <div>
              <h2 className="fw-bold fs-5">Dispenser's Switches</h2>
              <Switch/> 
            </div>
          );
       
      }
  };

  return (
    <div className={styles.gradientBackground}> {/* Apply the CSS class here */}
     
      <div style={dateTimeContainerStyle}>
        <DateTimeComponent />
      </div>
      <div className="container-fluid mt-4">
        <div className="row" style={{diposition:'flex'}}>
        <div className="col-md-3" style={{ borderRight: '3px solid #000000', borderBottom: '1px solid #000', borderTop: '1px solid #000'}}>
            <ul className="nav flex-column " id="myTabs" role="tablist">
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === 'Dashboard' ? 'active' : ''}`}
                  id="Dashboard-tab"
                  data-toggle="tab"
                  href="#Dashboard"
                  role="tab"
                  aria-controls="Dashboard"
                  aria-selected={activeTab === 'Dashboard'}
                  onClick={() => handleTabClick('Dashboard')}
                >
                  <span className="fw-bold fs-3" style={{ color: 'black' }}>Dashboard</span>
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === 'RefillLogs' ? 'active' : ''}`}
                  id="RefillLogs-tab"
                  data-toggle="tab"
                  href="#RefillLogs"
                  role="tab"
                  aria-controls="RefillLogs"
                  aria-selected={activeTab === 'RefillLogs'}
                  onClick={() => handleTabClick('RefillLogs')}
                >
                  <span className="fw-bold fs-3" style={{ color: 'black' }}>Refill Logs</span>
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === 'Change' ? 'active' : ''}`}
                  id="Change-tab"
                  data-toggle="tab"
                  href="#Change"
                  role="tab"
                  aria-controls="Change"
                  aria-selected={activeTab === 'Change'}
                  onClick={() => handleTabClick('Change')}
                >
                  <span className="fw-bold fs-3" style={{ color: 'black' }}>Change Refill Number</span>
                </a>
              </li>
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link ${activeTab === 'Switch' ? 'active' : ''}`}
                  id="Switch-tab"
                  data-toggle="tab"
                  href="#Switch"
                  role="tab"
                  aria-controls="Switch"
                  aria-selected={activeTab === 'Switch'}
                  onClick={() => handleTabClick('Switch')}
                >
                  <span className="fw-bold fs-3" style={{ color: 'black' }}>Dispenser Switch</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-9" style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000', paddingTop: '20px'}}>
            <div style={{ marginLeft: '50px',display: 'relative' }}>
              {renderTabContent()}
            </div>
            {activeTab === 'Dashboard' 
            
            }
         
          </div>
        </div>
      </div>

    </div>
  );
}
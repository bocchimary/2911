import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleSwitch from './switch'; // Adjust the path to the actual location of your ToggleSwitch component
import styles from "../styles/bg.module.css"; // Adjust the relative path to match your project structure
import Logs from '../../components/dashboard/inventory';
import Adding from '../../components/dashboard/Adddispensermodal';
import Switch from '../../components/dashboard/switch';
import Go from  '../../components/dashboard/studentsdisplay';

function DateTimeComponent() {
  const [currentDateTime, setCurrentDateTime] = useState('true');
  <link rel="icon" href="/logo.ico" />
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
    setCurrentDateTime(currentDateTime);
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{display:'flex', margin:'10px'}}>
      {currentDateTime};
    </div>
  );
}

<div style={{   border: ' solid 2px black'
}} >
<div className = {styles.movingText} style={{ width:'100vh'
}}>
<h3>Welcome to Student's</h3>
</div>
</div>

export default function Dashboard({ user }) {
  const dateTimeContainerStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1px',
    color: 'black',
  };

  const renderSavedTexts = () => {};

  const renderTabContent = () => {
    return (
      <div style={{justifyContent:'center', display:'block'}}>
       
       <div style={{ display: 'flex', justifyContent: 'center', alignSelf:'center', 
       background: 'linear-gradient(to bottom, #D61E1E, #ff9999)',fontFamily:'Arial Black', color:'White' }}>

           <h1>TUPC Water Dispenser System</h1>
        </div>
        <div className="row d-flex" >
          
          <div className="row justify-content-justify" style={{ margin:'20px'}}>
        <DateTimeComponent />

          </div>
          <Go />
        </div>
    
      </div>
    );
  };

  return (
    <div style = {{marginTop:'10px'}}>
      <div className={styles.gradientBackground}>
        <div style={dateTimeContainerStyle}>
          
        </div>
        <div className="col-md-12" style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000', paddingTop: '10px' }}>
          <div style={{ margin: '40px 100px 25px 200px', display: 'flex' }}>
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

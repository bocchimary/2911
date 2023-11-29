

import { AiFillCloseCircle } from "react-icons/ai";
import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";

const AddContainer = () => {
  const [showForm, setShowForm] = useState();
  const [newTextBoxValue, setNewTextBoxValue] = useState('');
  const [currenttime, setcurrenttime] = useState('');
  const [remainrefill, setcurrentremainrefill] = useState('');
  const [decrementedValue,   setdecrementedValue] = useState('');
  const [totalValue, setTotalValue] = useState(null);
  const [startingRefills, setStartingRefills] = useState(null);
  const [remaining, setremaining] = useState('');


  const handleButtonClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Send a POST request to your server to store the container data
    try {
      const response = await fetch('http://localhost:3001/AddContainer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ }),
      });

      if (response.ok) {
        console.log('Container added successfully');
        Remain();
      } else {
        console.error('Failed to add container:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding container:', error);
    }

    // Reset form state after submission
    setShowForm(false);
   
  };
  
    // Add this function above your return statement
const handleAddToMySQL = async () => {
  try {
    const response = await fetch('http://localhost:3001/addToMySQL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        textBoxValue: newTextBoxValue,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Data added to MySQL successfully:', data);
      // Optionally, you can clear the textbox value after adding to MySQL
      setNewTextBoxValue('');
      setcurrentime('')
    } else {
      console.error('Error adding data to MySQL:', data.error);
    }
  } catch (error) {
    console.error('Error adding data to MySQL:', error);
  }
};

const getTimestampFromServer = async () => {
    try {
      const response = await fetch('http://localhost:3001/getDate');
      const data = await response.json();
  
      if (response.ok) {
        const date = data.date;
        console.log('Date',date);
        // Do something with the retrieved timestamp
      } else {
        console.error('Error from MySQL:', data.error);
      }
    } catch (error) {
      console.error('Errorfrom MySQL:', error);
    }
  };



 // Function to fetch total value
const fetchTotalValue = async () => {
    try {
    
      const response = await fetch('http://localhost:3001/getTotalValue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalValue: setValue,
        }),
      
    });
      const data = await response.json();
  
      if (response.ok) {
        setTotalValue(setValue); 
        console.log('Total Value:', data);
      } else {
        console.error('Error fetching total value:', data.error);
      }
    } catch (error) {
      console.error('Error fetching total value:', error);
    }
  };
  
 // Function to fetch starting refills
const fetchStartingRefills = async () => {
    try {
      const response = await fetch('http://localhost:3001/startingRefills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startingRefills: setRefill,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setStartingRefills(setRefill); // Assuming setStartingRefills is a state-setting function
        console.log('Starting Refills:', data);
      } else {
        console.error('Error fetching starting refills:', data.error);
      }
    } catch (error) {
      console.error('Error fetching starting refills:', error);
    }
  };
  
  
  // Call the fetch functions
  const Remain = async () => {
    try {
      // Fetch total value and starting refills
      const totalValue = await fetchTotalValue();
      const startingRefills = await fetchStartingRefills();
  
      // Check if fetched data is valid
      if (totalValue !== null && startingRefills !== null) {
        // Correct the formula for calculating remainingValue
        const remainingValue = startingRefills - totalValue;
  
        // Send the remaining value to the server
        const response = await fetch('http://localhost:3001/Remain', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            remainingValue,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Data added to MySQL successfully:', data);
        } else {
          // Log the specific error message
          const data = await response.json();
          console.error('Error adding data to MySQL:', data && data.error ? data.error : 'Unknown error');
        }
      } else {
        console.error('Invalid totalValue or startingRefills');
      }
    } catch (error) {
      // Log the specific error message
      console.error('Error in Remain function:', error.message || 'Unknown error');
    }
  };
  
  // Example usage

  






  const handleOverlayClick = (e) => {
    // Check if the click occurred on the overlay element
    if (e.target.classList.contains("overlay")) {
      // Do nothing, you can add additional logic here if needed
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const addconbutton = () => {
    handleAddToMySQL();
    getTimestampFromServer();
    fetchTotalValue();
    fetchStartingRefills();
    Remain();
  };
  

  return (
    <div>
      <button onClick={handleButtonClick}>Add Container</button>
      
      {showForm && (
        <>
          <div className="overlay" onClick={handleOverlayClick}></div>
          <form onSubmit={handleFormSubmit} className="form-container">
            <div className="close-button" onClick={handleCloseForm}>
              <AiFillCloseCircle />
            </div>
         
            <label style={{ color: 'black' }}>
              Number of container:
              <input
                type="number"
                value={newTextBoxValue}
                onChange={(e) => setNewTextBoxValue(e.target.value)}
                pattern="[0-9]*" // This pattern allows only numeric input
                className="input-spacing"
                style={{ marginLeft: "10px", maxWidth: '70px' }}
              />
                 <label className="total-container-label">Total container:</label>
            </label>
            <button onClick={addconbutton} className="add-button" style={{ width: "100px", marginTop: "20px", fontWeight: 'bold' }} type="submit">
              Add
            </button>
            
          </form>
        </>
      )}
    </div>
  );
};

export default AddContainer;
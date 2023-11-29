//Inventory.jsx
import React, { useState } from "react";

// PopUp component to display when the button is clicked
const PopUp = ({ onClose, onAddInteger }) => {
  const [inputInteger, setInputInteger] = useState("");

  const handleInputChange = (e) => {
    // Ensure only integers are entered
    const inputValue = e.target.value.replace(/[^0-9]/g, "");
    setInputInteger(inputValue);
  };

  const handleAddInteger = async () => {
    try {
      const integer = parseInt(inputInteger, 10);
      await onAddInteger(integer); // Make the API request
      onClose();
    } catch (error) {
      console.error("Error adding integer:", error);
    }
  };
  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Add Water Container</h3>
        {/* Input field for integer */}
        <input
          type="text"
          placeholder="Enter Delivered Containers"
          value={inputInteger}
          onChange={handleInputChange}
        />
        {/* Button to add the entered integer */}
        <button onClick={handleAddInteger}>Update Inventory</button>
        {/* Button to close the pop-up */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const Inventory = ({ totalConsumed }) => {
  const [isPopUpVisible, setPopUpVisible] = useState(false);
  const [addedInteger, setAddedInteger] = useState("");

  const togglePopUp = () => {
    setPopUpVisible(!isPopUpVisible);
  };

  const handleAddInteger = async (integer) => {
    try {
      // Make an API request to store the integer in the database
      const response = await axios.post("/api/addWaterContainer", { integer });
      
      // Assuming the response includes the added integer
      setAddedInteger(response.data.addedInteger);

      // Add any other logic based on the response
    } catch (error) {
      console.error("Error adding integer to database:", error);
    }
  };

  return (
    <div className="col-lg-6 col-md-12">
     

      {/* Conditionally render the pop-up based on state */}
      {isPopUpVisible && <PopUp onClose={togglePopUp} onAddInteger={handleAddInteger} />}


      {/* Display the added integer */}
      {addedInteger && <p>Added: {addedInteger}</p>}
    </div>
  );
};

export default Inventory;
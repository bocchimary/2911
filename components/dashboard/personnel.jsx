import React, { useEffect, useState } from 'react';

const loadSavedTexts = () => {
  const savedTexts = localStorage.getItem('savedTexts');
  return savedTexts ? JSON.parse(savedTexts) : [];
};

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
    <div className="position-absolute top-0 end-0 p-1">
      <p>{currentDateTime}</p>
    </div>
  );
}

export default function Dashboard({ user }) {
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
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility
  const [inputText, setInputText] = useState(''); // State to store user input
  const [savedTexts, setSavedTexts] = useState([]); // State to store entered texts
  const [displayText, setDisplayText] = useState(''); // State to store the displayed text
  const [isInputFilled, setIsInputFilled] = useState(false);


  useEffect(() => {
    // Load saved texts from local storage when the component mounts
    const loadedSavedTexts = loadSavedTexts();
    setSavedTexts(loadedSavedTexts);
  }, []);

  // Function to save the entered text to local storage
  const saveTextToLocalStorage = (texts) => {
    localStorage.setItem('savedTexts', JSON.stringify(texts));
  };

  const hoverStyles = {
    fontWeight: 'bold',
  };

  const customBorderStyle = {
    border: '1px solid #000', // Black border with 1px width
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSaveText = () => {
    // Update the list of saved texts with the entered text
    const updatedTexts = [...savedTexts, inputText];
    setSavedTexts(updatedTexts);
    // Save the updated texts to local storage
    saveTextToLocalStorage(updatedTexts);

    // Close the modal
    setShowModal(false);
  };

  const handleDeleteText = (index) => {
    // Remove the saved text at the specified index
    const updatedTexts = [...savedTexts];
    updatedTexts.splice(index, 1);
    setSavedTexts(updatedTexts);
    // Save the updated texts to local storage
    saveTextToLocalStorage(updatedTexts);
  };

  const renderSavedTexts = () => {
    const outerBoxStyle = {
      width: 'auto', // Adjust the width as needed
      height: 'auto', // Adjust the height as needed
      border: '1px solid #000',
      backgroundColor: 'white',
      padding: '10px',
      margin: '10px', // Adjust the margin as needed
      borderRadius: '15px', // Adjust the borderRadius to your desired value
    };

    const innerBoxStyle = {
      width: '100%', // Make the inner box fill the outer box
      height: 'auto', // Make the inner box fill the outer box
      border: '1px solid #000',
      padding: '10px',
      backgroundColor: '#84FDFF', // Adjust the background color as needed
      overflow: 'auto', // Add scrollbars if needed for long text
    };

    const textContainerStyle = {
      textAlign: 'center',
      fontSize: '16px', // Adjust font size
      fontWeight: 'bold', // Adjust font weight
      color: '#333', // Adjust text color
    };
    const statusTextStyle = {
      textAlign: 'center',
      fontSize: '15px', // Adjust font size
      fontWeight: 'bold', // Adjust font weight
      color: '#000', // Adjust text color
    };
    const buttonStyle = {
      marginLeft: 'auto',
      bottom: '10px', // Adjust the distance from the bottom as needed
      position: 'auto'
    };

    const additionalTextStyle = {
      textAlign: 'left',
      marginTop: '20px',
      paddingTop: '10px', // Add padding for spacing
    };

    const boxInsideStyle = {
      width: '30px', // Adjust the width as needed
      height: '40px', // Adjust the height as needed
      border: '1px solid #000',
      backgroundColor: 'white',
      marginTop: '10px', // Add margin for spacing
    };

    return savedTexts.map((text, index) => (
      <div key={index} className="col-md-4 mb-3">
        <div style={outerBoxStyle}>
        <div style={innerBoxStyle}>
          <div style={textContainerStyle}>
             {text}
          </div>
          
        </div>
        <p style={statusTextStyle}>STATUS</p>
          <div style={additionalTextStyle}>
              <p>Remaining:</p>
          </div>
          <div style={boxInsideStyle}></div>       
          <button
            className="btn btn-danger btn-sm mt-2"
            onClick={() => handleDeleteText(index)}
            style={buttonStyle}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };
  
  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="row">
            {renderSavedTexts()}
            <div className="col-md-4 mb-3">
            <button
              className="btn btn-primary btn-sm mt-2"
              style={{
                width: '100px',  // Fixed width
                height: '100px',  // Fixed height
                
                
              }}
              onClick={() => setShowModal(true)}
            >
              Add Dispenser
            </button>
            </div>
          </div>
        );

      case 'RefillLogs':
        return (
          <div>
            <h2 className="fw-bold fs-5">Refill Logs</h2>
            <p>Content for Refill Logs goes here.</p>
          </div>
        );
      case 'tab3':
        return (
          <div>
            <h2 className="fw-bold fs-5">Tab 3</h2>
            <p>Content for Tab 3 goes here.</p>
          </div>
        );
      case 'tab4':
        return (
          <div>
            <h2 className="fw-bold fs-5">Tab 4</h2>
            <p>Content for Tab 4 goes here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  

  return (
    <div>
      <h1> Welcome to {roleName} Page</h1>
      <div> 
        <DateTimeComponent />
      </div>
      <div className="container-fluid mt-4">
        <div className="row">
        <div className="col-md-3" style={{ borderRight: '3px solid #000000', borderBottom: '1px solid #000', borderTop: '1px solid #000'}}>
            <ul className="nav flex-column" id="myTabs" role="tablist">
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
          <div className="col-md-9" style={{ borderBottom: '1px solid #000', borderTop: '1px solid #000', paddingTop: '100px'}}>
            <div style={{ marginLeft: '50px' }}>
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
      {/* Modal for adding text */}
      {showModal && (
  <div className={`modal fade show`} tabIndex="-1" role="dialog" style={{ display: 'block' }}>
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Dispenser</h5>
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
            onClick={handleModalClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="inputText">Enter location:</label>
            <input
              type="text"
              className="form-control"
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleModalClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (inputText) {
                handleSaveText();
                handleModalClose(); // Close the modal
              }
            }}
            disabled={!inputText} // Disable the button if the input field is not filled
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      {showModal && <div className={`modal-backdrop fade show`}></div>}
    </div>
  );
}

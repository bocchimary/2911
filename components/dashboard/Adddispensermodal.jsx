
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Disp from './dispenser';


function App() {
    const [ipAddress, setIpAddress] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [registeredUsers, setRegisteredUsers] = useState([]);
    const [ipError, setIpError] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [displayDisp, setDisplayDisp] = useState(true);
    const [dispenserData, setDispenserData] = useState({});
    const [dispImported, setDispImported] = useState(false);
    const [modal, setModal] = useState(false);
    const [ipandlocation, setipandlocation] = useState(false);
    const [checknullwc, setchecknull] = useState(false);
    const [enteredIpAddress, setEnteredIpAddress] = useState('');
    const [location, setLocation] = useState('');
    const [locationError, setLocationError] = useState('');


    const handleIpAddressChange = (e) => {
        const enteredIp = e.target.value;
        setIpAddress(enteredIp);

        const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

        if (!ipRegex.test(enteredIp)) {
            setIpError('Enter a valid IP address');
        } else {
            setIpError('');
        }
        const checkForDuplicateIP = async (ip) => {
            try {
              const response = await fetch('http://localhost:3001/checkDuplicate', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ip_address: ip }),
              });
          
              if (response.ok) {
                const data = await response.json();
                if (data.duplicate) {
                  setIpError('IP address already exists');
                } else {
                  setIpError('');
                }
                const enteredLocation = location;
                if (!enteredLocation.trim()) {
                    setLocationError('Enter a location');
                } else {
                    setLocationError('');
                }
              } else {
                console.error('Error checking IP existence:', response.statusText);
                setIpError('Error checking IP existence');
              }
            } catch (error) {
              console.error('Error checking IP existence:', error);
              setIpError('Error checking IP existence');
            }
          };
    };

    async function fetchData(cons,water) {
        try {
      
          // Make a POST request to the /checknull endpoint
          const response = await fetch('http://localhost:3000/checknull', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip_address: ip, water_level: water, consumed: cons }),
          });
      
          // Check if the response status is OK (200)
          if (response.ok) {
            // Parse the JSON response
            const data = await response.json();
      
            // Check if 'consumed' and 'water_level' are null in the response
            if (data.consumed === 'NULL' && data.water_level === 'NULL') {
              setchecknull(true);
            }
      
            // Log or process the data as needed
            console.log(data);
          } else {
            // If the response status is not OK, handle the error
            const errorData = await response.json();
            console.error('Error:', errorData.error);
          }
        } catch (error) {
          // Handle any errors that may occur during the fetch operation
          console.error('Fetch error:', error);
        }
      }


    
    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ip_address: ipAddress, location: location}),
            });
              if(ipAddress === '')
            setIPerror('Please answer the question')

            if (response.ok) {
                
                console.log('User registered successfully!');
                setRegisteredUsers([...registeredUsers, { ip: ipAddress, location: location }]);
               
                setIpAddress('');
                setLocation('');
                setModal(true);
                toggleModal();
                
            
                setRegistrationSuccess(true);
            } else {
                console.error('Error registering user.');
                setRegistrationSuccess(false);
                
            }
        } catch (error) {
            console.error('Error:', error);
            setRegistrationSuccess(false);
        }
    };
    

    



    



    const toggleModal = () => {
        setShowModal(!showModal);
        setRegistrationSuccess(false);
        setIpError('');
        
    };

    const customModalStyles = {
        content: {
            width: '27%',
            height: '50%',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'dirty white',
            border: '2px solid black',
        },
    };

    const ModalIPRegistered = {
        content: {
            width: '30%',
            height: '18%',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontWeight: 'Bold',
        },
    };

    const buttonAdd = (
        <button onClick={toggleModal} style={{fontWeight:'bold'}}>
            {showModal ? 'Close' : 'Add Water Dispenser'}
        </button>
    );
    
  
    return (

        
        <div className="App">
            <div>{buttonAdd}</div>
            <Modal
                isOpen={showModal}
                onRequestClose={toggleModal}
                contentLabel="Registration"
                style={customModalStyles}
            >
                <div>
                    <h5>Add Water Dispenser</h5>
                </div>
                
                <div >
                <label>Location: </label>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={{ display: 'flex', flexDirection: 'column' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label>
                        IP Address:
                        <input type="text" value={ipAddress} onChange={handleIpAddressChange} style={{ display: 'flex', flexDirection: 'column' }} />
                    </label>
                    {ipError && <p style={{ color: ipError === 'IP is Valid' ? 'blue' : 'red' }}>{ipError}</p>}

                </div>
                {registrationSuccess && (
    <div style={{ color: 'green', textAlign: 'center' }}>
        Registered successfully!
    </div>
)}
                <div style={{ alignSelf: 'flex-end' }}>
                <button onClick={async () => { await handleSubmit(); await fetchData(); }} disabled={!!ipError}>
                        Register
                    </button>
                </div>
                <button style={{ position: 'absolute', top: '10px', right: '10px' }} onClick={toggleModal}>
                    Close
                </button>
               
            </Modal>


{/*IP IS REGISTERED*/}
            <Modal
  isOpen={modal}
  onRequestClose={() => setModal(false)}
  contentLabel="IP Registered"
  style={ModalIPRegistered}
>
  <div style={{ textAlign: 'center' }}>
    <p>IP successfully registered!</p>
    <button onClick={() => setModal(false)}>Close</button>
  </div>
</Modal>
{/*IP AND LOCATION NOT FOUND MODAL*/}
<Modal
  isOpen={ipandlocation}
  onRequestClose={() => setipandlocation(false)}
  contentLabel="IP and Location not Found"
  style={ModalIPRegistered}
>
  <div style={{ textAlign: 'center' }}>
    <p>NOT FOUND!</p>
    <button onClick={() => setipandlocation(false)}>Close</button>
  </div>
</Modal>
{/*MODAL for consumed and water-level*/}
<Modal
  isOpen={checknullwc}
  onRequestClose={() => setchecknull(false)}
  contentLabel="not Found"
  style={ModalIPRegistered}
>
  <div style={{ textAlign: 'center' }}>
    <p>NOT FOUND!</p>
    <button onClick={() => setchecknull(false)}>Close</button>
  </div>
</Modal>
        </div>
       
    );

    
}

export default App;
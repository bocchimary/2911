import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from '../styles/Home.module.css';

const Disp = ({ data, onUpdate }) => {
  if (!data || (!Array.isArray(data) && !Array.isArray(data.data))) {
    // Handle the case where data is not an array (you might want to customize this based on your requirements)
    return <p>No data available</p>;

    
  
  }

  const calculateRemainingRefills = (totalRefills, consumedRefills) => {
    return totalRefills - consumedRefills;
  };

  

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const updatedData = Array.isArray(data)
        ? data.filter((item) => item.id !== id)
        : data.data.filter((item) => item.id !== id);
  
      setData(updatedData);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  const handleEdit = (id) => {
    const newLocation = window.prompt('Enter new location:');
    const newIpAddress = window.prompt('Enter new IP address:');

    // Check if both location and IP address are provided
    if (newLocation && newIpAddress) {
      onUpdate(id, newLocation, newIpAddress);
    }
  };

  const calculateFontSize = (textLength) => {
    // You can adjust the logic based on your requirements
    if (textLength > 20) {
      return '16px'; // or any other smaller font size
    } else {
      return '20px'; // default font size
    }
  };

  

  const dataArray = Array.isArray(data) ? data : data.data;

 return (
    <div className=" col-md-11 p-1 mt-3 me-3 mb-3">
      <div> 
      <div className="row row-cols-1  align-items-center">
        {dataArray.map((value) => (
          <div className="col-lg-4 c sm-5 ol-md-6 mb-5 align-items-center" key={value.id}>
            <div className="card" style={{border: '3px solid black', backgroundColor:'#d9d9d9',fontFamily:'Arial'}}>
            <h5
  className="card-title"
  style={{
    backgroundColor: "#565151",
    color: "white",
    width: "100%",
    height: "20%",
    marginTop: "10%",
    padding: "10px 10px",
    textAlign: "center",
    fontSize: calculateFontSize(value.location.length), // Correct placement
  }}
>
  {value.location}
</h5>

              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                
                <div style={{textAlign:"center", fontWeight:'bold', display: 'flex-start'}}>
                  <h4 style={{marginBottom:'20px'}}>STATUS</h4>{" "} </div>
                  <span id="status"></span>
                  <div className="d-flex justify-content-between mt-1" styles={{ clear:'inline-end'}}>
                  
                    <h5>HIGH</h5> 
                    {/* Indicator for HIGH data */}
                   {/* <div style={{ backgroundColor: value.water_level === "HIGH" ? "green" : "transparent", width: "30px", height: "25px", borderRadius: "50%", border: "2px solid darkgreen", display: "flex" }}></div> */}
                  
                   <img 
  src={value.water_level === "HIGH" ? "/HIGH_GALLON.png" : "/NO_GALLON.png"} // Adjust the path and filename based on your data structure
  alt="H" // Provide an appropriate alt text
  style={{ width: "50px", height: "60px" , marginTop:'-5%', marginRight:'20px',  display: 'block'}} // Adjust the style as needed
/>

                    <h5>LOW</h5>
                    <img 
  src={value.water_level === "LOW" ? "/LOW_GALLON.png" : "/NO_GALLON.png"} // Adjust the path and filename based on your data structure
  alt="H" // Provide an appropriate alt text
  style={{ width: "50px", height: "60px" , marginTop:'-5%', marginRight:'20px', display: 'block'}} // Adjust the style as needed
/>
                    {/* Indicator for LOW data */}
                    {/*<div style={{ backgroundColor: value.water_level === "LOW" ? "red" : "transparent", width: "30px", height: "25px", borderRadius: "50%", border: "2px solid darkred",display: "flex" }}></div> */}
                  </div>
            
              
              
      
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

const Home = () => {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalConsumed, setTotalConsumed] = useState(0);

  const fetchData = () => {
    fetch("http://localhost:3002/stuffs")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        return res.json();
      })
      .then((responseData) => {
        if (responseData && (Array.isArray(responseData) || Array.isArray(responseData.data))) {
          setData(responseData);
          // Calculate total consumed data
          const newTotalConsumed = responseData.reduce((acc, value) => acc + value.consumed, 0);
          setTotalConsumed(newTotalConsumed);
  
          // Store total consumed data
          storeTotalConsumed(newTotalConsumed);
  
          setLoading(false);
        } else {
          throw new Error("Invalid data format");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error.message);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      });
  };
  
  const updateData = async (id, newLocation, newIpAddress) => {
    try {
      await fetch(`http://localhost:3001/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location: newLocation, ip_address: newIpAddress }),
      });

      // Update local data after successful update
      const updatedData = data.map((item) => (item.id === id ? { ...item, location: newLocation, ip_address: newIpAddress } : item));
      setData(updatedData);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  const storeTotalConsumed = async (totalConsumed) => {
    try {
      await fetch("http://localhost:3001/storeTotalConsumed", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ totalConsumed }),
      });
      console.log('Total consumed data stored successfully.');
    } catch (error) {
      console.error('Error storing total consumed data:', error);
    }
  };
  

  useEffect(() => {
    fetchData(); // Initial data fetch

    // Set up an interval to fetch updated data every 5 seconds (adjust the interval as needed)
    const intervalId = setInterval(() => {
      fetchData();
    }, 5000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
 
      <div className="row">
        <div className="col-lg-6 col-md-12">
          {/* Add content for the left column if needed */}
        </div>
        <Disp data={data} onUpdate={updateData} /> {/* Pass the onUpdate prop */}
        {/* Display total consumed data outside the Disp component */}
        <div className="col-lg-6 col-md-12">
      

        </div>
      </div>
    </div>
  );
};

export default Home; 
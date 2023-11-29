import React, { useState, useEffect } from 'react';
import Inv from '../../components/dashboard/inventory';


const LogsConsumedComponent = () => {
  const [logsConsumedData, setLogsConsumedData] = useState(null);


  useEffect(() => {
    // Fetch all data from logs_consumed from the server
    const fetchLogsConsumedData = async () => {
      try {
        const response = await fetch('http://localhost:3001/getAllLogsConsumed');
        const data = await response.json();

        if (response.ok) {
          setLogsConsumedData(data);
        } else {
          console.error('Error fetching logs_consumed data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching logs_consumed data:', error);
      }
    };

    fetchLogsConsumedData();
  }, []); // Run once on component mount

  const handleAddContainer = async () => {
    try {
      const response = await fetch('http://localhost:3001/updateLogsConsumed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          containerNumber: newContainerNumber,
          startingInteger: newStartingInteger,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLogsConsumedData(data);
        setNewContainerNumber('');
        setNewStartingInteger('');
      } else {
        console.error('Error updating logs consumed:', data.error);
      }
    } catch (error) {
      console.error('Error updating logs consumed:', error);
    }
  };

  return (
    <div>
      <h2>Refill logs</h2>
      <div>
        
      {logsConsumedData !== null && logsConsumedData.length > 0 ? (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {Object.keys(logsConsumedData[0]).map((key) => (
                <th key={key} style={{ border: '1px solid #ddd', padding: '8px' }}>
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logsConsumedData.map((log, index) => (
              <tr key={index}>
                {Object.values(log).map((value) => (
                  <td key={value} style={{ border: '1px solid #ddd', padding: '8px' }}>
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
      <div>
        <Inv />
      </div>
    </div>
    </div>
  );
};

export default LogsConsumedComponent;
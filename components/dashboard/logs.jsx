import React, { useState, useEffect } from 'react';
import Inv from './inventory';
import styles from '../styles/bg.module.css';

const LogsConsumedComponent = () => {
  const [logsConsumedData, setLogsConsumedData] = useState(null);

  useEffect(() => {
    // Fetch all data from logs_consumed except id from the server
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

  return (
    <div className={styles.gradientBackgroundForAdmin}>
    <div className='container-fluid mt-4'>
      <h2>Refill logs</h2>
      {logsConsumedData !== null ? (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              {Object.keys(logsConsumedData).map(key => (
                <th key={key} style={{ border: '1px solid #ddd', padding: '8px' }}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {Object.values(logsConsumedData).map(value => (
                <td key={value} style={{ border: '1px solid #ddd', padding: '8px' }}>{value}</td>
              ))}
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
      <div><Inv/></div>
    </div>
    </div>
  );
};

export default LogsConsumedComponent;
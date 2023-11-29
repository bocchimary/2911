import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Dashboard from '../../components/dashboard/admin';
import styles from '../../components/styles/Home.module.css';

const AdminDashboard = () => {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <Navbar />
      <div style={{ background: 'linear-gradient(to bottom, #D61E1E, #ff9999)',   border: '2px solid black' }} >
      <div className = {styles.movingText} style={{ width:'100vh'
     }}>
  <h3>Welcome to the Admin Dashboard!</h3>
</div>
</div>
      
      <Dashboard user={{ role: 'admin' }}/>
     
    </div>
  );
};


export default AdminDashboard;

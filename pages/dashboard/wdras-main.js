import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Dashboard from '../../components/dashboard/students';

const studentsDashboard = () => {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>WDRAS Students</title>
      </Head>
      <Navbar />
      
      <Dashboard user={{ role: 'student' }}/>
     
    </div>
  );
};


export default studentsDashboard ;

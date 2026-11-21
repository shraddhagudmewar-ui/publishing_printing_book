import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F7FB] text-[#1B2430]">
      <Navbar />
      <main className="grow pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

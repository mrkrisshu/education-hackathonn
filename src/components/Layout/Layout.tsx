import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  return (
    <div className="relative min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <motion.main 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 pt-16 md:pl-64"
        >
          <div className="container mx-auto p-4 md:p-8">
            <Outlet />
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Layout;
// src/pages/MainLayout.js
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="d-flex">
      <Sidebar onSelect={(name) => console.log(`${name} selected`)} />
      <div className="flex-grow-1 p-4">
        <Header />
        <div className="content-area mt-4">
          <Outlet /> {/* Render the selected component here */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

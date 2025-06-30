"use client"

export const dynamic = 'force-dynamic'

import React from 'react';
import Sidebar from '../components/Sidebar'
import MainContent from '../components/MainContent'

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 lg:ml-60">
        <MainContent />
      </div>
    </div>
  )
}

export default DashboardPage;


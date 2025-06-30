import React from 'react';
import Sidebar from '../components/Sidebar';
import AccountContent from '../components/AccountContent';

const AccountPage = () => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <Sidebar />
      <div className="flex-1 lg:ml-60">
        <AccountContent />
      </div>
    </div>
  );
};

export default AccountPage; 
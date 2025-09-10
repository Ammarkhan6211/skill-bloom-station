import React, { useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { CompanyConnections } from '@/components/dashboard/CompanyConnections';
import { ScholarshipAdvisor } from '@/components/dashboard/ScholarshipAdvisor';
import { GamifiedLearning } from '@/components/dashboard/GamifiedLearning';
import { PersonalCounseling } from '@/components/dashboard/PersonalCounseling';
import { QuizTests } from '@/components/dashboard/QuizTests';
import { MentalHealth } from '@/components/dashboard/MentalHealth';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'companies':
        return <CompanyConnections />;
      case 'scholarships':
        return <ScholarshipAdvisor />;
      case 'learning':
        return <GamifiedLearning />;
      case 'counseling':
        return <PersonalCounseling />;
      case 'quiz':
        return <QuizTests />;
      case 'mental-health':
        return <MentalHealth />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
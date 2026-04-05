import React from 'react';
import CardWidget from '../components/common/CardWidget';
import PageContainer from '../layouts/ProLayout/PageContainer';

interface PlaceholderPageProps {
  title: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => (
  <PageContainer
    header={{
      title,
      breadcrumbs: [{ title: 'Home' }, { title }],
    }}
  >
    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <CardWidget>
        <div className="mb-1 text-gray-500">Total Users</div>
        <div className="text-2xl font-bold">1,234</div>
      </CardWidget>
      <CardWidget>
        <div className="mb-1 text-gray-500">Revenue</div>
        <div className="text-2xl font-bold">$12,345</div>
      </CardWidget>
      <CardWidget>
        <div className="mb-1 text-gray-500">Active Orders</div>
        <div className="text-2xl font-bold">45</div>
      </CardWidget>
      <CardWidget>
        <div className="mb-1 text-gray-500">Growth</div>
        <div className="text-2xl font-bold text-green-500">+12%</div>
      </CardWidget>
    </div>

    <CardWidget title="Content Area">
      <div className="flex h-64 items-center justify-center rounded border-2 border-dashed border-gray-100">
        <span className="text-gray-400">Content for {title} goes here</span>
      </div>
    </CardWidget>
  </PageContainer>
);


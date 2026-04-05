import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/public/PublicNavbar';
import PublicFooter from '../components/public/PublicFooter';
import '../pages/public/PublicPages.css';

const PublicLayout: FC = () => {
  return (
    <div className="public-site-shell">
      <PublicNavbar />
      <main className="public-main">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;

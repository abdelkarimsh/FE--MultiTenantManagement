import type { FC } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../branding/BrandLogo';
import { ROUTES } from '../../router/routes';

const PublicFooter: FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="public-footer">
      <div className="public-container public-footer-grid">
        <div className="public-footer-col">
          <Link className="public-footer-brand-link" to={ROUTES.root}>
            <BrandLogo variant="icon-text" size="sm" />
          </Link>
          <p className="public-footer-text">
            A practical platform to manage your products, orders, team, and daily store operations
            in one place.
          </p>
        </div>

        <div className="public-footer-col">
          <p className="public-footer-heading">Quick Links</p>
          <div className="public-footer-links">
            <Link to={ROUTES.root}>Home</Link>
            <Link to={ROUTES.about}>About</Link>
            <Link to={ROUTES.features}>Features</Link>
            <Link to={ROUTES.login}>Login</Link>
          </div>
        </div>
      </div>

      <div className="public-footer-copy">{'\u00A9'} {year} StoreFlow. All rights reserved.</div>
    </footer>
  );
};

export default PublicFooter;

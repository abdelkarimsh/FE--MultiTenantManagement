import { useState, type FC } from 'react';
import { Link, NavLink } from 'react-router-dom';
import BrandLogo from '../branding/BrandLogo';
import { ROUTES } from '../../router/routes';

const PublicNavbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="public-header">
      <div className="public-container public-header-inner">
        <Link className="public-brand" to={ROUTES.root} onClick={closeMenu}>
          <BrandLogo variant="icon-text" size="md" />
        </Link>

        <button
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          className="public-menu-toggle"
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`public-nav${isMenuOpen ? ' open' : ''}`}>
          <NavLink
            className={({ isActive }) => `public-nav-link${isActive ? ' active' : ''}`}
            to={ROUTES.root}
            end
            onClick={closeMenu}
          >
            Home
          </NavLink>
          <NavLink
            className={({ isActive }) => `public-nav-link${isActive ? ' active' : ''}`}
            to={ROUTES.about}
            onClick={closeMenu}
          >
            About
          </NavLink>
          <NavLink
            className={({ isActive }) => `public-nav-link${isActive ? ' active' : ''}`}
            to={ROUTES.features}
            onClick={closeMenu}
          >
            Features
          </NavLink>
          <Link className="public-login-link" to={ROUTES.login} onClick={closeMenu}>
            Login
          </Link>
          <Link className="public-btn public-btn-primary public-nav-cta" to={ROUTES.login} onClick={closeMenu}>
            Start Free
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default PublicNavbar;

import type { FC } from 'react';
import BrandLogo from '../../components/branding/BrandLogo';
import CTASection from '../../components/public/CTASection';
import FeatureCard from '../../components/public/FeatureCard';
import SectionWrapper from '../../components/public/SectionWrapper';
import { ROUTES } from '../../router/routes';

const manageItems = [
  {
    icon: 'P',
    title: 'Products',
    description: 'Keep your product catalog clear, updated, and easy to manage every day.',
  },
  {
    icon: 'O',
    title: 'Orders',
    description: 'Track incoming orders, follow progress, and keep your workflow on schedule.',
  },
  {
    icon: 'T',
    title: 'Team',
    description: 'Support your staff with a shared workspace and clear day-to-day responsibilities.',
  },
  {
    icon: 'D',
    title: 'Daily Operations',
    description: 'Stay organized with one place to manage routine tasks and store activity.',
  },
];

const focusPoints = [
  {
    icon: 'S',
    title: 'Simplicity',
    description: 'Clear screens and practical workflows your team can use quickly.',
  },
  {
    icon: 'P',
    title: 'Performance',
    description: 'Fast and smooth interactions that support busy store operations.',
  },
  {
    icon: 'R',
    title: 'Reliability',
    description: 'Dependable daily usage for product, order, and team management.',
  },
  {
    icon: 'B',
    title: 'Real business needs',
    description: 'Built around what store owners and teams actually need to do each day.',
  },
];

const AboutPage: FC = () => {
  return (
    <>
      <section className="public-page-header about-hero">
        <div className="public-container about-hero-grid">
          <div className="about-hero-content">
            <p className="public-eyebrow">About</p>
            <h1>Built to Simplify Store Management</h1>
            <p>
              We help store owners manage products, track orders, organize teams, and run daily
              operations from one simple platform.
            </p>
            <p>
              Our goal is to make store work feel clear and organized so teams can focus on growth
              instead of manual coordination.
            </p>
          </div>

          <aside className="about-hero-panel" aria-label="Platform highlights">
            <div className="about-panel-brand">
              <BrandLogo variant="full" size="md" />
            </div>
            <p className="about-panel-title">What You Get</p>
            <ul className="about-panel-list">
              <li>One workspace for products, orders, and team tasks</li>
              <li>Clear visibility into daily store activity</li>
              <li>Simple workflows that reduce manual follow-up</li>
            </ul>
          </aside>
        </div>
      </section>

      <SectionWrapper
        title="What We Help You Manage"
        subtitle="Everything your store needs in one organized workflow."
      >
        <div className="public-grid public-grid-4">
          {manageItems.map((item) => (
            <FeatureCard
              key={item.title}
              icon={<span>{item.icon}</span>}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper
        muted
        title="Our Mission"
        subtitle="Our mission is to simplify store management and help businesses run their operations smoothly using one unified platform."
      >
        <div className="about-mission-highlight">
          <p>
            We designed this platform so store teams can move faster, stay aligned, and keep
            everyday operations organized without unnecessary complexity.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper title="Why We Built This Platform">
        <div className="about-why-grid">
          <div className="about-why-text">
            <p className="public-paragraph">
              Store owners often deal with scattered tools, manual work, and unclear processes.
            </p>
            <p className="public-paragraph">
              We built this platform to bring products, orders, and team operations into one
              organized and easy-to-use experience.
            </p>
          </div>
          <div className="about-why-cards">
            <div className="about-mini-card">
              <p>Before</p>
              <strong>Scattered tools and repetitive manual steps</strong>
            </div>
            <div className="about-mini-card">
              <p>After</p>
              <strong>One clear workflow for day-to-day store work</strong>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper muted title="What We Focus On">
        <div className="public-grid public-grid-2">
          {focusPoints.map((item) => (
            <FeatureCard
              key={item.title}
              icon={<span>{item.icon}</span>}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
      </SectionWrapper>

      <CTASection
        title="Start Managing Your Store with More Clarity"
        description="Bring your products, orders, and team together in one platform designed to keep your business organized."
        primaryLabel="Get Started"
        primaryTo={ROUTES.login}
        secondaryLabel="Explore Features"
        secondaryTo={ROUTES.features}
      />
    </>
  );
};

export default AboutPage;

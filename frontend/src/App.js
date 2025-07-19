import React from 'react';
import {
  Page,
  Masthead,
  MastheadToggle,
  MastheadMain,
  MastheadBrand,
  MastheadContent,
  PageSidebar,
  PageSidebarBody,
  PageSection,
  Nav,
  NavItem,
  NavList,
  Button,
  Brand
} from '@patternfly/react-core';
import { CogIcon, DatabaseIcon, BarsIcon } from '@patternfly/react-icons';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [activeItem, setActiveItem] = React.useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const onSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const Header = (
    <Masthead>
      <MastheadToggle>
        <Button
          variant="plain"
          onClick={onSidebarToggle}
          aria-label="Global navigation"
        >
          <BarsIcon />
        </Button>
      </MastheadToggle>
      <MastheadMain>
        <MastheadBrand>
          <Brand 
            src={`${process.env.PUBLIC_URL}/logo192.png`} 
            alt="Real-time Log Viewer"
            style={{ height: '40px' }}
          />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Button variant="plain" aria-label="Settings">
          <CogIcon />
        </Button>
      </MastheadContent>
    </Masthead>
  );

  const Navigation = (
    <Nav onSelect={(result) => setActiveItem(result.itemId)}>
      <NavList>
        <NavItem
          key="dashboard"
          itemId="dashboard"
          isActive={activeItem === 'dashboard'}
        >
          <DatabaseIcon /> Dashboard
        </NavItem>
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar isSidebarOpen={isSidebarOpen}>
      <PageSidebarBody>
        {Navigation}
      </PageSidebarBody>
    </PageSidebar>
  );

  return (
    <Page header={Header} sidebar={Sidebar}>
      <PageSection>
        <Dashboard />
      </PageSection>
    </Page>
  );
}

export default App;

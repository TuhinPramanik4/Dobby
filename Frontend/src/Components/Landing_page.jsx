import React from 'react';
import { Outlet } from 'react-router-dom';
import Landing_Page_Home from './Landing_Page_Home';
import Landing_about from './Landing_about';

function Landing_page() {
  return (
    <>
      <Landing_Page_Home />
      <Landing_about />

      {/* Nested child routes will be rendered here */}
      <Outlet />
    </>
  );
}

export default Landing_page;

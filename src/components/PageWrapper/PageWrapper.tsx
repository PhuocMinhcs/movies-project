import React from "react";
import { Outlet } from "react-router-dom";
import "./PageWrapper.scss";

const PageWrapper: React.FC = () => {
  return (
    <div className="page-wrapper">
      <header>
        <h1>Movies Project</h1>
      </header>

      <section>
        <Outlet />
      </section>

      {/* <footer>this is a footer</footer> */}
    </div>
  );
};

export default PageWrapper;

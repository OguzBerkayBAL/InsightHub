import React from "react";
import Footer from "../components/Layout/Footer/Footer";
import Header from "../components/Layout/Header/Header";
import { useI18n } from "../hooks/useI18n";
import Proptypes from "prop-types";

const MainLayout = ({ children }) => {
  // Global dil yönetimi - tüm sayfalarda çalışır
  useI18n();

  return (
    <React.Fragment>
      <Header />
      {children}
      <Footer />
    </React.Fragment>
  );
};
export default MainLayout;
MainLayout.propTypes = {
  children: Proptypes.node,
};
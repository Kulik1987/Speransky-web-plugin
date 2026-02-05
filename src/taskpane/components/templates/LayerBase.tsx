import React from "react";
import { Outlet } from "react-router-dom";
import { Breadcrumb, HeaderMenu, SelectionLang } from "../widgets";
import { useCommonStyles } from "../../theme/commonStyles";

const LayerBase = () => {
  const commonStyles = useCommonStyles();

  return (
    <div>
      <HeaderMenu />
      <div className={commonStyles.pageContainer}>
        <div>
          <Breadcrumb />
          <div className={commonStyles.outletContainer}>
            <Outlet />
          </div>
        </div>
        <SelectionLang />
      </div>
    </div>
  );
};

export default LayerBase;

import React from "react";
import { Outlet } from "react-router-dom";
import { HeaderMenu, SelectionLang } from "../widgets";
import { useCommonStyles } from "../../theme/commonStyles";

const LayerBase = () => {
  const commonStyles = useCommonStyles();

  return (
    <div>
      <HeaderMenu />
      <div className={commonStyles.pageContainer}>
        <HeaderMenu />
        <div className={commonStyles.outletContainer}>
          <Outlet />
        </div>
        <SelectionLang />
      </div>
    </div>
  );
};

export default LayerBase;

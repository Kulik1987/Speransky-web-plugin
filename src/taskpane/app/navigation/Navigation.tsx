import React from "react";
import { Main, Draft, Review, Summary } from "../../pages";
import { LayerBase } from "../../components/templates";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../AuthProvider";
import { RoutePathEnum } from "../../enums";
import { ReviewTypeGeneral } from "../../pages/review/reviewTypeGeneral";
import { ReviewTypeCustom } from "../../pages/review/reviewTypeCustom";

const Navigation: React.FC = () => {
  return (
    <MemoryRouter initialEntries={[RoutePathEnum.ROOT]} initialIndex={0}>
      <Routes>
        <Route element={<LayerBase />}>
          <Route element={<AuthProvider />}>
            <Route index element={<Main />} />
            <Route path={RoutePathEnum.DRAFT} element={<Draft />} />
            <Route path={RoutePathEnum.REVIEW}>
              <Route index element={<Review />} />
              <Route path={RoutePathEnum.REVIEW_GENERAL} element={<ReviewTypeGeneral />} />
              <Route path={RoutePathEnum.REVIEW_CUSTOM} element={<ReviewTypeCustom />} />
            </Route>
            <Route path={RoutePathEnum.SUMMARY} element={<Summary />} />
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

export default Navigation;

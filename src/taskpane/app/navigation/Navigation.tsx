import React from "react";
import { Main, Draft, Review, Summary, Checklist } from "../../pages";
import { LayerBase } from "../../components/templates";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../AuthProvider";
import { RoutePathEnum } from "../../enums";
import { ReviewType } from "../../pages/review/reviewType";

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
              <Route path={RoutePathEnum.REVIEW_TYPE} element={<ReviewType />} />
            </Route>
            <Route path={RoutePathEnum.CHECKLIST} element={<Checklist />} />
            <Route path={RoutePathEnum.SUMMARY} element={<Summary />} />
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

export default Navigation;

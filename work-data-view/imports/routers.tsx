import AppgrowingPrelandingPages from "/imports/pages/Appgrowing/AppgrowingPrelandingPages";
import AppgrowingReservationPage from "/imports/pages/Appgrowing/AppgrowingReservationPage";
import DeveloperRankPage from "/imports/pages/Appgrowing/DeveloperRankPage";
import OperationPage from "/imports/pages/operation/OperationPage";
import React from 'react';
import Home from "/imports/pages/Home";

import Job51Companies from "/imports/pages/Job51/Job51Companies";
import LiepinCompanies from "/imports/pages/Liepin/LiepinCompanies";
export const routes = [
  {
    path: "/",
    element: <Home/>,
    title: "Homee"
  },
  {
    path: "/Job51Companies",
    element: <Job51Companies/>,
    title: "Job51-Companies"
  },
  {
    path: "/LiepinCompanies",
    element: <LiepinCompanies/>,
    title: "Liepin Companies"
  },
  {
    path: "/Appgrowing/DeveloperRankPage",
    element: <DeveloperRankPage/>,
    title: "Appgrowing - DeveloperRank"
  },
  {
    path: "/Appgrowing/AppgrowingReservationPage",
    element: <AppgrowingReservationPage/>,
    title: "Appgrowing - Reservation"
  },
  {
    path: "/Appgrowing/AppgrowingPrelandPages",
    element: <AppgrowingPrelandingPages/>,
    title: "Appgrowing - relandPages"
  },

  {
    path: "/Operation",
    element: <OperationPage/>,
    title: "Operations"
  },
]

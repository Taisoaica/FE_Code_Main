import HomePage from "../pages/HomePage/HomePage";
import BookingPage from "../pages/Booking/BookingPage";
import ClinicDetail from "../pages/ClinicDetail/ClinicDetail";
import ClinicRegister from "../pages/ClinicRegister/ClinicRegister";


import ErrorPage from "../pages/ErrorPage/ErrorPage";

import ForOwner from "../pages/ForOwner/ForOwner";


//------------------- User V2 -------------------
import UserProfilePage from "../pages/UserV2/UserProfilePage";
//------------------- User V2 -------------------

export const UserRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/booking", element: <BookingPage /> },
  { path: '/for-owner', element: <ForOwner /> },
  { path: '/for-owner/clinic-register', element: <ClinicRegister /> },
  { path: "/clinic", element: <ClinicDetail /> },
  { path: "/userV2", element: <UserProfilePage /> },
  { path: "/error", element: <ErrorPage /> },
];

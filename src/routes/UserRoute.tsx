import HomePage from "../pages/HomePage/HomePage";
import BookingPage from "../pages/Booking/BookingPage";
// import UserScheduleMain from "../pages/User/WithWrapper/UserScheduleMain";
// import UserPaymentMain from "../pages/User/WithWrapper/UserPaymentMain";
// import UserAccountMain from "../pages/User/WithWrapper/UserAccountMain";
// import UserProfileMain from "../pages/User/WithWrapper/UserProfileMain";
import ClinicDetail from "../pages/ClinicDetail/ClinicDetail";
import ClinicRegister from "../pages/ClinicRegister/ClinicRegister";


import ErrorPage from "../pages/ErrorPage/ErrorPage";

import ForOwner from "../pages/ForOwner/ForOwner";


//------------------- User V2 -------------------
import UserProfilePage from "../pages/UserV2/UserProfilePage";
import SlotRegister from "../pages/Admin/AdminClinicOwner/pages/SlotRegister";
import ServicesInformation from "../pages/Admin/AdminClinicOwner/pages/ServicesInformation";
//------------------- User V2 -------------------

export const UserRoutes = [
  { path: "/", element: <HomePage /> },
  { path: "/booking", element: <BookingPage /> },
  { path: '/for-owner', element: <ForOwner /> },
  { path: '/for-owner/clinic-register', element: <ClinicRegister /> },
  { path: "/clinic", element: <ClinicDetail /> },
  { path: "/userV2", element: <UserProfilePage /> },
  // { path: "/user/", element: <UserScheduleMain /> },
  // { path: "/user/payment", element: <UserPaymentMain /> },
  // { path: "/user/profile", element: <UserProfileMain /> },
  // { path: "/user/account", element: <UserAccountMain /> },
  
  { path: "/error", element: <ErrorPage /> },
];

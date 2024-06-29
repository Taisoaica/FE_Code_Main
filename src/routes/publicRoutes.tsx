import HomePage from '../pages/HomePage/HomePage';
import BookingPage from '../pages/Booking/BookingPage';
import ClinicRegisterForm from '../pages/ClinicRegister/ClinicRegister';
// import UserPayment from '../pages/User/Payment/UserPayment';
// import UserAccount from '../pages/User/Account/UserAccount';
// import UserProfile from '../pages/User/Profile/UserProfile';
import AdminClinicPage from '../pages/Admin/AdminClinicOwner/AdminClinicPage';
import AppointmentSchedule from '../pages/Admin/AdminClinicOwner/pages/AppointmentSchedule';
import ClinicInformation from '../pages/Admin/AdminClinicOwner/pages/ClinicInformation';
import LoginMUI from '../pages/Login/index';
import SignUpMUI from '../pages/Login/SignUpMUI';
import ClinicDetail from '../pages/ClinicDetail/ClinicDetail';
import ClinicList from '../pages/ClinicList/ClinicList';
import Chat from '../pages/ChatV1/Chat';
import ErrorPage from '../pages/ErrorPage/ErrorPage';
import SuccessPage from '../pages/SuccessPage/SuccessPage';
import ForOwner from '../pages/ForOwner/ForOwner';
import Guide from '../pages/Guide/Guide';


export const publicRoutes = [
    { path: '/', element: <HomePage /> },
    { path: '/booking/:clinicId', element: <BookingPage /> },
    { path: '/for-owner', element: <ForOwner /> },
    { path: '/for-owner/clinic-register', element: <ClinicRegisterForm /> },
    { path: "/clinic/:id", element: <ClinicDetail /> },
    { path: '/clinics', element: <ClinicList /> },
    { path: "/login", element: < LoginMUI /> },
    { path: "/signup", element: <SignUpMUI /> },
    { path: "/error404", element: <ErrorPage /> },
    { path: "/success", element: <SuccessPage /> },
    { path: "/chat", element: <Chat /> },
    { path: "/guide", element: <Guide /> },

    //{ path: "/login-google", element: <GoogleLogin />,
    // { path: "/user/payment", element: <UserPayment /> },
    // { path: "/user/profile", element: <UserProfile /> },
    // { path: "/user/account", element: <UserAccount /> },
    { path: '/admin/clinic-owner', element: <AdminClinicPage /> },
    { path: '/admin/clinic-owner/appointment', element: <AppointmentSchedule /> },
    { path: '/admin/clinic-owner/clinic', element: <ClinicInformation /> },
]
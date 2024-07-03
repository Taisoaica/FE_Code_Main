import AdminClinicPage from '../pages/Admin/AdminClinicOwner/AdminClinicPage';
import AppointmentSchedule from '../pages/Admin/AdminClinicOwner/pages/AppointmentSchedule';
import ClinicInformation from '../pages/Admin/AdminClinicOwner/pages/ClinicInformation';
import ServicesInformation from '../pages/Admin/AdminClinicOwner/pages/ServicesInformation';
import SlotRegister from '../pages/Admin/AdminClinicOwner/pages/SlotRegister';
import ClinicManagement from '../pages/Admin/AdminSystem/pages/ClinicManagement';
// import ClinicSystemDetail from '../pages/Admin/AdminSystem/pages/ClinicSystemDetail';
import UserManagement from '../pages/Admin/AdminSystem/pages/UserManagement';
import DentistAppointmentManager from '../pages/Admin/Dentist/pages/DentistAppointmentManager';
import ClinicServices from '../pages/Admin/AdminSystem/pages/ClinicServices';
import ClinicDetail from '../pages/Admin/AdminSystem/pages/ClinicDetail';
import CustomerManagement from '../pages/Admin/AdminSystem/pages/CustomerManagement';
import DentistManagement from '../pages/Admin/AdminSystem/pages/DentistManagement';
import ServiceDetail from '../pages/Admin/AdminClinicOwner/pages/ServiceDetail';
import DentistList from '../pages/Admin/AdminClinicOwner/pages/DentistList';
// import ImagePage from '../pages/Admin/AdminClinicOwner/pages/ImagesPage';

const adminRoutes = [
    { path: '/admin/clinic-owner', element: <AdminClinicPage /> },
    { path: '/admin/clinic-owner/appointment', element: <AppointmentSchedule /> },
    { path: '/admin/clinic-owner/clinic', element: <ClinicInformation /> },
    { path: "/admin/clinic-owner", element: <AdminClinicPage /> },
    { path: "/admin/clinic-owner/appointment", element: <AppointmentSchedule /> },
    { path: "/admin/clinic-owner/clinic", element: <ClinicInformation /> },
    { path: "/admin/clinic-owner/clinic/dentist", element: <DentistList /> },
    { path: "/admin/clinic-owner/slots", element: <SlotRegister /> },
    { path: "/admin/clinic-owner/services", element: <ServicesInformation /> },
    { path: "/admin/clinic-owner/services/:id", element: <ServiceDetail /> },
    { path: '/dentist', element: <DentistAppointmentManager /> },
    // { path: '/dentist/scheduler', element: <AppointmentScheduler /> },
    { path: '/system-admin', element: <UserManagement /> },
    { path: '/system-admin/patient', element: <CustomerManagement /> },
    { path: '/system-admin/dentist', element: <DentistManagement /> },
    { path: '/system-admin/clinic', element: <ClinicManagement /> },
    { path: '/system-admin/clinic/:id', element: <ClinicDetail /> },
    { path: "/system-admin/service", element: <ClinicServices /> }
]

export default adminRoutes;
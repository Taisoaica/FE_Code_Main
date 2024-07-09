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
import { all } from 'axios';
// import ImagePage from '../pages/Admin/AdminClinicOwner/pages/ImagesPage';

const adminRoutes = [
    { path: '/admin/clinic-owner', element: <AdminClinicPage />, allowedRoles: [ 'Dentist']  },
    { path: '/admin/clinic-owner/appointment', element: <AppointmentSchedule />, allowedRoles: [ 'Dentist']  },
    { path: '/admin/clinic-owner/clinic', element: <ClinicInformation />, allowedRoles: ['Dentist']},
    { path: "/admin/clinic-owner", element: <AdminClinicPage />, allowedRoles: ['Dentist']  },
    { path: "/admin/clinic-owner/appointment", element: <AppointmentSchedule /> , allowedRoles: ['Dentist'] },
    { path: "/admin/clinic-owner/clinic", element: <ClinicInformation /> , allowedRoles: ['Dentist'] },
    { path: "/admin/clinic-owner/clinic/dentist", element: <DentistList /> , allowedRoles: ['Dentist'] },
    { path: "/admin/clinic-owner/slots", element: <SlotRegister /> , allowedRoles: ['Dentist'] },
    { path: "/admin/clinic-owner/services", element: <ServicesInformation /> , allowedRoles: ['Dentist'] },
    { path: "/admin/clinic-owner/services/:id", element: <ServiceDetail /> , allowedRoles: ['Dentist'] },

    // { path: '/dentist/scheduler', element: <AppointmentScheduler /> },
    { path: '/dentist', element: <DentistAppointmentManager /> , allowedRoles: ['Dentist'] },
    
    { path: '/system-admin', element: <UserManagement /> , allowedRoles: ['Admin'] },
    { path: '/system-admin/patient', element: <CustomerManagement /> , allowedRoles: ['Admin'] },
    { path: '/system-admin/dentist', element: <DentistManagement /> , allowedRoles: ['Admin'] },
    { path: '/system-admin/clinic', element: <ClinicManagement /> , allowedRoles: ['Admin']},
    { path: '/system-admin/clinic/:id', element: <ClinicDetail /> , allowedRoles: ['Admin']},
    { path: "/system-admin/service", element: <ClinicServices /> , allowedRoles: ['Admin']}
]

export default adminRoutes;
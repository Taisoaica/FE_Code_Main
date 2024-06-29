export const connection_path = {
    base_url: "https://localhost:7163/api",
    endpoints: {

    },

    auth: {
        login: "/auth/login",
        logout: "/auth/logout",
        checkAuth: "/auth/validate",
        googleAuth: "/auth/google",
    },


    user: {
        customer: "/customer",
        customer_update: "/customer",
        customer_register: "/customer/register",
        activate_user: "/user/activate/:id",
        inactivate_user: "/user/inactivate/:id",
        clinic_register: "/clinic/register",
    },

    invoker: {
        get_dentist_invoker: "/dentist",
    },

    clinic: {
        register_clinic_owner: "/clinic/register/clinic-owner",
        get_clinic_general_info: "/clinic/",
        get_all_clinic: "/clinic/search",
        get_clinic_service: "/services",
        post_clinic_schedule: "/schedule/slot/create",
        post_clinic_schedule_status: "/schedule/slot/:id/",
        get_clinic_schedule: "/schedule/:id/slots",
        put_clinic_schedule: "/schedule/slot/update",
        get_clinic_staff: "/booking/available/:id/dentist",
        post_clinic_service: "/services",
    },

    booking: {
        get_clinic_booking: '/booking/clinic/:id',
        available_date: '/booking/availabe-date',
        available_slot: '/booking/availabe-slot',
        check_available_dentist: '/booking/available/:id/dentist',
        place_book: '/booking/customer/book',
        get_booking: '/booking/schedule/staff',
        get_cus_booking: '/booking/schedule/customer'
    },

    admin: {
        register_service: '/admin/service/categories',
        get_clinics: '/admin/clinics',
        get_users: '/admin/users',
        verify_clinic: '/admin/clinic/verify/:id',
    },


    admin_clinic_owner: {
        homepage: "/admin/clinic-owner",
        clinic: "/admin/clinic-owner/clinic",
        dentist: "/admin/clinic-owner/dentist",
        appointment: "/admin/clinic-owner/appointment",
    },

    dentist: {
        schedule: "/dentist/dentist-schedule",
        patient_list: "/dentist/patient-list",
        chat: "/dentist/chat",
    },
}

export const google_auth = {
    client_id: "843209512674-7rck108lbhqbplg9hnc8f6u4s1fbmudu.apps.googleusercontent.com"
}

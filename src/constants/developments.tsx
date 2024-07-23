export const connection_path = {
    base_url: "https://localhost:7163/api",
    endpoints: {

    },

    auth: {
        login: "/auth/login",
        logout: "/auth/logout",
        checkAuth: "/auth/validate",
        googleAuth: "/auth/login-google",
        refresh: "/auth/refresh"
    },
    
    forgetpass: {
        request: "/user/password/request",
        token: "/user/password/check-token",
        reset: "/user/password/reset"
    },

    user: {
        customer: "/customer",
        customer_update: "/customer",
        customer_register: "/customer/register",
        activate_user: "/customer/activate",
        inactivate_user: "/user/inactivate",
        clinic_register: "/clinic/register",

    },

    invoker: {
        get_dentist_invoker: "/dentist",
        get_customer_invoker: "/customer",
        put_dentist: "/dentist",
    },

    clinic: {
        register_clinic: "/clinic/register",
        register_clinic_owner: "/clinic/register/clinic-owner",
        register_staff: "/dentist/staff/register",
        active_staff: "/dentist/staff/activate",
        deactive_staff: "/dentist/staff/deactivate",
        get_clinic_general_info: "/clinic/",
        put_clinic_general_info: "/clinic",
        get_all_clinic: "/clinic/search",
        get_clinic_staff: "/dentist/staff",
        get_clinic_service: "/service",
        put_clinic_service: "/service",
        enable_clinic_service: "/service/:id/activate",
        disable_clinic_service: "/service/:id/deactivate",
        post_clinic_schedule: "/schedule/slot/create",
        post_clinic_schedule_status: "/schedule/slot/:id/",
        get_clinic_schedule: "/schedule/:id/slots",
        put_clinic_schedule: "/schedule/slot/update",
        post_clinic_service: "/service",
        service_categories: "/service/categories",
        // service_categories: "admin/service/categories",
        service_category: "/service/category"
    },

    booking: {
        get_clinic_booking: '/booking/clinic/:id',
        get_customer_booking: '/booking/customer/:id',
        get_dentist_booking: '/booking/staff/:id',
        available_date: '/booking/availabe-date',
        available_slot: '/booking/availabe-slot',
        check_available_dentist: '/booking/available/:id/dentist',
        place_book: '/booking/customer/book',
        create_schedule: '/booking/staff/create-schedule',
        get_booking: '/booking/schedule/staff',
        get_cus_booking: '/booking/schedule/customer',
        create_payment: '/payment/vnpay',
        confirm_payment: '/payment/vnpay/success',
        get_customer_payment: '/payment/customer/',
        finish: '/finish',
        cancel: '/cancel',
    },

    admin: {
        register_service: '/admin/service/categories',
        get_clinics: '/admin/clinics',
        get_users: '/admin/users',
        get_dentists: '/admin/dentist',
        get_customer: '/admin/customer',
        get_verified_clinic: '/admin/verified-clinic',
        get_unverified_clinic: '/admin/unverified-clinic',
        verify_clinic: '/admin/clinic/verify',
        uverify_clinic: '/admin/clinic/unverify',
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

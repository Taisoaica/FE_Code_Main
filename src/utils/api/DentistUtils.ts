import axios, { AxiosRequestConfig } from "axios";
import { connection_path } from "../../constants/developments";
import { AppointmentViewModel, getDentistInfo } from "./ClinicOwnerUtils";

export const getDentistAppointmentsWithFilter = async (
    filter: 'this_week' | 'next_week' | 'next_month' | 'custom',
    from_date?: Date,
    to_date?: Date,
    from_time?: string,
    to_time?: string,
    requestOldItems = true,
    page_size = 10,
    page_index = 0
): Promise<AppointmentViewModel[]> => {
    const response = await getDentistInfo();
    let id;
    if (response) {
        id = response.dentistId;
    }

    const api_url = connection_path.base_url + connection_path.booking.get_dentist_booking.replace(':id', id);
    const accessToken = localStorage.getItem('accessToken');

    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    console.log(filter)

    if (filter === 'this_week') {
        fromDate = getStartOfWeek(new Date());
        toDate = getEndOfWeek(new Date());
    } else if (filter === 'next_week') {
        fromDate = getStartOfWeek(addDays(new Date(), 7));
        toDate = getEndOfWeek(addDays(new Date(), 7));
    } else if (filter === 'next_month') {
        fromDate = getStartOfMonth(addMonths(new Date(), 1));
        toDate = getEndOfMonth(addMonths(new Date(), 1));
    } else if (filter === 'custom' && from_date && to_date) {
        fromDate = from_date;
        toDate = to_date;
    } else {
        console.error('Invalid date range for custom filter');
        return [];
    }

    const configuration: AxiosRequestConfig = {
        method: 'GET',
        url: api_url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        params: {
            from_date: formatDate(fromDate),
            to_date: formatDate(toDate),
            from_time: from_time,
            to_time: to_time,
            requestOldItems: requestOldItems,
            page_size: page_size,
            page_index: page_index
        }
    }

    try {
        const response = await axios(configuration);
        if (response.status === 200) {
            const appointments: AppointmentViewModel[] = response.data.content;
            console.log(appointments);
            return appointments;
        } else {
            console.error('Failed to fetch clinic appointments:', response.data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching clinic appointments:', error);
        return [];
    }
}

function formatDate(date: Date | undefined): string | undefined {
    if (!date) {
        console.warn('Invalid date provided to formatDate');
        return undefined;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

function getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function getEndOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + 7;
    return new Date(d.setDate(diff));
}

function getStartOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getEndOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

export const getAllDentistAppointments = async (): Promise<AppointmentViewModel[]> => {
    const response = await getDentistInfo();
    let id;
    if (response) {
        id = response.dentistId;
    }

    const api_url = connection_path.base_url + connection_path.booking.get_dentist_booking.replace(':id', id);
    const accessToken = localStorage.getItem('accessToken');

    const configuration: AxiosRequestConfig = {
        method: 'GET',
        url: api_url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    }

    try {
        const response = await axios(configuration);
        if (response.status === 200) {
            const appointments: AppointmentViewModel[] = response.data.content;
            return appointments;
        } else {
            console.error('Failed to fetch clinic appointments:', response.data);
            return [];
        }
    } catch (error) {
        console.error('Error fetching clinic appointments:', error);
        return [];
    }
}

export const finishAppointment = async (appointmentId: string): Promise<any> => {
    const api_url = 'https://localhost:7163' + connection_path.booking.finish;
    const accessToken = localStorage.getItem('accessToken');

    const configuration: AxiosRequestConfig = {
        method: 'PUT',
        url: api_url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        params: {
            book_id: appointmentId,
        },
    };

    try {
        const response = await axios(configuration);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const noteAppointment = async (appointmentId: string, payload: string): Promise<any> => {
    const api_url = connection_path.base_url + '/booking/staff/note/' + `${appointmentId}`
    const accessToken = localStorage.getItem('accessToken')

    const config: AxiosRequestConfig = {
        method: 'PUT',
        url: api_url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        data: payload
    }

    try {
        const response = await axios(config);
        if (response.status === 200) { 
            alert('Note appointment successfully');
        } else {
            alert('Note appointment failed');
        }
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export const createRecurringAppointment = async (appointmentData, recurringSettings) => {
    const { MaxRecurring, TimeSpan, RepeatType } = recurringSettings;
    
    const apiUrl = `https://localhost:7163/api/booking/staff/create-schedule?MaxRecurring=${MaxRecurring}&TimeSpan=${TimeSpan}&RepeatType=${RepeatType}`;
  
    try {
      const response = await axios.post(apiUrl, appointmentData, {
        headers: {
          'accept': 'text/plain',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, 
          'Content-Type': 'application/json'
        }
      });
  
      if (response.status === 200) {
        console.log('Recurring appointment created successfully');
        return response.data;
      } else {
        throw new Error('Failed to create recurring appointment');
      }
    } catch (error) {
      console.error('Error creating recurring appointment:', error);
      throw error;
    }
  };
  
export const updateAccountInfo = async (payload) => { 
    const api_url = connection_path.base_url + connection_path.invoker.put_dentist;

    const config: AxiosRequestConfig = {
        method: 'PUT',
        url: api_url,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        data: payload
    }

    try {
        const response = await axios(config);
        if (response.status === 200) { 
            alert('Update account successfully');
        } else {
            alert('Update account failed');
        }
        return response.data;
    } catch (error) {
        console.log(error)
    }
}
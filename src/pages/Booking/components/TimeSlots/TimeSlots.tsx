import { Box, Button, Divider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BookingInformation, SetBookingInformation } from '../../../../utils/interfaces/interfaces';
import { TimeSlot } from '../../../../utils/interfaces/Booking/BookingDefinition';
import { getAllClinicSlots, getClinicAppointments } from '../../../../utils/api/ClinicOwnerUtils';
import { getCustomerAppointments } from '../../../../utils/api/UserAccountUtils';

interface TimeSlotsFormProps {
    formData: BookingInformation;
    setFormData: SetBookingInformation;
    onSlotSelect: (time: TimeSlot) => void;
    date: string;
    onClose: () => void;
}

interface ExtendedTimeSlot extends TimeSlot {
    displayTime: string;
}

const calculateSlotId = (startTime: Date): number => {
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();
    return (hours * 2) + (minutes >= 30 ? 1 : 0) + 1;
};

const formatTime = (time: string) => {
    const date = new Date(`2000-01-01T${time}`);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

const TimeSlots = ({ formData, setFormData, onClose, onSlotSelect, date }: TimeSlotsFormProps) => {
    const [morningSlots, setMorningSlots] = useState<ExtendedTimeSlot[]>([]);
    const [afternoonSlots, setAfternoonSlots] = useState<ExtendedTimeSlot[]>([]);
    const [updatedSlots, setUpdatedSlots] = useState<ExtendedTimeSlot[]>([]);
    const userId = localStorage.getItem('customerId');
    const urlPath = window.location.pathname;
    const clinicId = urlPath.split('/').pop();

    const fetchClinicSlots = async () => {
        try {
            console.log('Fetching clinic slots for clinicId:', clinicId);
            const clinicSlots = await getAllClinicSlots(clinicId);
            console.log('Clinic slots:', clinicSlots);

            const selectedDate = new Date(date);
            const weekdayIndex = selectedDate.getDay();

            const filterAndMapSlots = (slots, isBeforeNoon) => {
                return slots
                    .filter(slot => {
                        const slotHour = new Date(`2000-01-01T${slot.startTime}`).getHours();
                        const isTimeCorrect = isBeforeNoon ? slotHour < 12 : slotHour >= 12;
                        const hasAvailability = slot.maxCheckup > 0 || slot.maxTreatment > 0;
                        return isTimeCorrect && hasAvailability;
                    })
                    .map(slot => {
                        const startTime = new Date(`2000-01-01T${slot.startTime}`);
                        return {
                            id: slot.clinicSlotId,
                            start: slot.startTime,
                            end: slot.endTime,
                            slotId: calculateSlotId(startTime),
                            displayTime: `${formatTime(slot.startTime)}-${formatTime(slot.endTime)}`,
                            maxCheckup: slot.maxCheckup,
                            maxTreatment: slot.maxTreatment
                        };
                    })
                    .sort((a, b) => a.displayTime.localeCompare(b.displayTime));
            };

            const morning = filterAndMapSlots(clinicSlots[weekdayIndex], true);
            const afternoon = filterAndMapSlots(clinicSlots[weekdayIndex], false);

            setMorningSlots(morning);
            setAfternoonSlots(afternoon);
        } catch (error) {
            console.error('Error fetching clinic slots:', error);
        }
    };

    useEffect(() => {
        if (!clinicId) return;
        fetchClinicSlots();
    }, [date, clinicId]);

    const handleSlotClick = (time: TimeSlot) => {
        setFormData(prevState => ({ ...prevState, time }));
        onSlotSelect(time);
        onClose();
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6">Buổi sáng</Typography>
            <Divider sx={{ backgroundColor: 'black', width: '95%', margin: '2px auto' }} />
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                {/* {morningSlots.map((time, index) => (
                    <Button key={index}
                        variant={formData.time.id === time.id ? 'contained' : 'outlined'}
                        onClick={() => handleSlotClick(time)}
                    >
                        {time.displayTime}
                    </Button>
                ))} */}
                {morningSlots.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                        {morningSlots.map((time, index) => (
                            <Button key={index}
                                variant={formData.time.id === time.id ? 'contained' : 'outlined'}
                                onClick={() => handleSlotClick(time)}
                            >
                                {time.displayTime}
                            </Button>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body1">Không có lịch khám buổi sáng.</Typography>
                )}

            </Box>

            <Typography variant="h6">Buổi chiều</Typography>
            <Divider sx={{ backgroundColor: 'black', width: '95%', margin: '2px auto' }} />
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                {/* {afternoonSlots.map((time, index) => (
                    <Button key={index}
                        variant={formData.time.id === time.id ? 'contained' : 'outlined'}
                        onClick={() => handleSlotClick(time)}
                    >
                        {time.displayTime}
                    </Button>
                ))} */}
                {afternoonSlots.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 1 }}>
                        {afternoonSlots.map((time, index) => (
                            <Button key={index}
                                variant={formData.time.id === time.id ? 'contained' : 'outlined'}
                                onClick={() => handleSlotClick(time)}
                            >
                                {time.displayTime}
                            </Button>
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body1">Không có lịch khám buổi chiều.</Typography>
                )}
            </Box>
            {/* {!morningSlots.length && !afternoonSlots.length && (
                <Typography variant="body1" sx={{ textAlign: 'center' }}>
                    Hiện tại không có lịch khám trống. Vui lòng chọn ngày khác.
                </Typography>
            )} */}
        </Box>
    );
};

export default TimeSlots;
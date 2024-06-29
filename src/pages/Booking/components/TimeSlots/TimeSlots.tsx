import { Box, Button, Divider, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { BookingInformation, SetBookingInformation } from '../../../../utils/interfaces/interfaces';
import { TimeSlot } from '../../../../utils/interfaces/Booking/BookingDefinition';
import { getAllClinicSlots } from '../../../../utils/api/ClinicOwnerUtils';

interface TimeSlotsFormProps {
    formData: BookingInformation;
    setFormData: SetBookingInformation;
    onSlotSelect: (time: TimeSlot) => void; // Callback for slot selection
    date: string;
    onClose: () => void;
}

interface ExtendedTimeSlot extends TimeSlot {
    displayTime: string;
}


const calculateSlotId = (startTime: Date): number => {
    const hours = startTime.getHours();
    const minutes = startTime.getMinutes();

    if (hours >= 6 && hours < 7 && minutes < 30) {
        return 1; // Slot 1: 6:00 - 6:30
    } else if (hours >= 6 && hours < 7 && minutes >= 30) {
        return 2; // Slot 2: 6:30 - 7:00
    } else if (hours >= 7 && hours < 8 && minutes < 30) {
        return 3; // Slot 3: 7:00 - 7:30
    } else if (hours >= 7 && hours < 8 && minutes >= 30) {
        return 4; // Slot 4: 7:30 - 8:00
    } else if (hours >= 8 && hours < 9 && minutes < 30) {
        return 5; // Slot 5: 8:00 - 8:30
    } else if (hours >= 8 && hours < 9 && minutes >= 30) {
        return 6; // Slot 6: 8:30 - 9:00
    } else if (hours >= 9 && hours < 10 && minutes < 30) {
        return 7; // Slot 7: 9:00 - 9:30
    } else if (hours >= 9 && hours < 10 && minutes >= 30) {
        return 8; // Slot 8: 9:30 - 10:00
    } else if (hours >= 10 && hours < 11 && minutes < 30) {
        return 9; // Slot 9: 10:00 - 10:30
    } else if (hours >= 10 && hours < 11 && minutes >= 30) {
        return 10; // Slot 10: 10:30 - 11:00
    } else if (hours >= 11 && hours < 12 && minutes < 30) {
        return 11; // Slot 11: 11:00 - 11:30
    } else if (hours >= 11 && hours < 12 && minutes >= 30) {
        return 12; // Slot 12: 11:30 - 12:00
    } else if (hours >= 12 && hours < 13 && minutes < 30) {
        return 13; // Slot 13: 12:00 - 12:30
    } else if (hours >= 12 && hours < 13 && minutes >= 30) {
        return 14; // Slot 14: 12:30 - 13:00
    } else if (hours >= 13 && hours < 14 && minutes < 30) {
        return 15; // Slot 15: 13:00 - 13:30
    } else if (hours >= 13 && hours < 14 && minutes >= 30) {
        return 16; // Slot 16: 13:30 - 14:00
    } else if (hours >= 14 && hours < 15 && minutes < 30) {
        return 17; // Slot 17: 14:00 - 14:30
    } else if (hours >= 14 && hours < 15 && minutes >= 30) {
        return 18; // Slot 18: 14:30 - 15:00
    } else if (hours >= 15 && hours < 16 && minutes < 30) {
        return 19; // Slot 19: 15:00 - 15:30
    } else if (hours >= 15 && hours < 16 && minutes >= 30) {
        return 20; // Slot 20: 15:30 - 16:00
    } else if (hours >= 16 && hours < 17 && minutes < 30) {
        return 21; // Slot 21: 16:00 - 16:30
    } else if (hours >= 16 && hours < 17 && minutes >= 30) {
        return 22; // Slot 22: 16:30 - 17:00
    } else if (hours >= 17 && hours < 18 && minutes < 30) {
        return 23; // Slot 23: 17:00 - 17:30
    } else if (hours >= 17 && hours < 18 && minutes >= 30) {
        return 24; // Slot 24: 17:30 - 18:00
    } else if (hours >= 18 && hours < 19 && minutes < 30) {
        return 25; // Slot 25: 18:00 - 18:30
    } else if (hours >= 18 && hours < 19 && minutes >= 30) {
        return 26; // Slot 26: 18:30 - 19:00
    } else if (hours >= 19 && hours < 20 && minutes < 30) {
        return 27; // Slot 27: 19:00 - 19:30
    } else if (hours >= 19 && hours < 20 && minutes >= 30) {
        return 28; // Slot 28: 19:30 - 20:00
    } else if (hours >= 20 && hours < 21 && minutes < 30) {
        return 29; // Slot 29: 20:00 - 20:30
    } else if (hours >= 20 && hours < 21 && minutes >= 30) {
        return 30; // Slot 30: 20:30 - 21:00
    }

    return 0;
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

    useEffect(() => {
        const fetchClinicSlots = async () => {
            try {
                const clinicSlots = await getAllClinicSlots();

                const selectedDate = new Date(date);
                const weekdayIndex = selectedDate.getDay();  // Calculate weekday index

                // Map and sort morning slots by displayTime
                const morning = clinicSlots[weekdayIndex]
                    .filter(slot => new Date(`2000-01-01T${slot.startTime}`).getHours() < 12)
                    .map(slot => ({
                        id: slot.clinicSlotId,
                        start: slot.startTime,
                        end: slot.endTime,
                        slotId: calculateSlotId(new Date(`2000-01-01T${slot.startTime}`)),
                        displayTime: `${formatTime(slot.startTime)}-${formatTime(slot.endTime)}`
                    }))
                    .sort((a, b) => a.displayTime.localeCompare(b.displayTime));

                // Map and sort afternoon slots by displayTime
                const afternoon = clinicSlots[weekdayIndex]
                    .filter(slot => new Date(`2000-01-01T${slot.startTime}`).getHours() >= 12)
                    .map(slot => ({
                        id: slot.clinicSlotId,
                        start: slot.startTime,
                        end: slot.endTime,
                        slotId: calculateSlotId(new Date(`2000-01-01T${slot.startTime}`)),
                        displayTime: `${formatTime(slot.startTime)}-${formatTime(slot.endTime)}`
                    }))
                    .sort((a, b) => a.displayTime.localeCompare(b.displayTime));

                setMorningSlots(morning);
                setAfternoonSlots(afternoon);
            } catch (error) {
                console.error('Error fetching clinic slots:', error);
            }
        };

        fetchClinicSlots();
    }, [date]);

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
                {morningSlots.map((time, index) => (
                    <Button key={index}
                        variant={formData.time.id === time.id ? 'contained' : 'outlined'}
                        onClick={() => handleSlotClick(time)}
                    >
                        {time.displayTime}
                    </Button>
                ))}
            </Box>

            <Typography variant="h6">Buổi chiều</Typography>
            <Divider sx={{ backgroundColor: 'black', width: '95%', margin: '2px auto' }} />
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
        </Box>
    );
};


export default TimeSlots;

import { CheckCircle } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { ClinicServiceInfoModel } from "../../../../utils/api/BookingRegister";

interface ClinicServicesProps {
    services: ClinicServiceInfoModel[];
}

const ClinicServices = ({ services }: ClinicServicesProps) => {
    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {services.map((service, index) => (
                <Button key={index}
                    id={service.clinicServiceId}
                    sx={{
                        whiteSpace: 'nowrap',
                        border: '2px solid #888',
                        '&:hover': {
                            backgroundColor: '#f0f0f0',
                        },
                        padding: 1,
                    }} variant="text" startIcon={<CheckCircle />}>
                    {service.name}
                </Button>
            ))}
        </Box>
    );
};

export default ClinicServices;
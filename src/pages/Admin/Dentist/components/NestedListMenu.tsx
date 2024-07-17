import { Box, Collapse, Divider, List, ListItemIcon, ListItemText } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"
import PeopleIcon from "@mui/icons-material/People";
import MaterialIcon from "@mui/icons-material/Icon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { AccountCircleOutlined, ExpandLess, ExpandMore } from "@mui/icons-material";


export const NestedListItems = () => {
    const [open, setOpen] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleClick = (title: string) => {
        setOpen(open === title ? null : title)
    }

    const handleLogout = () => {
        navigate('/login');
        localStorage.clear();
    }

    return (
        <Box>
            <List component="nav">
                <ListItemButton onClick={() => handleClick("Trang chủ")} component={Link} to="/dentist" >
                    <ListItemIcon >
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Trang chủ" />
                </ListItemButton>
                {/* <ListItemButton onClick={() => handleClick("Bệnh nhân")} component={Link} to="/patient" >
                    <ListItemIcon >
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Bệnh nhân" />
                </ListItemButton> */}
            </List>
            <Divider sx={{ width: '90%', margin: '16px auto', borderBottomWidth: '2px', backgroundColor: '#000' }} />
            <ListItemButton component={Link} to='/dentist/account'>
                <ListItemIcon>
                    <AccountCircleOutlined />
                </ListItemIcon>
                <ListItemText primary="Tài khoản" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Đăng xuất" />
            </ListItemButton>
        </Box>
    )
}
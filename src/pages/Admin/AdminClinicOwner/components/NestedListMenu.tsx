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
import { ExpandLess, ExpandMore } from "@mui/icons-material";


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
                <ListItemButton component={Link} to="/admin/clinic-owner" >
                    <ListItemIcon >
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Trang chủ" />
                </ListItemButton>
                {/* <Collapse in={open == "Người dùng"} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} to="/system-admin/patient">
                            <ListItemText primary="Bệnh nhân" />
                        </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} to="/system-admin/dentist">
                            <ListItemText primary="Nha sĩ" />
                        </ListItemButton>
                    </List>
                </Collapse> */}
                <ListItemButton onClick={() => handleClick("Quản lí phòng khám")} component={Link} to="/admin/clinic-owner/clinic">
                    <ListItemIcon >
                        <LocalHospitalIcon />
                    </ListItemIcon>
                    <ListItemText primary="Quản lí phòng khám" />
                    {open === "Quản lí phòng khám" ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open == "Quản lí phòng khám"} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} to="./dentist">
                            <ListItemText primary="Danh sách nha sĩ" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <ListItemButton onClick={() => handleClick("Quản lí lịch hẹn")} component={Link} to='/admin/clinic-owner/appointment'>
                    <ListItemIcon >
                        <CalendarMonthIcon />
                    </ListItemIcon>
                    <ListItemText primary="Quản lí lịch hẹn" />
                    {open === "Quản lí lịch hẹn" ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open == "Quản lí lịch hẹn"} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} to="./list">
                            <ListItemText primary="Danh sách lịch hẹn" />
                        </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} to="./annual">
                            <ListItemText primary="Đề xuất lịch định kì" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <ListItemButton component={Link} to='/admin/clinic-owner/slots'>
                    <ListItemIcon >
                        <AccessTimeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Thiết lập slot khám" />
                </ListItemButton>
                <ListItemButton component={Link} to="/admin/clinic-owner/services">
                    <ListItemIcon >
                        <MedicalServicesIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dịch vụ phòng khám" />
                </ListItemButton>
            </List>
            <Divider sx={{ width: '90%', margin: '16px auto', borderBottomWidth: '2px', backgroundColor: '#000' }} />
            <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                    <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Đăng xuất" />
            </ListItemButton>
        </Box>
    )
}
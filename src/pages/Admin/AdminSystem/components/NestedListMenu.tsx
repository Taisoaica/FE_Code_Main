import { Box, Collapse, List, ListItemIcon, ListItemText } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import { Link } from "react-router-dom";
import { useState } from "react"
import PeopleIcon from "@mui/icons-material/People";
import MaterialIcon from "@mui/icons-material/Icon";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { ExpandLess, ExpandMore } from "@mui/icons-material";


export const NestedListItems = () => {
    const [open, setOpen] = useState<string | null>(null);
    const handleClick = (title: string) => {
        setOpen(open === title ? null : title)
    }


    return (
        <Box>
            <List component="nav">
                <ListItemButton onClick={() => handleClick("Người dùng")} component={Link} to="/system-admin" >
                    <ListItemIcon >
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Quản lí người dùng" />
                    {open === "Người dùng" ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open == "Người dùng"} timeout="auto" unmountOnExit>
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
                </Collapse>
                <ListItemButton component={Link} to="/system-admin/clinic">
                    <ListItemIcon >
                        <LocalHospitalIcon />
                    </ListItemIcon>
                    <ListItemText primary="Quản lí phòng khám" />
                </ListItemButton>
                <ListItemButton component={Link} to='/system-admin/service'>
                    <ListItemIcon >
                        <MedicalServicesIcon />
                    </ListItemIcon>
                    <ListItemText primary="Danh mục dịch vụ" />
                </ListItemButton>
            </List>
        </Box>
    )
}
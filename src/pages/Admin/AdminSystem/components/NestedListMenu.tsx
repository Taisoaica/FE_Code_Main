import { Box, Collapse, List, ListItemIcon, ListItemText } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import { Link } from "react-router-dom";
import { useState } from "react"
import PeopleIcon from "@mui/icons-material/People";
import MaterialIcon from "@mui/icons-material/Icon";
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
                <ListItemButton onClick={() => handleClick("Người dùng")}>
                    <ListItemIcon >
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Người dùng" />
                    {open === "Người dùng" ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open === "Người dùng"} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} to="/system-admin">
                            <ListItemText primary="Người dùng hoạt động" />
                        </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} to="/system-admin">
                            <ListItemText primary="Người dùng ngừng hoạt động" />
                        </ListItemButton>
                    </List> 
                </Collapse>
                <ListItemButton onClick={() => handleClick("Phòng khám")}>
                    <ListItemIcon >
                        <MedicalServicesIcon />
                    </ListItemIcon>
                    <ListItemText primary="Phòng khám" />
                    {open === "Phòng khám" ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open === "Phòng khám"} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} to="/system-admin/clinic">
                            <ListItemText primary="Phòng khám đã xác nhận" />
                        </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} to="/system-admin/clinic">
                            <ListItemText primary="Phòng khám chưa xác nhận" />
                        </ListItemButton>
                    </List>
                </Collapse>
                <ListItemButton onClick={() => handleClick("Dịch vụ")}>
                    <ListItemIcon >
                        <MedicalServicesIcon />
                    </ListItemIcon>
                    <ListItemText primary="Danh mục dịch vụ" />
                    {open === "Dịch vụ" ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open === "Dịch vụ"} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton component={Link} to="/system-admin/service">
                            <ListItemText primary="Thêm danh mục dịch vụ" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </Box>
    )
}
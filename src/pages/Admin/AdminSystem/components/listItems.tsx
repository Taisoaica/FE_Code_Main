import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import MaterialIcon from "@mui/icons-material/Icon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const sidebarData: {
  title: string, path: string, icon: typeof MaterialIcon
}[] = [
    {
      title: "Người dùng",
      path: "/system-admin",
      icon: PeopleIcon
    },
    {
      title: "Phòng khám",
      path: "/system-admin/clinic",
      icon: MedicalServicesIcon
    },
    {
      title: "Dịch vụ",
      path: "/system-admin/service",
      icon: MedicalServicesIcon
    },
  ]

export const mainListItems = (
  <Box>
    {sidebarData.map((item, index) => (
      <ListItemButton component={Link} to={item.path} key={index}>
        <ListItemIcon>
          <item.icon />
        </ListItemIcon>
        <ListItemText primary={item.title} />
      </ListItemButton>
    ))}  </Box>
);

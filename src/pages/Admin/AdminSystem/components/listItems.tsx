import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import MaterialIcon from "@mui/icons-material/Icon";
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const sidebarData: {
  title: string,
  path: string,
  icon: typeof MaterialIcon,
  nestedItems?: {title: string, path:string}[]
}[] = [
    {
      title: "Quản lí người dùng",
      path: "/system-admin",
      icon: PeopleIcon
    },
    {
      title: "Quản lí phòng khám",
      path: "/system-admin/clinic",
      icon: LocalHospitalIcon
    },
    {
      title: "Danh mục dịch vụ",
      path: "/system-admin/service",
      icon: MedicalServicesIcon
    },
  ];

export const mainListItems = (

  <Box>
    {sidebarData.map((item, index) => (
      <ListItemButton component={Link} to={item.path} key={index}>
        <ListItemIcon>
          <item.icon />
        </ListItemIcon>
        <ListItemText primary={item.title} />
      </ListItemButton>
    ))}
  </Box>
);

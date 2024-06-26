import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { mainListItems } from "../components/listItems";
import { useEffect, useState } from "react";
import ClinicInfo from "../components/ClinicInfo/ClinicInfo";
import { fetchClinicImages } from "../../../../utils/UploadFireBase";


const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

export default function ClinicInformation() {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [isDesDialogOpen, setIsDesDialogOpen] = useState(false);
  const [editorData, setEditorData] = useState('');
  const [textAreaContent, setTextAreaContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [logo, setLogo] = useState<string>('');
  const [isSerDialogOpen, setIsSerDialogOpen] = useState(false);
  const [services, setServices] = useState(['Service 1', 'Service 2', 'Service 3']);
  const [selectedService, setSelectedService] = useState('');
  const [newService, setNewService] = useState('');


  useEffect(() => {
  
    // if (!clinicId) return; 

    const fetchImages = async (folderName: string) => {
      const folderPath = `clinics/1/${folderName}/`;
      try {
        const imageUrls = await fetchClinicImages(folderPath);
        if (folderName === 'carousel') {
          setImages(imageUrls);
        } else if (folderName === 'logo') {

          setLogo(imageUrls[0]);
        }
      } catch (error) {
        console.error(`Error fetching images from ${folderName}:`, error);
      }
    };

    fetchImages('carousel');
    fetchImages('logo');
  }, []);


  const handleEditorChange = (event: any, editor: { getData: () => any; }) => {
    const data = editor.getData();
    setEditorData(data);
  };

  const handleEditClick = () => {
    setEditorData(textAreaContent);
    setIsDesDialogOpen(true);
  };

  const handleDesSave = () => {
    setTextAreaContent(editorData);
    setIsDesDialogOpen(false);
  };


  const handleAddClick = () => {
    setIsSerDialogOpen(true);
  };

  const handleServiceSave = () => {
    if (newService) {
      setServices([...services, newService]);
      setNewService('');
      setIsSerDialogOpen(false);
    }
  };
  return (
    <Box sx={{ display: "flex", height: '100%' }}>
      <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Trang thông tin phòng khám
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {mainListItems}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          marginTop: 5.5,
          height: '100%',
          color: '#0d47a1',
          background: 'linear-gradient(to left, #e3f2fd, #f8fbff)'
        }}
      >
        <ClinicInfo />
      </Box>
    </Box>
  );
}

import * as React from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
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
import { Container, Grid, Paper, TextField, Button, ListItem, ListItemText } from "@mui/material";
import { mainListItems } from "../components/listItems";
import styles from "./ClinicServices.module.css";
import { ClinicServiceCategoryRegistrationModel, ClinicServiceCategoryModel, getAllCategories, addCategory } from '../../../../utils/api/SystemAdminUtils'; // Assuming type definitions are imported
import { useEffect, useState } from "react";


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

const defaultTheme = createTheme();


const ClinicServices = () => {
    const [open, setOpen] = React.useState(true);
    const [newCategoryName, setNewCategoryName] = useState<string>('');
    const [categories, setCategories] = useState<ClinicServiceCategoryModel[]>([]);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getAllCategories();
            if (Array.isArray(data)) {
                setCategories(data);
            } else {
                console.error('Invalid data format received:', data);
                // Handle error scenario
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle error scenario
        }
    };

    const handleAddCategory = async () => {
        try {
            const newCategory: ClinicServiceCategoryRegistrationModel = {
                Name: newCategoryName,
            };
            const data = await addCategory(newCategory);
            if (Array.isArray(data)) {
                setCategories(data); // Update categories state with updated list
                setNewCategoryName(''); // Clear input field after successful addition
            } else {
                console.error('Invalid data format received:', data);
                // Handle error scenario
            }
        } catch (error) {
            console.error('Error adding category:', error);
            // Handle error scenario
        }
    };


    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: "flex" }}>
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: "24px", // keep right padding when drawer closed
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
                            Trang đăng kí danh mục dịch vụ
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
                    pt={10}
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: "100vh",
                        overflow: "auto",
                    }}
                >
                    <Box className={styles.mainContainer}>
                        <div className={styles.tableContainer}>
                            <div className={styles.tableHeader}>Danh sách danh mục dịch vụ phòng khám</div>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '10%' }}>ID</th>
                                        <th style={{ width: '90%' }}>Tên danh mục dịch vụ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((category) => (
                                        <tr key={category.id}>
                                            <td style={{ width: '10%' }}>{category.id}</td>
                                            <td style={{ width: '90%' }}>{category.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={styles.addCategorySection}>
                            <h6 className={styles.addCategoryHeader}>Thêm danh mục dịch vụ phòng khám</h6>
                            <input
                                type="text"
                                placeholder="Tên danh mục"
                                className={styles.addCategoryInput}
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                            <button
                                className={styles.addCategoryButton}
                                onClick={handleAddCategory}
                            >
                                Thêm danh mục
                            </button>
                        </div>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default ClinicServices;

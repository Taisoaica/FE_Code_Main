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
import { mainListItems } from "../components/listItems";
import styles from "./UserManagement.module.css";
import { UserInfoModel, getAllUsers } from "../../../../utils/api/SystemAdminUtils";
import UserModal from "../components/UserModal";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MenuItem, Select } from "@mui/material";


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


const UserManagement = () => {
    const [users, setUsers] = useState<UserInfoModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');


    const [open, setOpen] = React.useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            if (typeof data === 'string') {
                setError(data);
            } else {
                setUsers(data);
            }
        } catch (error) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);


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
                            Trang tài khoản người dùng
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
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
                    pt={8}
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
                            <Box className={styles.toolbar}>
                                <Box className={styles.searchbar}>
                                    <input type="text" placeholder="Tìm kiếm người dùng" className={styles.searchInput} />
                                    <button className={styles.searchButton}>Tìm kiếm</button>
                                </Box>
                            </Box>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Username</th>
                                        <th>Ngày tạo</th>
                                        <th>Role</th>
                                        <th>Fullname</th>
                                        <th>Dentist ID</th>
                                        <th>Clinic ID</th>
                                        <th>IsOwner</th>
                                        <th>
                                            <Box className={styles.tooltip}>
                                                Trạng thái
                                                <span className={styles.tooltiptext}>Nhấn để cập nhật trạng thái</span>
                                                <span className={styles.tooltipicon}>!</span>
                                            </Box>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* {loading ? (
                                        <tr>
                                            <td colSpan={16}>Loading...</td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={16}>Error: {error}</td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.id} className={styles.tableRow}>
                                                <td>{user.id}</td>
                                                <td>{user.username}</td>
                                                <td>{user.joinedDate ? user.joinedDate.toString() : ""}</td>
                                                <td>{user.role}</td>
                                                <td>{user.fullname}</td>
                                                <td>{user.dentistId}</td>
                                                <td>{user.clinicId}</td>
                                                <td>{user.isOwner ? 'Yes' : 'No'}</td>
                                                <td>
                                                    <button
                                                        className={`${styles.statusButton} ${user.isActive ? styles.active : styles.inactive}`}
                                                    >
                                                        {user.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )} */}
                                </tbody>
                            </table>
                        </div>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}


export default UserManagement
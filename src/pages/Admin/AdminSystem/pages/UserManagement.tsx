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
import { Button } from 'reactstrap';
import { useEffect, useState } from "react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


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

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);

        const padToTwoDigits = (num: number) => String(num).padStart(2, '0');

        const day = padToTwoDigits(date.getDate());
        const month = padToTwoDigits(date.getMonth() + 1);
        const year = date.getFullYear();
        const hours = padToTwoDigits(date.getHours());
        const minutes = padToTwoDigits(date.getMinutes());
        const seconds = padToTwoDigits(date.getSeconds());

        return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
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
                    {/* <NestedListItems /> */}
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
                            <div className={styles.tableHeader}>Người dùng của hệ thống</div>
                            <Box className={styles.toolbar}>
                                <Box className={styles.searchbar}>
                                    <input type="text" placeholder="Tìm kiếm người dùng" className={styles.searchInput} />
                                    <button className={styles.searchButton}>Tìm kiếm</button>
                                </Box>
                            </Box>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '5%' }}>ID</th>
                                        <th style={{ width: '15%' }}>Username</th>
                                        <th style={{ width: '15%' }}>Ngày tạo</th>
                                        <th style={{ width: '10%' }}>Vai trò</th>
                                        <th style={{ width: '15%' }}>Họ tên</th>
                                        <th style={{width: '10%'}}>Là nha sĩ</th>
                                        {/* <th>Clinic ID</th> */}
                                        <th style={{width: '11%'}}>Là chủ phòng khám</th>
                                        <th style={{width: '19%'}}>
                                            <Box className={styles.tooltip}>
                                                Trạng thái
                                                {/* <span className={styles.tooltiptext}>Nhấn để cập nhật trạng thái</span>
                                                <span className={styles.tooltipicon}>!</span> */}
                                            </Box>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
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
                                                <td>{user.joinedDate ? formatDate(user.joinedDate) : ''}</td>
                                                <td>{user.role}</td>
                                                <td>{user.fullname}</td>
                                                <td>
                                                    {user.role === 'Customer' ? <CloseIcon /> : (user.role === 'Dentist' && !user.isOwner ? <CheckIcon /> : <CheckIcon />)}
                                                </td>
                                                {/* <td>
                                                    {user.role === 'Customer' ? <CloseIcon /> : (user.role === 'Dentist' && user.isOwner ? <CheckIcon /> : '')}
                                                </td> */}
                                                <td>{user.isOwner ? <CheckIcon /> : <CloseIcon />}</td>
                                                <td>
                                                    <Button
                                                        className={user.isActive ? styles.confirmedButton : styles.unconfirmedButton}
                                                    >
                                                        {user.isActive ? 'Hoạt động' : 'Ngừng hoạt động'}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
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
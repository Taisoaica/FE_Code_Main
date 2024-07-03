import * as React from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./DentistList.module.css";

import { useEffect, useState } from "react";
import { NestedListItems } from "../components/NestedListMenu";
import Box from "@mui/material/Box";
import { Button, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { DentistRegistrationModel } from "../../../../utils/api/ClinicOwnerUtils";
import { DentistInfoViewModel } from "../../../../utils/api/BookingRegister";
import { fetchClinicStaff, registerDentist } from "../../../../utils/api/ClinicOwnerUtils";

const drawerWidth: number = 270;

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

const DentistList = () => {
    const [staff, setStaff] = useState<DentistInfoViewModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = React.useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [newDentist, setNewDentist] = useState<DentistRegistrationModel>({
        username: '',
        fullname: '',
        password: '',
        email: '',
    });


    useEffect(() => {
        const loadStaff = async () => {
            try {
                const data = await fetchClinicStaff();
                setStaff(data.filter(user => !user.isOwner));
            } catch (error) {
                setError('Failed to fetch staff data');
            } finally {
                setLoading(false);
            }
        };

        loadStaff();
    }, []);

    const toggleDrawer = () => {
        setOpen(!open);
    };


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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewDentist((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerDentist(newDentist);
            alert('Dentist registered successfully!');
            setNewDentist({
                fullname: '',
                username: '',
                password: '',
                email: ''
            });
            toggleModal(); // Close the modal
        } catch (error) {
            console.error('Failed to register dentist:', error);
        }
    };


    const toggleModal = () => setModalOpen(!modalOpen);

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
                            Trang chi tiết phòng khám
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
                    {/* <List component="nav">
                        {mainListItems}
                    </List> */}
                    <NestedListItems />
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
                            <div className={styles.tableHeader}>Danh sách nha sĩ</div>
                            <div className={styles.toolbar}>
                                {/* <div className={styles.searchbar}>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm người dùng"
                                        className={styles.searchInput}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button className={styles.searchButton} onClick={handleSearch}>
                                        Tìm kiếm
                                    </button>
                                </div> */}
                                <Button
                                    onClick={toggleModal}
                                    color="primary"
                                    className={styles.openModalButton}
                                >
                                    Thêm nha sĩ
                                </Button>
                            </div>

                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '10%' }}>ID</th>
                                        <th style={{ width: '15%' }}>Username</th>
                                        <th style={{ width: '15%' }}>Họ tên</th>
                                        <th style={{ width: '15%' }}>Ngày tạo</th>
                                        <th style={{ width: '10%' }}>Email</th>
                                        <th style={{ width: '10%' }}>Phone</th>
                                        <th style={{ width: '25%' }}>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={9}>Loading...</td>
                                        </tr>
                                    ) : error ? (
                                        <tr>
                                            <td colSpan={9}>Error: {error}</td>
                                        </tr>
                                    ) : (
                                        staff.map((user) => (
                                            <tr key={user.dentistId} className={styles.tableRow}>
                                                <td>{user.dentistId}</td>
                                                <td>{user.username}</td>
                                                <td>{user.fullname}</td>
                                                <td>{user.joinedDate ? formatDate(user.joinedDate.toString()) : ''}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone}</td>
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
                <Modal isOpen={modalOpen} toggle={toggleModal} centered>
                    <ModalHeader toggle={toggleModal}>Đăng kí tài khoản nha sĩ mới</ModalHeader>
                    <ModalBody>
                        <form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="fullname">Họ và tên</Label>
                                <Input
                                    type="text"
                                    name="fullname"
                                    id="fullname"
                                    value={newDentist.fullname}
                                    onChange={handleInputChange}
                                    placeholder="Nhập họ và tên"
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="username">Username</Label>
                                <Input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={newDentist.username}
                                    onChange={handleInputChange}
                                    placeholder="Nhập username"
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={newDentist.password}
                                    onChange={handleInputChange}
                                    placeholder="Nhập password"
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="email">Email</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={newDentist.email}
                                    onChange={handleInputChange}
                                    placeholder="Nhập email"
                                    required
                                />
                            </FormGroup>
                        </form>
                    </ModalBody>
                    <ModalFooter className="d-flex justify-content-end">
                        <Button color="secondary" onClick={toggleModal} className="me-2">
                            Hủy
                        </Button>
                        <Button type="submit" color="primary" onClick={handleSubmit}>
                            Đăng kí
                        </Button>
                    </ModalFooter>
                </Modal>

            </Box>
        </ThemeProvider>
    )
}

export default DentistList
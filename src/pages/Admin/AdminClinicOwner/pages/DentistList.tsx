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
import styles from "./DentistList.module.css";

import { useEffect, useState } from "react";
import { NestedListItems } from "../components/NestedListMenu";
import Box from "@mui/material/Box";
import { Button, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { DentistRegistrationModel } from "../../../../utils/api/ClinicOwnerUtils";
import { DentistInfoViewModel } from "../../../../utils/api/BookingRegister";
import { fetchClinicStaff, registerDentist, activateDentist, deactivateDentist } from "../../../../utils/api/ClinicOwnerUtils";
import Tooltip from "../components/Tooltip";

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
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [fullnameError, setFullnameError] = useState('');

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

    useEffect(() => {
        loadStaff();
    }, []);

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const validateUsername = (username: string): boolean => {
        const regex = /^[A-Za-z0-9]{7,29}$/;
        const isValid = regex.test(username);
        setUsernameError(isValid ? '' : 'Tên đăng nhập phải từ 7-29 ký tự và chỉ chứa chữ cái và số.');
        return isValid;
    };

    const validatePassword = (password: string): boolean => {
        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z0-9_]{8,30}$/;
        const isValid = regex.test(password);
        setPasswordError(isValid ? '' : 'Mật khẩu phải từ 8-30 ký tự, bao gồm ít nhất một chữ hoa, một chữ thường và một số.');
        return isValid;
    };

    const validateEmail = (email: string): boolean => {
        const regex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const isValid = regex.test(email);
        setEmailError(isValid ? '' : 'Vui lòng nhập một địa chỉ email hợp lệ.');
        return isValid;
    };

    const validateFullname = (fullname: string): boolean => {
        const isValid = fullname.trim().length > 0;
        setFullnameError(isValid ? '' : 'Họ tên không được để trống.');
        return isValid;
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

        switch (name) {
            case 'username':
                validateUsername(value);
                break;
            case 'password':
                validatePassword(value);
                break;
            case 'email':
                validateEmail(value);
                break;
            case 'fullname':
                validateFullname(value);
                break;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (
            validateUsername(newDentist.username) &&
            validatePassword(newDentist.password) &&
            validateEmail(newDentist.email) &&
            validateFullname(newDentist.fullname)
        ) {
            try {
                await registerDentist(newDentist);
                alert('Dentist registered successfully!');
                setNewDentist({
                    fullname: '',
                    username: '',
                    password: '',
                    email: ''
                });
                toggleModal();
                loadStaff();
            } catch (error) {
                console.error('Failed to register dentist:', error);
            }
        } else {
            alert('Please correct the errors in the form before submitting.');
        }
    };

    const handleStatusChange = async (dentistId: number, isActive: boolean) => {
        if (isActive) {
            const response = await deactivateDentist(dentistId);
            if (response.statusCode === 200) {
                alert('Deactivated successfully');
            }
        } else {
            const response = await activateDentist(dentistId);
            if (response.statusCode === 200) {
                alert('Activated successfully');
            }
        }
        loadStaff();
    }

    const toggleModal = () => {
        setNewDentist({
            username: '',
            fullname: '',
            password: '',
            email: '',
        })
        setUsernameError('');
        setPasswordError('');
        setEmailError('');
        setFullnameError('');    
        setModalOpen(!modalOpen);
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: "flex" }}>
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
                            Trang danh sách nha sĩ
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
                                        {/* <th style={{ width: '10%' }}>ID</th> */}
                                        <th style={{ width: '15%' }}>Username</th>
                                        <th style={{ width: '25%' }}>Họ tên</th>
                                        <th style={{ width: '15%' }}>Ngày tạo</th>
                                        <th style={{ width: '10%' }}>Email</th>
                                        <th style={{ width: '10%' }}>Phone</th>
                                        <th style={{ width: '25%' }}>
                                            Trạng thái
                                            <Tooltip message="Ấn để cập nhật trạng thái của nha sĩ">
                                                <span className={styles.infoIcon}>!</span>
                                            </Tooltip>
                                        </th>
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
                                                {/* <td>{user.dentistId}</td> */}
                                                <td>{user.username}</td>
                                                <td>{user.fullname}</td>
                                                <td>{user.joinedDate ? formatDate(user.joinedDate.toString()) : ''}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phone}</td>
                                                <td>
                                                    <Button
                                                        className={user.isActive ? styles.confirmedButton : styles.unconfirmedButton}
                                                        onClick={() => handleStatusChange(user.dentistId, user.isActive)}
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
                                    invalid={!!fullnameError}
                                />
                                {fullnameError && <div className="text-danger">{fullnameError}</div>}
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
                                    invalid={!!usernameError}
                                />
                                {usernameError && <div className="text-danger">{usernameError}</div>}
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
                                    invalid={!!passwordError}
                                />
                                {passwordError && <div className="text-danger">{passwordError}</div>}
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
                                    invalid={!!emailError}
                                />
                                {emailError && <div className="text-danger">{emailError}</div>}
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
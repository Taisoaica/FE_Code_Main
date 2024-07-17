import * as React from "react";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import styles from "./ClinicManagement.module.css";
import { getAllClinicInfo, getAllClinics } from "../../../../utils/api/SystemAdminUtils";
import { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { NestedListItems } from "../components/NestedListMenu";
import { IClinicModel } from "../../../../utils/Interfaces/interfaces";

const drawerWidth: number = 270;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxPagesToShow?: number;
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

const ClinicManagement = () => {
    const [open, setOpen] = useState(true);
    //const [loading, setLoading] = useState(false);
    //const [error, setError] = useState<string>('');
    const [searchNameVerified, setSearchNameVerified] = useState('');
    const [searchNameUnverified, setSearchNameUnverified] = useState('');
    const [currentPageVerified, setCurrentPageVerified] = useState(1);
    const [totalPagesVerified, setTotalPagesVerified] = useState(1);
    const [currentPageUnverified, setCurrentPageUnverified] = useState(1);
    const [totalPagesUnverified, setTotalPagesUnverified] = useState(1);
    const [verifiedClinics, setVerifiedClinics] = useState<IClinicModel[]>([]);
    const [unverifiedClinics, setUnverifiedClinics] = useState<IClinicModel[]>([]);

    const navigate = useNavigate();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    /*const fetchTotalClinics = async (
        status: 'verified' | 'unverified' | '',
        name: string = '',
        page: number = 1,
        itemsPerPage: number = 5
    ) => {
        setLoading(true);
        setError('');
        try {
            // Fetch all clinics to filter them locally
            const data = await getAllClinics(0, 0, name, '', '', '', undefined);
            if (typeof data === 'string') {
                setError(data);
            } else {
                // Filter the clinics based on the status
                const filteredClinics = data.content.filter(clinic => clinic.status === status);
                const totalItems = filteredClinics.length;

                const totalPages = Math.ceil(totalItems / itemsPerPage);

                if (page > totalPages) {
                    page = totalPages;
                }

                // Set the total pages for the correct status
                if (status === 'verified') {
                    setTotalPagesVerified(totalPages);
                } else {
                    setTotalPagesUnverified(totalPages);
                }

                // Fetch clinics for the current page
                fetchClinics(status, page, name, itemsPerPage);
            }
        } catch (error) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    };

    const fetchClinics = async (
        status: 'verified' | 'unverified' | '',
        page: number,
        name: string = '',
        itemsPerPage: number
    ) => {
        setLoading(true);
        setError('');
        try {
            const data = await getAllClinics(page, itemsPerPage, name, '', '', '', undefined);
            if (typeof data === 'string') {
                setError(data);
            } else {
                // Filter clinics based on status
                const clinics = data.content.filter(clinic => clinic.status === status);
                if (status === 'verified') {
                    setVerifiedClinics(clinics);
                    setCurrentPageVerified(page);
                } else {
                    setUnverifiedClinics(clinics);
                    setCurrentPageUnverified(page);
                }
            }
        } catch (error) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    };*/

    /*useEffect(() => {
        fetchTotalClinics('verified', searchNameVerified, currentPageVerified, 5);
    }, [searchNameVerified, currentPageVerified]);

    useEffect(() => {
        fetchTotalClinics('unverified', searchNameUnverified, currentPageUnverified, 5);
    }, [searchNameUnverified, currentPageUnverified]);*/

    const fetchVerifiedClinics = async (name: string | null, page_size: number | null, page: number | null = 1): Promise<void> => {
        const result = await getAllClinicInfo(name, page, page_size, "verified");
        const total = await getAllClinicInfo('', 1,  2147483647, 'verified');

        console.log(Math.ceil(total.length/5))

        setVerifiedClinics(result);
        setCurrentPageVerified(page!);
        setTotalPagesVerified(Math.ceil(total.length/5));
    };

    const fetchUnverifiedClinics = async (name: string = '', page_size: number = Number.MAX_SAFE_INTEGER, page: number = 1): Promise<void> => {
        const result = await getAllClinicInfo(name, page, page_size, "unverified");
        const total = await getAllClinicInfo('', 1,  2147483647, 'unverified');

        setUnverifiedClinics(result);
        setCurrentPageUnverified(page!);
        setTotalPagesUnverified(Math.ceil(total.length/5));
    };

    const handlePageChange = (pageNumber: number, type: 'verified' | 'unverified') => {
        if (type === 'verified') {
            setCurrentPageVerified(pageNumber);
            fetchVerifiedClinics(searchNameVerified, 5, pageNumber);
        } else {
            setCurrentPageUnverified(pageNumber);
            fetchUnverifiedClinics(searchNameUnverified, 5, pageNumber);
        }
    };

    useEffect(() => {
        fetchVerifiedClinics(searchNameVerified, 5, currentPageVerified);
    }, [searchNameVerified, currentPageVerified]);

    useEffect(() => {
        fetchUnverifiedClinics(searchNameUnverified, 5, currentPageUnverified);
    }, [searchNameUnverified, currentPageUnverified]);

    const handleSearchChangeVerified = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchNameVerified(e.target.value);
    };

    const handleSearchChangeUnverified = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchNameUnverified(e.target.value);
    };

    const handleSearchClickVerified = () => {
        fetchVerifiedClinics(searchNameVerified, 5, currentPageVerified);
    };

    const handleSearchClickUnverified = () => {
        fetchUnverifiedClinics(searchNameUnverified, 5, currentPageUnverified);
    };

    const handleRowClick = (clinic: IClinicModel) => {
        console.log(clinic);
        navigate(`./${clinic.id}`);
    }

    const Pagination = ( { currentPage, totalPages, onPageChange, maxPagesToShow = Math.min(5, totalPages)}: PaginationProps) => {
        const pages: number[] = [];
        const validCurrentPage = currentPage ?? 1;

        if (totalPages < 1) totalPages = 1;

        const page = Math.min(Math.max(validCurrentPage, 1), totalPages);

        let startPage = Math.max(page - Math.floor(maxPagesToShow / 2), 1);
        const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(endPage - maxPagesToShow + 1, 1);
        }

        if (startPage + maxPagesToShow - 1 > totalPages) {
            startPage = Math.max(totalPages - maxPagesToShow + 1, 1);
        }

        for (let p = startPage; p <= endPage; p++) {
            pages.push(p);
        }

        return (
            <div className={styles.pagination}>
                {page > 1 && (
                    <button onClick={() => onPageChange(page - 1)}>&laquo; Trước</button>
                )}
                {pages.map(p => (
                    <button
                        key={p}
                        className={p === page ? styles.active : ''}
                        onClick={() => onPageChange(p)}
                    >
                        {p}
                    </button>
                ))}
                {page < totalPages && (
                    <button onClick={() => onPageChange(page + 1)}>Tiếp &raquo;</button>
                )}
            </div>
        );
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
                            Trang quản lí phòng khám
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
                            <div className={styles.tableHeader}>Phòng khám đã xác nhận</div>
                            <Box className={styles.toolbar}>
                                <Box className={styles.searchbar}>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm phòng khám"
                                        className={styles.searchInput}
                                        value={searchNameVerified}
                                        onChange={handleSearchChangeVerified}
                                    />
                                    <button
                                        className={styles.searchButton}
                                        onClick={handleSearchClickVerified}
                                    >Tìm kiếm
                                    </button>
                                </Box>
                                {/* <Box className={styles.utilities}>
                                    <select className={styles.filterSelect}>
                                        <option value="">Filter</option>
                                        <option value="role1">Role 1</option>
                                        <option value="role2">Role 2</option>
                                    </select>
                                    <button className={styles.addButton}>
                                        Thêm phòng khám
                                    </button>
                                </Box> */}
                            </Box>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '3%' }}>ID</th>
                                        <th style={{ width: '20%' }}>Tên phòng khám</th>
                                        <th style={{ width: '20%' }}>Tên chủ phòng khám</th>
                                        <th style={{ width: '27%' }}>Trạng thái hoạt động</th>
                                        <th style={{ width: '35%' }}>Trạng thái xác nhận</th>
                                        {/* <th>
                                            <Box className={styles.tooltip}>
                                                Trạng thái
                                            </Box>
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {verifiedClinics.map((clinic) => (
                                        <tr key={clinic.id} onClick={() => handleRowClick(clinic)}>
                                            <td style={{ width: '5%' }}>{clinic.id}</td>
                                            <td style={{ width: '25%' }}>{clinic.name}</td>
                                            <td style={{ width: '20%' }}>{clinic.ownerName}</td>
                                            <td style={{ width: '27%' }}>
                                            {!clinic.working ? (
                                                    <p>
                                                        Không làm việc
                                                    </p>
                                                ) : (
                                                    <p>
                                                        Đang làm việc
                                                    </p>
                                                )}
                                            </td>
                                            <td style={{ width: '28%' }}>
                                                {clinic.status == 'verified' ? (
                                                    <Button variant="contained" className={styles.confirmedButton}>
                                                        Đã xác nhận
                                                    </Button>
                                                ) : (
                                                    <Button variant="outlined" className={styles.unconfirmedButton}>
                                                        Chưa xác nhận
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination
                                currentPage={currentPageVerified}
                                totalPages={totalPagesVerified}
                                onPageChange={(page) => handlePageChange(page, 'verified')}
                            />
                        </div>
                        <div className={styles.tableContainer}>
                            <div className={styles.tableHeader}>Phòng khám chưa xác nhận</div>
                            <Box className={styles.toolbar}>
                                <Box className={styles.searchbar}>
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm phòng khám"
                                        className={styles.searchInput}
                                        value={searchNameUnverified}
                                        onChange={handleSearchChangeUnverified}
                                    />
                                    <button
                                        className={styles.searchButton}
                                        onClick={handleSearchClickUnverified}
                                    >
                                        Tìm kiếm
                                    </button>
                                </Box>
                                {/* <Box className={styles.utilities}>
                                    <select className={styles.filterSelect}>
                                        <option value="">Filter</option>
                                        <option value="role1">Role 1</option>
                                        <option value="role2">Role 2</option>
                                    </select>
                                    <button className={styles.addButton}>
                                        Thêm phòng khám
                                    </button>
                                </Box> */}
                            </Box>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={{ width: '3%' }}>ID</th>
                                        <th style={{ width: '20%' }}>Tên phòng khám</th>
                                        <th style={{ width: '20%' }}>Tên chủ phòng khám</th>
                                        <th style={{ width: '27%' }}>Trạng thái hoạt động</th>
                                        <th style={{ width: '35%' }}>Trạng thái xác nhận</th>
                                        {/* <th>
                                            <Box className={styles.tooltip}>
                                                Trạng thái
                                            </Box>
                                        </th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {unverifiedClinics.map((clinic) => (
                                        <tr key={clinic.id} onClick={() => handleRowClick(clinic)}>
                                            <td style={{ width: '5%' }}>{clinic.id}</td>
                                            <td style={{ width: '25%' }}>{clinic.name}</td>
                                            <td style={{ width: '20%' }}>{clinic.ownerName}</td>
                                            <td style={{ width: '27%' }}>
                                                {!clinic.working ? (
                                                    <p>
                                                        Không làm việc
                                                    </p>
                                                ) : (
                                                    <p>
                                                        Đang làm việc
                                                    </p>
                                                )}
                                            </td>
                                            <td style={{ width: '28%' }}>
                                                {clinic.status == 'verified' ? (
                                                    <Button variant="contained" className={styles.confirmedButton}>
                                                        Đã xác nhận
                                                    </Button>
                                                ) : (
                                                    <Button variant="outlined" className={styles.unconfirmedButton}>
                                                        Chưa xác nhận
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination
                                currentPage={currentPageUnverified}
                                totalPages={totalPagesUnverified}
                                onPageChange={(page) => handlePageChange(page, 'unverified')}
                            />
                        </div>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default ClinicManagement
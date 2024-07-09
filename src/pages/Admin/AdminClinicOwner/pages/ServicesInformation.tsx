import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { mainListItems } from "../components/listItems";
import styles from "./ServicesInformation.module.css";

import {
    Box,
    Typography,
} from "@mui/material";

import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { useEffect, useState } from "react";
import { ClinicServiceRegistrationModel, getClinicServices, addClinicService } from "../../../../utils/api/ClinicOwnerUtils";
import { ClinicServiceCategoryModel, getAllCategories } from "../../../../utils/api/SystemAdminUtils";
import { NestedListItems } from "../components/NestedListMenu";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate } from "react-router-dom";

const drawerWidth: number = 270;

interface ClinicServiceInfoModel {
    clinicServiceId: string;
    name: string;
    description: string;
    price: number;
    clinicId: number;
    categoryId: number;
    available: boolean;
    removed: boolean;
}


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
const ServicesInformation = () => {
    const [open, setOpen] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [serviceList, setServiceList] = useState<ClinicServiceInfoModel[]>([]);
    const clinic = localStorage.getItem('clinic');
    const clinicId = clinic ? JSON.parse(clinic).id : 0;

    const [formData, setFormData] = useState<ClinicServiceRegistrationModel>({
        serviceCategory: 0,
        serviceName: '',
        serviceDescription: "",
        servicePrice: 0,
        clinicId: clinicId,
    });
    const [categories, setCategories] = useState<ClinicServiceCategoryModel[]>([]);

    const [textAreaContent, setTextAreaContent] = useState('');
    const [isDesDialogOpen, setIsDesDialogOpen] = useState(false);
    const [editorData, setEditorData] = useState('');

    const navigate = useNavigate();

    const handleInputDoubleClick = () => {
        setIsDesDialogOpen(true);
    };

    const handleEditorChange = (event: any, editor: { getData: () => any }) => {
        const data = editor.getData();
        setEditorData(data);
    };

    const handleTextAreaChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setTextAreaContent(e.target.value);
    };

    const handleDesSave = () => {
        setIsDesDialogOpen(false);
        setTextAreaContent(editorData);
    };

    const handleRowClick = (service: ClinicServiceInfoModel) => {
        navigate(`./${service.clinicServiceId}}`);
    }

    const fetchClinicServices = async () => {
        try {
            const services = await getClinicServices(clinicId);
            setServiceList(services);
        } catch (error) {
            console.error('Failed to fetch clinic services:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const categories = await getAllCategories();
            setCategories(categories);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    useEffect(() => {
        fetchClinicServices();
        fetchCategories();
    }, []);

    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = parseInt(e.target.value);
        setFormData({ ...formData, serviceCategory: category });
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const updatedFormData = { ...formData, serviceDescription: textAreaContent, clinicId: clinicId};
            await addClinicService(updatedFormData);
            const updatedServices = await getClinicServices(clinicId);
            setServiceList(updatedServices);
            toggleModal();
            setFormData({
                serviceCategory: 0,
                serviceName: '',
                serviceDescription: "",
                servicePrice: 0,
                clinicId: clinicId,
            });
            setTextAreaContent('');
        } catch (error) {
            console.error('Failed to add service:', error);
        }
    };
    

    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex', height: '100%' }}>
            <AppBar position="absolute" open={open}>
                <Toolbar
                    sx={{
                        pr: '24px',
                    }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        sx={{
                            marginRight: '36px',
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
                        Trang dịch vụ phòng khám
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
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
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
                    flexGrow: 1,
                    marginTop: 5.5,
                    color: '#0d47a1',
                    background: 'linear-gradient(to left, #e3f2fd, #f8fbff)',
                    height: '100vh',
                }}
            >
                <div className={styles.mainContainer}>
                    <div className={styles.tableContainer}>
                        <div className={styles.tableHeader}>Dịch vụ của phòng khám</div>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}>Tên dịch vụ</th>
                                    <th style={{ width: '20%' }}>Giá</th>
                                    <th style={{ width: '55%' }}>Mô tả</th>
                                </tr>
                            </thead>
                            <tbody>
                                {serviceList.map((service) => (
                                    <tr key={service.clinicServiceId} className={styles.tableRow} onClick={() => handleRowClick(service)}>
                                        <td>{service.name}</td>
                                        <td>{service.price}</td>
                                        <td>{service.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Button color="primary" onClick={toggleModal}>
                            Thêm dịch vụ
                        </Button>
                    </div>
                    <Modal isOpen={modalOpen} toggle={toggleModal} centered>
                        <ModalHeader toggle={toggleModal}>Thêm dịch vụ</ModalHeader>
                        <ModalBody>
                            <form onSubmit={handleFormSubmit}>
                                <FormGroup>
                                    <Label for="serviceCategory">Danh mục dịch vụ</Label>
                                    <select
                                        name="serviceCategory"
                                        id="serviceCategory"
                                        value={formData.serviceCategory}
                                        onChange={handleCategoryChange}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        <option value={0}>Chọn danh mục</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="serviceName">Tên dịch vụ</Label>
                                    <Input
                                        type="text"
                                        name="serviceName"
                                        id="serviceName"
                                        value={formData.serviceName}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="servicePrice">Giá</Label>
                                    <Input
                                        type="number"
                                        name="servicePrice"
                                        id="servicePrice"
                                        value={formData.servicePrice}
                                        onChange={handleInputChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="serviceDescription">Mô tả</Label>
                                    <Input
                                        type="textarea"
                                        name="serviceDescription"
                                        id="serviceDescription"
                                        value={textAreaContent}
                                        onChange={handleTextAreaChange}
                                        onDoubleClick={handleInputDoubleClick}
                                    />
                                </FormGroup>
                                <div className={styles.buttonContainer}>
                                    <Button type="submit" color="primary" className="submit-button">
                                        Lưu
                                    </Button>
                                    <Button type="button" color="secondary" onClick={toggleModal} className="cancel-button">
                                        Hủy
                                    </Button>
                                </div>

                            </form>
                        </ModalBody>
                    </Modal>

                    <Dialog
                        open={isDesDialogOpen}
                        onClose={() => setIsDesDialogOpen(false)}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle>Sửa mô tả</DialogTitle>
                        <DialogContent>
                            <CKEditor
                                editor={ClassicEditor}
                                data={editorData}
                                onChange={handleEditorChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setIsDesDialogOpen(false)} color="secondary">
                                Hủy
                            </Button>
                            <Button onClick={handleDesSave} color="primary">
                                Lưu
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </Box>
        </Box>
    );
};

export default ServicesInformation

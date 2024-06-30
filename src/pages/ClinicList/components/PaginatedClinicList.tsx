
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Pagination, Divider, Typography, Paper, TextField, IconButton } from '@mui/material';
import { SearchIcon } from '@chakra-ui/icons';
import styles from './PaginatedClinicList.module.css'; // Import CSS styles
import { ClinicToDisplay } from '../../../utils/interfaces/ClinicRegister/Clinic';
import { getAllClinics } from '../../../utils/api/MiscUtils';

const clinicPerPage = 5;

const PaginatedClinicList = () => {
    const [clinics, setClinics] = useState<ClinicToDisplay[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(1);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchTermParams = queryParams.get('search');

    useEffect(() => {
        setSearchTerm(searchTermParams || '');
    }, [searchTermParams]);

    const fetchClinics = async () => {
        try {
            const { content, totalCount } = await getAllClinics(searchTerm, clinicPerPage, currentPage);
            console.log(content);
            setClinics(content);
            setNumberOfPages(Math.ceil(totalCount / clinicPerPage));
        } catch (error) {
            console.error('Error fetching clinics:', error);
        }
    };

    const handleSearch = () => {
        fetchClinics();
    };

    useEffect(() => {
        fetchClinics();
    }, [currentPage, searchTerm]);

    const clinicsToDisplay = clinics.map(clinic => (
        <Box key={clinic.id} sx={{ display: 'flex', flexDirection: 'column', margin: '15px 0' }}>
            <Box className={styles.clinicBox}>
                <img src={''} alt={clinic.name} className={styles.clinicImage} />
                <Box sx={{ flexGrow: 1, marginLeft: '5%' }}>
                    <Link to={`/clinic/${clinic.id}`} className={styles.clinicTitle}>
                        <Typography variant="h5" component="div" gutterBottom>
                            {clinic.name}
                        </Typography>
                    </Link>
                    <Typography variant="body1" component="div" className={styles.clinicAddress} gutterBottom>
                        Địa chỉ: {clinic.address}
                    </Typography>
                </Box>
            </Box>
            <Divider className={styles.clinicDivider} />
        </Box>
    ));

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5, paddingTop: '8em', paddingBottom: '5em' }} className={styles.container}>
            <Paper sx={{ width: '65%', margin: '0 auto', display: 'flex', position: 'relative' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={searchTerm}
                    placeholder='Tìm kiếm theo tên, địa chỉ phòng khám'
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ margin: '0 auto' }}
                    className={styles.searchBar} // Apply CSS class from module
                />
                <IconButton
                    onClick={handleSearch}
                    aria-label="search"
                    sx={{ color: "#000", position: 'absolute', right: '15px', top: '0', bottom: '0', margin: 'auto' }}
                    className={styles.searchIconButton} // Apply CSS class from module
                >
                    <SearchIcon />
                </IconButton>
            </Paper>

            <Paper sx={{ width: '65%', margin: '20px auto 0 auto', padding: '3em', borderRadius: '1em', border: '.25px solid black' }}>
                <Box sx={{ width: '100%', margin: '20px auto 0 auto' }}>
                    {clinicsToDisplay}
                </Box>
            </Paper>
            <Box sx={{ width: '80%', margin: '0 auto' }}>
                <Pagination
                    sx={{ width: 'auto', display: 'flex', justifyContent: 'center' }}
                    count={numberOfPages}
                    color="primary"
                    onChange={(event, page) => setCurrentPage(page)}
                />
            </Box>
        </Box>
    );
};

export default PaginatedClinicList;

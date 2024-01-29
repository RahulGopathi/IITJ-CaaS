import { styled } from '@mui/material/styles';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Card,
    Chip,
    CardActions,
    CardContent,
    NativeSelect,
    Paper,
    Tab,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { LoadingButton, TabContext, TabList, TabPanel } from '@mui/lab';
import Iconify from '../components/Iconify';
import useAxios from '../utils/useAxios.js';
import toast from 'react-hot-toast';

const StyledDiv = styled('div')(() => ({
    position: 'absolute',
    marginTop: -22,
    marginLeft: 400,
    top: 90,
}));

const StyledTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#00AB55',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#B0B9C2',
        },
        '&:hover fieldset': {
            borderColor: '#000',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#00AB55',
        },
    },
});

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

const ButtonStyled = styled(LoadingButton)(() => ({
    fontWeight: 700,
    marginRight: 30,
    textTransform: 'none',
    backgroundColor: '#00AB55',
    boxShadow: '0 8px 16px 0 rgba(0, 171, 85, 0.24)',
    '&:hover': {
        backgroundColor: '#007B55',
    },
}));

const PodDetail = () => {
    const date = new Date();
    const { state } = useLocation();
    console.log(state);
    const navigate = useNavigate();
    const api = useAxios();
    const [value, setValue] = useState('1');
    const [podLogs, setPodLogs] = useState("");
    const [logsUpdatedAt, setLogsUpdatedAt] = useState("");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleFetchLogs = async () => {
        try {
            const logsPayload = {
                pod_name: state.pod.name,
                namespace: 'default',
                container_name: state.pod.container_name,
            };
            const response = await api.post(`/fetch_logs/`, JSON.stringify(logsPayload));
            setPodLogs(response.data.logs);
            const timeNow = date.getHours()
                + ':' + date.getMinutes()
                + ":" + date.getSeconds();
            setLogsUpdatedAt(timeNow);
        } catch (error) {
            console.log(error);
            toast.error('Something went wrong');
        }
    }

    return (
        <StyledDiv>
            <h1>Pod: {state.pod.name}</h1>
            <Box sx={{ width: 1000, typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList
                            onChange={handleChange}
                            TabIndicatorProps={{
                                style: { background: '#00AB55', height: 3 },
                            }}
                        >
                            <Tab label="Logs" value="1" />
                            <Tab label="Exec" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <Stack spacing={3}>
                            {podLogs ? (
                                <Paper
                                    sx={{
                                        width: '100%',
                                        height: 500,
                                        overflow: 'auto',
                                        p: 2,
                                    }}
                                >
                                    <Typography variant="h6" gutterBottom component="div">
                                        Logs
                                    </Typography>
                                    <pre>{podLogs}</pre>
                                </Paper>
                            ) : (
                                <ButtonStyled
                                    variant="contained"
                                    onClick={handleFetchLogs}
                                    style={{ width: 150 }}
                                >
                                    Fetch Logs
                                </ButtonStyled>
                            )}{' '}
                            <Typography variant="body1" gutterBottom component="div">
                                Logs Updated At: {logsUpdatedAt}
                            </Typography>
                            <ButtonStyled
                                variant="contained"
                                style={{ width: 150 }}
                                onClick={handleFetchLogs}
                            >
                                Update Logs
                            </ButtonStyled>

                        </Stack>
                    </TabPanel>
                    <TabPanel value="2">
                        <Stack spacing={3}>
                            <h1>Exec</h1>
                        </Stack>
                    </TabPanel>
                </TabContext>
            </Box>
        </StyledDiv>
    );
};

export default PodDetail;
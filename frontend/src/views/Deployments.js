import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios.js';
import { DataGrid } from '@mui/x-data-grid';
import {
    Chip,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Iconify from '../components/Iconify';
import toast from 'react-hot-toast';
import CreateDeployment from '../components/createDeployment.js';

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

const Deployments = () => {
    const navigate = useNavigate();

    const api = useAxios();
    const [showPodForm, setShowPodForm] = useState(false);
    const [pods, setPods] = useState([]);

    const LabelsChips = (params) => {
        const pod_labels = [];
        for (const [key, value] of Object.entries(params.row.labels)) {
            pod_labels.push({
                id: key,
                value: value,
            });
        }
        console.log(pod_labels);
        return (
            <div>
                {pod_labels.map((label) => (
                    <>
                        <Chip
                            key={label.id}
                            label={`${label.id}: ${label.value}`}
                            size="small"
                            variant="outlined"

                            style={{
                                color: '00ab55',
                                backgroundColor: '#DCF1D7',
                                border: 'none',
                                borderRadius: 5,
                                margin: 2,
                                padding: 2,
                            }}
                        />
                        <br />
                    </>
                ))}
            </div>
        );
    };

    const StatusChip = (params) => {
        return (
            <div>
                {params.row.status === 'Running' && (
                    <Chip
                        label="Running"
                        size="small"
                        variant="outlined"
                        style={{
                            color: '#00ab55',
                            backgroundColor: '#DCF1D7',
                            border: 'none',
                            borderRadius: 5,
                        }}
                    />
                )}
                {params.row.status === 'Pending' && (
                    <Chip
                        label="Pending"
                        size="small"
                        variant="outlined"
                        style={{
                            color: '#B72136',
                            backgroundColor: '#F7DBDB',
                            border: 'none',
                            borderRadius: 5,
                        }}
                    />
                )}
                {params.row.status === 'ContainerCreating' && (
                    <Chip
                        label="ContainerCreating"
                        size="small"
                        variant="outlined"
                        style={{
                            color: '#000',
                            backgroundColor: 'rgb(249 222 141)',
                            border: 'none',
                            borderRadius: 5,
                        }}
                    />
                )}
            </div>
        );
    };

    const MoreOptionsButton = (params) => {
        const [anchorEl, setAnchorEl] = useState(null);
        const open = Boolean(anchorEl);
        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            setAnchorEl(null);
        };

        return (
            <div>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleClick}
                >
                    <Iconify icon={'mdi:dots-vertical'} />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            width: 144,
                            overflow: 'visible',
                            boxShadow:
                                'rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) -20px 20px 40px -4px',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem>
                        <Iconify
                            height={20}
                            width={20}
                            sx={{ mr: 1 }}
                            icon={'eva:edit-fill'}
                        ></Iconify>
                        <Typography variant={'body2'}>Logs</Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                        onClick={(e) => {
                            navigate('/pods/podDetails', {
                                state: { pod: params.row },
                            });
                        }}
                    >
                        <Iconify
                            color={'green'}
                            height={20}
                            width={20}
                            sx={{ mr: 1 }}
                            icon={'eva:checkmark-circle-2-outline'}
                        ></Iconify>
                        <Typography color={'green'} variant={'body'}>
                            Exec
                        </Typography>
                    </MenuItem>
                    <Divider />
                    <MenuItem
                    // onClick={(e) => {
                    //     deleteCandidate(e);
                    // }}
                    >
                        <Iconify
                            color={'red'}
                            height={20}
                            width={20}
                            sx={{ mr: 1 }}
                            icon={'eva:trash-2-outline'}
                        ></Iconify>
                        <Typography color={'red'} variant={'body2'}>
                            Delete
                        </Typography>
                    </MenuItem>
                </Menu>
            </div>
        );
    };

    const columns = [
        {
            field: 'name',
            headerName: 'Name',
            description: '',
            sortable: false,
            width: 150,
            valueGetter: (params) =>
                `${params.row.name}`,
        },
        {
            field: 'image',
            headerName: 'Image',
            width: 150,
            valueGetter: (params) =>
                `${params.row.image}`,
            editable: false,
        },
        {
            field: 'labels',
            headerName: 'Labels',
            width: 200,
            renderCell: LabelsChips,
            disableClickEventBubbling: true,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 200,
            renderCell: StatusChip,
            disableClickEventBubbling: true,
        },
        {
            field: 'restarts',
            headerName: 'Restarts',
            width: 100,
            valueGetter: (params) =>
                `${params.row.restarts}`,
            disableClickEventBubbling: true,
        },
        {
            field: 'moreOptions',
            headerName: '',
            width: 2,
            renderCell: MoreOptionsButton,
            disableClickEventBubbling: true,
        },
    ];

    useEffect(() => {
        // fetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchData = async () => {
        try {
            const labelJson = {
                "label_selector": "project=" + JSON.parse(localStorage.getItem('current_project')).name
            }
            const response = await api.post('/list_pods/', JSON.stringify(labelJson));
            var resp_pods = response.data["pods"];
            for (var i = 0; i < resp_pods.length; i++) {
                resp_pods[i].id = i + 1;
            }
            console.log(resp_pods);
            setPods(resp_pods);
        } catch {
            setPods('Something went wrong');
        }
    };

    const handleDeploymentCreation = async (success) => {
        if (success) {
            setShowPodForm(false);
        }
    }

    return (
        <StyledDiv>
            <Stack spacing={3} direction={'row'}>
                <h1>Your Deployments</h1>
                {showPodForm ? (
                    <div>
                        <ButtonStyled variant="contained" size="small" style={{ height: 40, marginTop: 17 }} onClick={() => { setShowPodForm(false) }} >
                            Cancel
                        </ButtonStyled>
                    </div>
                ) : (
                    <div>
                        <ButtonStyled variant="contained" size="small" style={{ height: 40, marginTop: 17 }} onClick={() => { setShowPodForm(true) }} >
                            Create Deployment
                        </ButtonStyled>
                    </div>
                )}
            </Stack>

            <div style={{ height: 1000, width: 910, textAlign: 'center' }}>
                {showPodForm ? (
                    <CreateDeployment handleDeploymentCreationChanges={handleDeploymentCreation} />
                ) : (
                    <div>
                        {!pods ? <h1>Loading...</h1>
                            :
                            <h1>Deployments</h1>
                            // <DataGrid
                            //     style={{ height: 500 }}
                            //     rows={pods}
                            //     columns={columns}
                            //     pageSize={8}
                            //     rowsPerPageOptions={[5]}
                            //     checkboxSelection
                            //     disableSelectionOnClick
                            // />
                        }
                    </div>
                )}
            </div>
        </StyledDiv>
    );
};

export default Deployments;
import { styled } from '@mui/material/styles';
import { useEffect, useState, useContext } from 'react';
import {
    Button,
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
import Iconify from './Iconify';
import AuthContext from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios';
import toast from 'react-hot-toast';

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

const AdvancedOptionsButtonStyled = styled(Button)(() => ({
    fontWeight: 700,
    marginRight: 30,
    textTransform: 'none',
    color: '#00AB55',
}));

export default function CreateDeployment({ handleDeploymentCreationChanges }) {
    const navigate = useNavigate();
    const api = useAxios();
    const { user } = useContext(AuthContext);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [labels, setLabels] = useState([]);
    const [deploymentForm, setDeploymentForm] = useState({
        deploymentName: '',
        githubUrl: '',
        githubBranch: 'master',
        customDomain: '',
        labels: [],
    });
    const current_project = JSON.parse(localStorage.getItem('current_project'));

    const handleAddLabel = () => {
        if (labels.length < 3) {
            setLabels([...labels, { key: '', value: '' }]);
        }
    };

    const handleDeleteLabel = (index) => {
        const updatedLabels = [...labels];
        updatedLabels.splice(index, 1);
        setLabels(updatedLabels);
    };

    const handleCreateDeployment = async () => {
        const ownerLabel = {
            key: 'owner',
            value: user.username,
        };
        const projectLabel = {
            key: 'project',
            value: current_project.name,
        };
        const updated_labels = [...labels, ownerLabel, projectLabel];
        const deployment = {
            owner: user.username,
            deployment_name: deploymentForm.deploymentName,
            repo_url: deploymentForm.githubUrl,
            branch_name: deploymentForm.githubBranch,
            custom_domain: deploymentForm.customDomain,
            labels: updated_labels,
        };
        console.log(deployment);
        try {
            const response = await api.post('/create_deployment/', JSON.stringify(deployment));
            const data = await response.data;
            console.log(data);
            if (response.status === 201) {
                toast.success('Deployment created successfully');
                handleDeploymentCreationChanges(true);
            }
        } catch (error) {
            toast.error(error);
            console.log(error);
        }
    }

    return (
        <div>
            <Stack spacing={3}>
                <Stack direction="column" spacing={3}>
                    <StyledTextField
                        required
                        label="Deployment Name"
                        variant="outlined"
                        sx={{
                            width: 500,
                            typography: 'body1',
                            input: { color: '#000' },
                        }}
                        value={deploymentForm.deploymentName}
                        onChange={(e) =>
                            setDeploymentForm({
                                ...deploymentForm,
                                deploymentName: e.target.value,
                            })
                        }
                    />
                    <StyledTextField
                        required
                        label="Github Repository URL"
                        variant="outlined"
                        helperText="Enter the public github repository url that can be cloned to create the deployment"
                        sx={{
                            width: 500,
                            typography: 'body1',
                            input: { color: '#000' },
                        }}
                        value={deploymentForm.githubUrl}
                        onChange={(e) =>
                            setDeploymentForm({
                                ...deploymentForm,
                                githubUrl: e.target.value,
                            })
                        }
                    />
                    <StyledTextField
                        required
                        label='Github Branch Name'
                        variant="outlined"
                        helperText="Enter the number of the branch where your static files are present"
                        sx={{
                            width: 500,
                            typography: 'body1',
                            input: { color: '#000' },
                        }}
                        value={deploymentForm.githubBranch}
                        onChange={(e) =>
                            setDeploymentForm({
                                ...deploymentForm,
                                githubBranch: e.target.value,
                            })
                        }
                    />
                    <StyledTextField
                        label='Custom Domain Name'
                        variant="outlined"
                        sx={{
                            width: 500,
                            typography: 'body1',
                            input: { color: '#000' },
                        }}
                        value={deploymentForm.customDomain}
                        onChange={(e) =>
                            setDeploymentForm({
                                ...deploymentForm,
                                customDomain: e.target.value,
                            })
                        }
                    />
                </Stack>
                <Stack direction="column" spacing={3}>
                    {showAdvancedOptions && (
                        <>
                            <Typography variant="h6" align='left'>Labels</Typography>
                            {labels.map((label, index) => (
                                <Stack direction="row" spacing={1} key={index}>
                                    <StyledTextField
                                        label="Key"
                                        variant="outlined"
                                        value={label.key}
                                        onChange={(e) => {
                                            const updatedLabels = [...labels];
                                            updatedLabels[index].key = e.target.value;
                                            setLabels(updatedLabels);
                                        }}
                                        sx={{ width: 150 }}
                                    />
                                    <StyledTextField
                                        label="Value"
                                        variant="outlined"
                                        value={label.value}
                                        onChange={(e) => {
                                            const updatedLabels = [...labels];
                                            updatedLabels[index].value = e.target.value;
                                            setLabels(updatedLabels);
                                        }}
                                        sx={{ width: 150 }}
                                    />
                                    <IconButton disabled={labels.length === 1} onClick={() => handleDeleteLabel(index)}>
                                        <Iconify icon="mdi:delete" />
                                    </IconButton>
                                </Stack>
                            ))}
                            <ButtonStyled variant="contained" size="small" onClick={handleAddLabel} style={{ width: 100 }} disabled={labels.length >= 3}>
                                Add Label
                            </ButtonStyled>
                        </>
                    )}

                    {/* Toggle Advanced Options Button */}
                    <AdvancedOptionsButtonStyled variant='text' size='small' style={{ width: 200 }} onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
                        {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
                    </AdvancedOptionsButtonStyled>
                </Stack>
                <ButtonStyled variant="contained" size="large" style={{ width: 500 }} onClick={handleCreateDeployment}>
                    Create Deployment
                </ButtonStyled>
            </Stack>
        </div>
    )
}
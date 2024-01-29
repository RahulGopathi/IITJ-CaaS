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

export default function CreatePod({ handlePodCreationChanges }) {
    const navigate = useNavigate();
    const api = useAxios();
    const { user } = useContext(AuthContext);
    const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
    const [labels, setLabels] = useState([]);
    const [podForm, setPodForm] = useState({
        podName: '',
        podDescription: '',
        containerImage: '',
        containerPort: '',
        noOfPods: 1,
        cpuRequirement: '',
        ramRequirement: '',
        runCommand: '',
        runCommandArgs: '',
        envVariables: [],
        labels: [],
    });
    const [envVariables, setEnvVariables] = useState([]);
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

    const handleAddEnvVariable = () => {
        setEnvVariables([...envVariables, { key: '', value: '' }]);
    };

    const handleDeleteEnvVariable = (index) => {
        const updatedEnvVariables = [...envVariables];
        updatedEnvVariables.splice(index, 1);
        setEnvVariables(updatedEnvVariables);
    };

    const handleCreatePod = async () => {
        const ownerLabel = {
            key: 'owner',
            value: user.username,
        };
        const projectLabel = {
            key: 'project',
            value: current_project.name,
        };
        const updated_labels = [...labels, ownerLabel, projectLabel];
        const pod = {
            project_id: current_project.id,
            name: podForm.podName,
            description: podForm.podDescription,
            container_image: podForm.containerImage,
            container_port: podForm.containerPort,
            no_of_pods: podForm.noOfPods,
            cpu_requirement: podForm.cpuRequirement,
            ram_requirement: podForm.ramRequirement,
            run_command: podForm.runCommand,
            run_command_args: podForm.runCommandArgs,
            env_variables: envVariables,
            labels: updated_labels,
        };
        console.log(pod);
        try {
            const response = await api.post('/create_resources/', JSON.stringify(pod));
            const data = await response.data;
            console.log(data);
            if (response.status === 201) {
                toast.success('Pod created successfully');
                handlePodCreationChanges(true);
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
                        label="Pod Name"
                        variant="outlined"
                        sx={{
                            width: 500,
                            typography: 'body1',
                            input: { color: '#000' },
                        }}
                        value={podForm.podName}
                        onChange={(e) =>
                            setPodForm({
                                ...podForm,
                                podName: e.target.value,
                            })
                        }
                    />
                    <StyledTextField
                        required
                        label="Container Image"
                        variant="outlined"
                        helperText="Enter the docker container image name that can be pulled from the docker hub"
                        sx={{
                            width: 500,
                            typography: 'body1',
                            input: { color: '#000' },
                        }}
                        value={podForm.containerImage}
                        onChange={(e) =>
                            setPodForm({
                                ...podForm,
                                containerImage: e.target.value,
                            })
                        }
                    />
                    <StyledTextField
                        required
                        label='Number of Pods'
                        variant="outlined"
                        helperText="Enter the number of pods you want to create"
                        type='number'
                        sx={{
                            width: 500,
                            typography: 'body1',
                            input: { color: '#000' },
                        }}
                        value={podForm.noOfPods}
                        onChange={(e) =>
                            setPodForm({
                                ...podForm,
                                noOfPods: e.target.value,
                            })
                        }
                    />
                    <StyledTextField
                        required
                        label='Container Port'
                        variant="outlined"
                        type='number'
                        sx={{
                            width: 500,
                            typography: 'body1',
                            input: { color: '#000' },
                        }}
                        value={podForm.containerPort}
                        onChange={(e) =>
                            setPodForm({
                                ...podForm,
                                containerPort: e.target.value,
                            })
                        }
                    />
                    <StyledTextField
                        label="Pod Description"
                        variant="outlined"
                        multiline
                        rows={3}
                        sx={{
                            width: 500,
                            typography: 'body1',
                            input: { color: '#000' },
                        }}
                        value={podForm.podDescription}
                        onChange={(e) =>
                            setPodForm({
                                ...podForm,
                                podDescription: e.target.value,
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

                            {/* CPU and RAM Requirements */}
                            <Typography variant="h6" align='left'>Resource Requirements</Typography>
                            <Stack spacing={3} direction={"row"}>
                                <StyledTextField
                                    label="CPU Requirement(cores)"
                                    type='number'
                                    variant="outlined"
                                    value={podForm.cpuRequirement}
                                    onChange={(e) => setPodForm({ ...podForm, cpuRequirement: e.target.value })}
                                    sx={{ width: 240 }}
                                />
                                <StyledTextField
                                    label="RAM Requirement(MiB)"
                                    type='number'
                                    variant="outlined"
                                    value={podForm.ramRequirement}
                                    onChange={(e) => setPodForm({ ...podForm, ramRequirement: e.target.value })}
                                    sx={{ width: 240 }}
                                />
                            </Stack>

                            {/* Run Command and Args */}
                            <StyledTextField
                                label="Run Command"
                                variant="outlined"
                                value={podForm.runCommand}
                                onChange={(e) => setPodForm({ ...podForm, runCommand: e.target.value })}
                                sx={{ width: 500 }}
                            />
                            <StyledTextField
                                label="Run Command Args"
                                variant="outlined"
                                value={podForm.runCommandArgs}
                                onChange={(e) => setPodForm({ ...podForm, runCommandArgs: e.target.value })}
                                sx={{ width: 500 }}
                            />

                            {/* Environmental Variables */}
                            <Typography variant="h6" align='left'>Environmental Variables</Typography>
                            {envVariables.map((envVar, index) => (
                                <Stack direction="row" spacing={1} key={index}>
                                    <StyledTextField
                                        label="Key"
                                        variant="outlined"
                                        value={envVar.key}
                                        onChange={(e) => {
                                            const updatedEnvVariables = [...envVariables];
                                            updatedEnvVariables[index].key = e.target.value;
                                            setEnvVariables(updatedEnvVariables);
                                        }}
                                        sx={{ width: 150 }}
                                    />
                                    <StyledTextField
                                        label="Value"
                                        variant="outlined"
                                        value={envVar.value}
                                        onChange={(e) => {
                                            const updatedEnvVariables = [...envVariables];
                                            updatedEnvVariables[index].value = e.target.value;
                                            setEnvVariables(updatedEnvVariables);
                                        }}
                                        sx={{ width: 150 }}
                                    />
                                    <IconButton disabled={envVariables.length === 1} onClick={() => handleDeleteEnvVariable(index)}>
                                        <Iconify icon="mdi:delete" />
                                    </IconButton>
                                </Stack>
                            ))}
                            <ButtonStyled variant="contained" size="small" onClick={handleAddEnvVariable} style={{ width: 200 }}>
                                Add Env Variable
                            </ButtonStyled>
                        </>
                    )}

                    {/* Toggle Advanced Options Button */}
                    <AdvancedOptionsButtonStyled variant='text' size='small' style={{ width: 200 }} onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}>
                        {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
                    </AdvancedOptionsButtonStyled>
                </Stack>
                <ButtonStyled variant="contained" size="large" style={{ width: 500 }} onClick={handleCreatePod}>
                    Create Pod
                </ButtonStyled>
            </Stack>
        </div>
    )
}
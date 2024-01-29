import { styled } from '@mui/material/styles';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import useAxios from '../utils/useAxios.js';
import {
    Chip,
    MenuItem,
    TextField,
    Stack,
    Select,
    Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MuiChipsInput } from 'mui-chips-input'
import toast from 'react-hot-toast';

const StyledDiv = styled('div')(() => ({
    position: 'absolute',
    marginTop: -22,
    marginLeft: 400,
    top: 90,
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

const StyledMuiChipsInput = styled(MuiChipsInput)({
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

const CreateProject = () => {
    const api = useAxios();
    const navigate = useNavigate();
    const { user, setProject } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        project_name: '',
        project_description: '',
        share_with: [],
    });
    const [shareWithEmails, setshareWithEmails] = useState([])
    const projectDescriptionMaxChars = 200;

    const handleprojectDescriptionChange = (e) => {
        const newText = e.target.value;

        if (newText.length <= projectDescriptionMaxChars) {
            setFormData({ ...formData, project_description: newText });
        }
    };

    const getHelperText = () => {
        const remainingChars = projectDescriptionMaxChars - formData.project_description.length;
        if (remainingChars >= 0) {
            return (
                <Typography variant="body2" fontWeight="bold">
                    {remainingChars} characters remaining.
                </Typography>
            );
        } else {
            return (
                <Typography variant="body2" fontWeight="bold">
                    Exceeded the limit by ${Math.abs(remainingChars)} characters.
                </Typography>
            );
        }
    };

    const handleShareWithEmailsChange = (shareWithEmailsInput) => {
        for (let i = 0; i < shareWithEmailsInput.length; i++) {
            if (!validateEmail(shareWithEmailsInput[i])) {
                toast.error('Invalid email address');
                return;
            }
            else if (shareWithEmailsInput[i] === user.email) {
                toast.error('You cannot share with yourself');
                return;
            }
            else {
                for (let j = 0; j < shareWithEmailsInput.length; j++) {
                    if (i !== j && shareWithEmailsInput[i] === shareWithEmailsInput[j]) {
                        toast.error('Duplicate email address');
                        return;
                    }
                }
            }
        }
        setshareWithEmails(shareWithEmailsInput);
        setFormData({ ...formData, share_with: shareWithEmailsInput });
    }

    const validateEmail = (email) => {
        // Add your email validation logic here
        const regex = /^[^\s@]+@iitj\.ac\.in$/;
        return regex.test(email);
    };

    const handleProjectSubmit = async () => {
        if (formData.project_name === '') {
            toast.error('Project name cannot be empty');
            return;
        }
        else {
            const response = await api.post('/projects/', {
                name: formData.project_name,
                description: formData.project_description,
                share_with: formData.share_with,
            });
            const data = await response.data;
            console.log(data);

            if (response.status === 201) {
                localStorage.setItem('current_project', JSON.stringify(data));
                setProject(data);
                toast.success('Project created successfully');
                navigate('/');
            } else {
                toast.error(data.detail);
            }
        }
    }

    return (
        <StyledDiv>
            <h1>Create Your Project</h1>
            <Stack spacing={3}>
                <Stack direction="column" spacing={3}>
                    <StyledTextField
                        required
                        label="Project Name"
                        value={formData.project_name}
                        onChange={(e) =>
                            setFormData({ ...formData, project_name: e.target.value })
                        }
                        variant="outlined"
                        sx={{
                            width: 500,
                            typography: 'body1',
                            input: { color: '#000' },
                        }}
                    />
                    <StyledTextField
                        label="Project Description"
                        variant="outlined"
                        helperText={getHelperText()}
                        value={formData.project_description}
                        onChange={handleprojectDescriptionChange}
                        multiline
                        rows={5}
                        sx={{
                            width: 500,
                            typography: 'body1',
                            input: { color: '#000' },
                        }}
                    />
                    <StyledMuiChipsInput
                        label="Share With"
                        placeholder='Enter email address and press enter'
                        helperText="Double click to edit email"
                        value={shareWithEmails}
                        onChange={handleShareWithEmailsChange} />

                </Stack>
                <ButtonStyled variant="contained" size="large" onClick={handleProjectSubmit}>
                    Create Project
                </ButtonStyled>
            </Stack>
        </StyledDiv>
    );
};

export default CreateProject;

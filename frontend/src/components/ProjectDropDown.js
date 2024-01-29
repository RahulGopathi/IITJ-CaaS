import { Autocomplete, TextField, Tooltip, Typography } from '@mui/material'
import { styled } from '@mui/material/styles';
import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import useAxios from '../utils/useAxios';
import { LoadingButton } from '@mui/lab';
import Iconify from './Iconify';

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

export default function ProjectDropDown() {
    const navigate = useNavigate();
    const { project, setProject, allProjects } = useContext(AuthContext);
    const [currentProject, setCurrentProject] = useState(localStorage.getItem('current_project') ? JSON.parse(localStorage.getItem('current_project')) : {});

    const handleProjectChange = (event, value) => {
        setCurrentProject(value);
        localStorage.setItem('current_project', JSON.stringify(value));
        setProject(value);
    }

    return (
        (currentProject ?
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                <Autocomplete
                    disablePortal
                    required
                    variant="outlined"
                    options={allProjects}
                    value={currentProject}
                    onChange={handleProjectChange}
                    getOptionLabel={(option) => option.name}
                    sx={{
                        width: 300,
                        height: 60,
                        paddingTop: 1,
                        typography: 'body1',
                        input: { color: '#000' },
                    }}
                    renderInput={(params) => <StyledTextField {...params} label="Project" />}
                    renderOption={(props, option) => (
                        <li {...props}>
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Typography variant='body1'>{option.name}</Typography>
                                <Typography variant='body2' sx={{ color: 'gray' }}>{option.project_nickname}</Typography>
                            </div>
                        </li>
                    )
                    }
                />
                <Iconify height={64} width={64} title={"Create Project"} sx={{ 'paddingLeft': 2 }} icon={'zondicons:add-solid'} onClick={() => { navigate("/createProject"); }} />
            </div > :
            <div>
                <Typography variant='body1'>No projects found</Typography>
                <ButtonStyled
                    variant="contained"
                    size="large"
                    onClick={() => { window.location.href = '/createProject' }}
                >
                    Create Project
                </ButtonStyled>
            </div>
        )

    )
}
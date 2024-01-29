import { styled } from '@mui/material/styles';
import { useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../utils/useAxios.js';
import AuthContext from '../contexts/AuthContext';
import {
  MenuItem,
  TextField,
  Stack,
  Select
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
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

const StyledSelectField = styled(Select)({
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

const Dashboard = () => {
  const { setCabDetails } = useContext(AuthContext);
  const navigate = useNavigate();

  const api = useAxios();

  return (
    <StyledDiv>
      <h1>Pods</h1>
      <div style={{ height: 550, width: 870, textAlign: 'center' }}>
        <Stack spacing={3}>
          <Stack direction="row" spacing={3}>

          </Stack>
        </Stack>
      </div>
    </StyledDiv>
  );
};

export default Dashboard;

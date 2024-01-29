import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Box,
  Link,
  Container,
  InputAdornment,
  IconButton,
  TextField,
  Typography,
  Stack,
} from '@mui/material';
import Image from '../components/Image';
import Iconify from '../components/Iconify';
import { useState, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import { LoadingButton } from '@mui/lab';

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const SectionStyle = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '70vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

const ButtonStyled = styled(LoadingButton)(() => ({
  fontWeight: 700,
  textTransform: 'none',
  backgroundColor: '#00AB55',
  boxShadow: '0 8px 16px 0 rgba(0, 171, 85, 0.24)',
  '&:hover': {
    backgroundColor: '#007B55',
  },
}));

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    registerUser(username, password, password2);
  };

  return (
    <RootStyle>
      <SectionStyle>
        <Typography
          variant="h4"
          sx={{ px: 10, mt: 15, mb: 5, fontWeight: 500, fontSize: 25 }}
        >
          Manage you workloads more effectively with IITJ CaaS.
        </Typography>
        <Image
          sx={{ mx: 5 }}
          alt="register"
          src="https://minimals.cc/assets/illustrations/illustration_register.png"
        />
      </SectionStyle>

      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h4"
                gutterBottom
                sx={{ fontWeight: 600, fontSize: 35 }}
              >
                Get started absolutely free.
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Enter your details below.
              </Typography>
            </Box>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Username"
                id="username"
                variant="outlined"
                onChange={(e) => setUsername(e.target.value)}
                color="success"
                required
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                color="success"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        <Iconify
                          icon={
                            showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setPassword2(e.target.value)}
                error={password2 !== password}
                helperText={
                  password2 !== password ? 'Passwords do not match' : ''
                }
                id="confirm-password"
                color="success"
                required
              />

              <ButtonStyled size="large" type="submit" variant="contained">
                Register
              </ButtonStyled>
            </Stack>
          </form>

          <Typography variant="body2" sx={{ mt: 3, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link
              variant="subtitle2"
              to="/login"
              component={RouterLink}
              underline="hover"
              color="#00AB55"
              sx={{ fontWeight: 700 }}
            >
              Login
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}

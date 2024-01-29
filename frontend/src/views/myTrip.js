import { styled } from '@mui/material/styles';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const StyledDiv = styled('div')(() => ({
  position: 'absolute',
  marginTop: -22,
  marginLeft: 400,
  top: 90,
}));

const MyTrip = () => {
  const { user, cabDetails } = useContext(AuthContext);

  return (
    <StyledDiv>
      <h1>Your Trip Details</h1>
      <pre>Start Time: {cabDetails.start_time}</pre>
      <pre>Name: {user.username}</pre>
      <pre>Cab ID: {cabDetails.cab}</pre>
      <pre>Start Location Latitude: {cabDetails.start_location_latitude}</pre>
      <pre>Start Location Longitude: {cabDetails.start_location_longitude}</pre>
      <pre>End Location Latitude: {cabDetails.end_location_latitude}</pre>
      <pre>End Location Longitude: {cabDetails.end_location_longitude}</pre>
    </StyledDiv>
  );
};

export default MyTrip;

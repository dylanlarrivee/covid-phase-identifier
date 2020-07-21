import React, {useState} from 'react';
import axios from "axios";


// import GeocodeApi from './components/Geocode'

const ZipCodeResults = (props) => {
    if (props.usState === '' && props.zipRequestStatus === '') {
        return (
        <div>
        </div>
        )
    }
    else if (props.usState === 'WA' && props.zipRequestStatus === 'OK') {
        return (
            <div>
            Your county: {props.county }
        </div>
        )
    } else if (props.zipRequestStatus !== 'OK') {
        return (
            <div>
                   Please enter a valid zip code
            </div>
        )
    } else {
        return (
            <div>
                   Sorry, currently we only support zip codes in Washington state
            </div>
        )
    }
    
}

const Main = (props) => {
    const [county, setCounty] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [usState, setUsState] = useState("");
    const [zipRequestStatus, setZipRequestStatus] = useState("");

  const handleChange = (evt) => {
    const name = evt.target.name;
    const newValue = evt.target.value;
    setZipCode(newValue);
  };

  const GEOCODER_API_KEY = 'AIzaSyAppkHfwhcWPm8hl7VunuoPYhQrqpK2K4E'; 

  const getLocation = () => {
    axios({
      url:
        "https://maps.googleapis.com/maps/api/geocode/json?key=" +
        GEOCODER_API_KEY +
        "&components=postal_code:" +
        zipCode,
      method: "GET",
      // data: payload,
    })
      .then((data) => {
          console.log("address data", JSON.stringify(data.data.status));
          setZipRequestStatus(data.data.status);
          if (data.data.status === 'OK') {
            setCounty(data.data.results[0].address_components[2].long_name);
            setUsState(data.data.results[0].address_components[3].short_name);
          }
    
          console.log("usState", usState);
          console.log("zipRequestStatus", zipRequestStatus);
          console.log("county", county);

      })
      .catch(() => {});
  };

  return (
    <div>
      <form>
        Enter your zip code
        <input
          type="text"
          name="zipCode"
          value={zipCode}
          onChange={handleChange}
        />{" "}
        <a href="#" onClick={getLocation}>
          Get Address
        </a>
      </form>
      <ZipCodeResults county={county} usState={usState} zipRequestStatus={zipRequestStatus}/>
    </div>
  );
};

export default Main;


import React, {useState} from 'react';
import axios from "axios";
import WaPhaseDescImg from '../img/WA_State_Phase_Details.jpg';
// import Background from './img/pnw-tree-bg.jpg';


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
    // const name = evt.target.name;
    const newValue = evt.target.value;
    setZipCode(newValue);
  };

  const GEOCODER_API_KEY = process.env.REACT_APP_GEOCODER_API_KEY; 

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
      <div className="wrapper">
        <div className="box"></div>
        <div className="box">
            <form>
            <div className="header"> 
                <span>What phase is it?</span>
            </div>
            <div className="zip-input"> 
                <label for="zipCode">Enter your zip code below to find out what phase of Washington State Safe Start you are currently in.</label>
                <input type="text" placeholder="Enter Zip Code" name="zipCode" value={zipCode}
            onChange={handleChange} required></input>
             <div className="get-location" onClick={getLocation}>
            Check Zip Code
          </div>
            </div>
            </form>
        </div>
        <div className="box"></div>
        <div className="box"></div>
        <div className="box">
        <ZipCodeResults
            county={county}
            usState={usState}
            zipRequestStatus={zipRequestStatus}
          />
            <img src={WaPhaseDescImg} width="100%" height="100%"/></div>
        <div className="box"></div>
      </div>

      {/* <div className="bg">
        <form className="zip-form">
          Enter your zip code below to find out what phase of Washington State
          Safe start you are currently in.
          <br />
          <input
            type="text"
            name="zipCode"
            value={zipCode}
            onChange={handleChange}
          />{" "}
          <br />
          <a href="#" onClick={getLocation}>
            Check Zip Code
          </a>
          <br />
          <br />
          <ZipCodeResults
            county={county}
            usState={usState}
            zipRequestStatus={zipRequestStatus}
          />
        </form>
      </div> */}
    </div>
  );
};

export default Main;


import React, {useState} from 'react';
import axios from "axios";
import WaPhaseDescImg from '../img/WA_State_Phase_Details.jpg';
import LoadingBar from  "./LoadingBar"


// import GeocodeApi from './components/Geocode'

const ZipCodeResults = (props) => {
  if (props.usState === "" && props.zipRequestStatus === "") {
    return <div></div>;
  } else if (!props.phaseLoaded) {
   return (
     <div>
       <main>
         <LoadingBar color="#444" />
       </main>
     </div>
   );
  } else if (props.usState === "WA" && props.zipRequestStatus === "OK") {
    return (
      <div>
        {props.county} County is currently in phase {props.custPhase}.
        <img
          className="phase-image"
          src={WaPhaseDescImg}
          width="100%"
          height="100%"
        />
      </div>
    );
  } else if (props.zipRequestStatus !== "OK") {
    return <div>Please enter a valid zip code</div>;
  } else {
    return (
      <div>Sorry, currently we only support zip codes in Washington State</div>
    );
  }
};

const Main = (props) => {
    const [county, setCounty] = useState("");
    const [phaseLoaded, setPhaseLoaded] = useState(false);
    const [zipCode, setZipCode] = useState("");
    const [usState, setUsState] = useState("");
    const [zipRequestStatus, setZipRequestStatus] = useState("");
    const [custPhase, setCustPhase] = useState("");

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
    })
      .then((data) => {
        console.log("address data", JSON.stringify(data.data.status));
        setZipRequestStatus(data.data.status);
        if (data.data.status === "OK") {
          const fullCounty =
            data.data.results[0].address_components[2].long_name;
          setCounty(fullCounty.replace(" County", ""));
          setUsState(data.data.results[0].address_components[3].short_name);
          let county = fullCounty.replace(" County", "");
          let payload = {
            county: county,
          };
          axios({
            url: "/api/get-county-status",
            method: "POST",
            data: payload,
          })
            .then((data) => {
              console.log(JSON.stringify(data.data.custPhase));
              setCustPhase(data.data.custPhase)
              setPhaseLoaded(true)
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        console.log(error);
      });
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
              <label htmlFor="zipCode">
                Enter your zip code below to find out what phase of Washington
                State Safe Start you are currently in.
              </label>
              <input
                type="text"
                placeholder="Enter Zip Code"
                name="zipCode"
                value={zipCode}
                onChange={handleChange}
                required
              ></input>
              <div className="button" onClick={getLocation}>
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
            custPhase={custPhase}
            phaseLoaded={phaseLoaded}
          />
        </div>
        <div className="box"></div>
      </div>
    </div>
  );
};

export default Main;


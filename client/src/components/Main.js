import React, {useState} from 'react';
import axios from "axios";
import WaPhaseDescImg from '../img/WA_State_Phase_Details.jpg';
import LoadingBar from  "./LoadingBar"


// import GeocodeApi from './components/Geocode'

const ZipCodeResults = (props) => {
  const imageResize = () => {
    let image = document.getElementById("phase-img");
    if (document.getElementById('phase-img').className == "phase-image pop-out") {
      image.classList.remove("pop-out");
      image.classList.add("pop-in");
    } else {
      image.classList.add("pop-out");
      image.classList.remove("pop-in");
    }

  }
  
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
      <div className="response-copy">
        <span>{props.county} County is currently in <b>Phase {props.custPhase}.</b></span>
        <img
          className="phase-image" 
          src={WaPhaseDescImg}
          width="100%"
          height="100%"
          id="phase-img"
          onClick={imageResize}
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

  const getLocation = () => {
    let payload = {
      zipCode: zipCode,
    };
    axios({
      url:"api/get-county-from-zip",
      method: "POST",
      data: payload,
    })
      .then((data) => {
        console.log("address data", JSON.stringify(data.data.custData.zipRequestStatus));


        setZipRequestStatus(data.data.custData.zipRequestStatus);
        if (data.data.custData.zipRequestStatus === "OK") {
          const fullCounty = data.data.custData.county;
          setCounty(fullCounty.replace(" County", ""));
          setUsState(data.data.custData.state);
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
              setCustPhase(data.data.custPhase);
              setPhaseLoaded(true);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setPhaseLoaded(true);
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
              </div>
              <div class="row-wrapper">
              <div class="row">
                <div class="column">
                <input
                type="text"
                placeholder="Enter Zip Code"
                name="zipCode"
                value={zipCode}
                onChange={handleChange}
                required
              ></input>
                </div>
                <div class="column">
                <div className="button" onClick={getLocation}>
                Check Zip Code
              </div>
                </div>
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


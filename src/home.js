import { useState, useEffect } from "react";
import Spinner from "react-bootstrap/Spinner";
import { useLoadScript } from "@react-google-maps/api";
import Map from "./components/map";

export default function Home({ trackPageView }) {
  //configs for @react-google-maps/api
  const [libraries] = useState(["places"]);
  //isLoaded return true when the map is loaded.
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries,
  });

  const [userLocation, setUserLocation] = useState(null);

  // Track pageviews
  useEffect(() => {
    trackPageView(window.location.pathname + window.location.search);
  }, [trackPageView]);

  //success callback to retrieve user location used in navigator.geolocation.getCurrentPosition
  function geoSuccess(position) {
    console.log("location success");
    let currentLocations = {
      lat: parseFloat(position.coords.latitude.toFixed(4)),
      lng: parseFloat(position.coords.longitude.toFixed(4)),
    };
    console.log(`currentLocations: ${JSON.stringify(currentLocations)}`);
    setUserLocation(currentLocations);
  }
  //success callback to retrieve used in navigator.geolocation.getCurrentPosition
  function geoError() {
    console.log("location error");
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((res) => {
          if (res.state === "denied") {
            alert("Enable location permissions for this website in your browser settings.");
          }
        });
    } else {
      alert("Unable to access your location."); // Obtaining Lat/long from address necessary
      setUserLocation({ lat: 47.6062, lng: -122.3321 });
    }
    setUserLocation({ lat: 47.6062, lng: -122.3321 });
  }

  //get user`s current location/ if user do not allow it, it is set to Seattle.
  useEffect(() => {
    if ("geolocation" in navigator) {
      console.log("geolocation useEffect");
      navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
    } else {
      alert("Sorry, Geolocation is not supported by this browser."); // Alert if browser does not support geolocation
      setUserLocation({ lat: 47.6062, lng: -122.3321 });
    }
  }, []);

  return (
    <>
      {!isLoaded && !userLocation ? (
        <div className="d-flex p-2 loading">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Map userLocation={userLocation} setUserLocation={setUserLocation} />
      )}
    </>
  );
}

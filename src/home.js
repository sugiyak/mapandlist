import { useState, useEffect } from "react"
import Spinner from 'react-bootstrap/Spinner';
import { useLoadScript } from "@react-google-maps/api"
import Map from "./components/map"


export default function Home () {
    const [ libraries ] = useState(['places']);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_API_KEY,
        libraries
    });
    const [userLocation, setUserLocation] = useState(false)
    useEffect(()=>{
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                let currentLocations = {lat: parseFloat(position.coords.latitude.toFixed(4)), lng: parseFloat(position.coords.longitude.toFixed(4))};
                console.log(currentLocations);
                setUserLocation(currentLocations);
              });
          } else {
            setUserLocation({lat: 47.6062, lng: -122.3321});
          }

    },[])

    return (<>
        {!isLoaded && !userLocation
            ?
        <div className="d-flex p-2 loading">
        <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
        </div>
:
        <Map userLocation={userLocation}/>
        }
</>);
}
import { useState } from 'react';
import {GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api"
import { CSVLink } from "react-csv";
import { useMemo } from "react";
import PlaceTable from "./table";
import SearchBox from "./searchBox";
import markerBlue from "../images/geo-alt-fill-blue.svg"
import '../css/style.css';
import Draggable from 'react-draggable';


export default function Map (props) {
    const [map, setMap] = useState(null);    
    const [mapLoaded, setMapLoaded] = useState([false]);
    const [directionsLoaded, setDirectionsLoaded] = useState(false);

    //used for Marker, Table, and directionSearches
    const [places, setPlaces] = useState();
    const [distanceAndDurations, setDistanceAndDurations] = useState([]);

    //boundry of searches
    const [bounds, setBounds] = useState(null);
    const options = useMemo(()=>({
        disableDefaultUI: true,
        clickableIcons: false
    }),[])
    const center = props.userLocation;
    //Gmap direction services. used in searchBox.js
    const [directionResults, setDirectionResults] = useState([]);

    const onMapLoad = ref => {
        setMap(ref);
        setMapLoaded(true);
      };
    const onBoundsChanged = ()=> {
        setBounds(map.getBounds());}   



    return (
        <>
        < GoogleMap
            zoom={10}
            center={center}
            mapContainerClassName="map-container"
            options={options}
            onLoad={onMapLoad}
            onBoundsChanged={mapLoaded && onBoundsChanged}
        >
            {center &&
            <Marker
            key={1}
            position={center}
            title="Center"
            icon={markerBlue}
            />
            }

            {places && 
            places.map((place, i)=>{
                return( <Marker
                key={i + 1}
                position={place.latlng}
                title={place.name}
                label={place.index.toString()}
                />)
            })}

            {directionsLoaded &&
            directionResults.map((result, i)=>{
                return(<DirectionsRenderer
                key={i}
                directions={result.data}
                options={{
                    markerOptions: {
                        visible: false,
                        }
                }}
            />)
            })   
            
            } 

        </GoogleMap>

        {mapLoaded && 
        <>
            <SearchBox
            directionResults={directionResults}
            setDirectionResults={setDirectionResults}
            directionsLoaded={directionsLoaded}
            setDirectionsLoaded={setDirectionsLoaded}
            setPlaces={setPlaces}
            distanceAndDurations={distanceAndDurations}
            setDistanceAndDurations={setDistanceAndDurations}
            places={places}
            bounds={bounds}
            center={center}/>
            { places && 
                <>
                    <Draggable>
                    <div className="result-box">
                            <PlaceTable
                            places={places}
                            directionsLoaded={directionsLoaded}
                            distanceAndDurations={distanceAndDurations}
                            />
                    </div>
                    </Draggable>
                    <div className='downloads'>
                        <CSVLink
                            data={places}
                            filename={"places.csv"}
                            className="btn btn-success"
                            target="_blank"
                        >
                            <div><i className="fa fa-download"></i>  CSV Download</div>
                        </CSVLink>
                    </div>
                </>
            }
        </>
        }
        </>
    )
}
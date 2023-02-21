import { useState } from 'react';
import {GoogleMap, Marker } from "@react-google-maps/api"
import { CSVLink } from "react-csv";
import { useMemo } from "react";
import Table from "./table";
import SearchBox from "./searchBox";
import '../css/style.css';


export default function Map (props) {
    const [map, setMap] = useState(null);    
    const [loaded, setLoaded] = useState([false]); 
    const [locations, setLocations] = useState();
    const [places, setPlaces] = useState(null);
    const [bounds, setBounds] = useState(null);
    const options = useMemo(()=>({
        disableDefaultUI: true,
        clickableIcons: false
    }),[])

    const center = props.userLocation;
    const onMapLoad = ref => {
        setMap(ref);
        setLoaded(true);
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
            onBoundsChanged={loaded && onBoundsChanged}
        >
            {locations && 
            locations.map((location, i)=>{
                return( <Marker
                key={i}
                position={location.latlng}
                title={location.name}
                label={location.index.toString()}
                />)
            })
            }
        </GoogleMap>

        {loaded && 
        <>
            <div className='searchbox'>
            <SearchBox setLocations={setLocations} setPlaces={setPlaces} bounds={bounds}/>
            </div>
            { places && 
                <>
                    <div className="result-box">
                        
                            < Table places={places}/>
                        
                    </div>
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
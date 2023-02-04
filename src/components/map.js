import { useState } from 'react';
import {GoogleMap, StandaloneSearchBox, Marker } from "@react-google-maps/api"
import { CSVLink } from "react-csv";
import { useMemo } from "react";
import Table from "./table"
import '../css/style.css';


export default function Map () {
    const [map, setMap] = useState(null);    
    const [loaded, setLoaded] = useState([false]); 
    const options = useMemo(()=>({
        disableDefaultUI: true,
        clickableIcons: false
    }),[])

    const center = useMemo(()=>({lat: 47.6062, lng: -122.3321}),[])
    const onMapLoad = ref => {
        setMap(ref);
        setLoaded(true);

      };
    const onBoundsChanged = () => {
        setBounds(map.getBounds());
        console.log(`getbounds:${map.getBounds()}`)}

    //Seachbox
    const [searchBox, setSearchBox] = useState(null);
    const [places, setPlaces] = useState(null);
    const [bound, setBounds] = useState(null);
    const [locations, setLocation] = useState([]);

    const defaultBounds = useMemo(()=>({sw: [47.35560844768126, -123.309883203125], ne:[47.855596745192116, -121.354316796875]}    ),[])
    const onSBLoad = ref => {
      setSearchBox(ref);
    };
    const onPlacesChanged = async () => {
        try {
            let data = await searchBox.getPlaces();
            orgainzeData(data);
            console.log(data);
            setLocation( await getMarkerPositions(data));

        } catch (error) {
            console.log(error.massage);
        }
    };
  const getMarkerPositions = async  (places) =>{
        return places.map((place)=>{
            return {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
    })
    }

    const orgainzeData = (places) => {
        let data = places.map((place)=>{
            return {name: place.name, address: place.formatted_address, rating: place.rating}
        })
        console.log(`organized: ${JSON.stringify(data)}`)
        setPlaces(data);
    }


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
                position={location}
                />)
            })

            }
        </GoogleMap>

        {loaded && 
        <div className="sidebar">
        <StandaloneSearchBox
        onLoad={onSBLoad}
        defaultBounds={defaultBounds}
        bounds={bound}
        onPlacesChanged={onPlacesChanged}
        >
        <input
            type="text"
            placeholder="Type in keywords..."
            className="searchbox"
            onFocus={(e)=>{e.target.value="";setPlaces("")}}
        />
        </StandaloneSearchBox>
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
        </div>
        }
        </>
    )
}
import { useState } from 'react';
import {StandaloneSearchBox} from "@react-google-maps/api"
import { useMemo } from "react";
import '../css/style.css';

export default function SearchBox(props){
    //Seachbox
    const [searchBox, setSearchBox] = useState(null);
    //boundry of place search
    const defaultBounds = useMemo(()=>({sw: [47.35560844768126, -123.309883203125], ne:[47.855596745192116, -121.354316796875]}    ),[])
    const onSBLoad = ref => {
      setSearchBox(ref);
    };

    const onPlacesChanged = async () => {
        try {
            let data = await searchBox.getPlaces();
            orgainzeData(data);
            console.log(`onPlacesChanged: ${JSON.stringify(data)}`);
            props.setLocations( await getMarkerPositions(data));

        } catch (error) {
            console.log(`onPlacesChanged erros: ${error.massage}`);
        }
    };

    const getMarkerPositions = async  (places) =>{
            return places.map((place, i)=>{
                return {index: i + 1, name:place.name, latlng: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}}
        })
        }
    //Process data 

    const orgainzeData = (places) => {
        let data = places.map((place, i)=>{
            return {index: i + 1, name: place.name, address: place.formatted_address, rating: place.rating}
        })
        console.log(`organized: ${JSON.stringify(data)}`)
        props.setPlaces(data);
    }


    return(
    <StandaloneSearchBox
    onLoad={onSBLoad}
    defaultBounds={defaultBounds}
    bounds={props.bounds}
    onPlacesChanged={onPlacesChanged}
    >
    <input
        type="text"
        placeholder="Type in keywords..."
        className="searchbox-input"
        onFocus={(e)=>{e.target.value="";props.setPlaces("")}}
    />
    </StandaloneSearchBox>
    )
}
//This component contains logics for searchbox and direction search feature.

import { useState, useRef } from 'react';
import {StandaloneSearchBox} from "@react-google-maps/api"
import { useMemo } from "react";
import '../css/style.css';
import DirectionBar from "./directionBar"


export default function SearchBox(props){

    const google = window.google;

    //Seachbox ref
    const [searchBox, setSearchBox] = useState(null);
    //boundry of place search. used in <StandAloneSeachBox>
    const defaultBounds = useMemo(()=>({sw: [47.35560844768126, -123.309883203125], ne:[47.855596745192116, -121.354316796875]}),[]);

    const travelMode = useRef("");
    const results = useRef([]);
    const directionLoading = useRef(0);
    const [directionLoadingState, setDirectionLoadingState] = useState(0)

    //Seachbox ref
    const onSBLoad = ref => {
      setSearchBox(ref);
    };
    //Input ref
    const placeInputRef = useRef("");

    //Used in the searchbox. revoked everytime you submit the place search input.
    const onPlacesChanged = async () => {
        try {
            props.setDirectionsLoaded(false);
            props.setPlaces();
            props.setDirectionResults([])
            let data = await searchBox.getPlaces();
            savePlaces(data);
        } catch (error) {
            console.log(`onPlacesChanged errors: ${error.massage}`);
        }
    };

    const searchBoxCross = ()=>{
        props.setDirectionsLoaded(false);
        placeInputRef.current.value = "";
        props.setPlaces("");
    }

    //add index and latlng to gmap response then save 
    const savePlaces = (places) => {
        let data = places.map((place, i)=>{
            return {...place, index: i + 1, latlng: {lat: parseFloat(place.geometry.location.lat().toFixed(4)), lng: parseFloat(place.geometry.location.lng().toFixed(4))}}
        })
        props.setPlaces(data);
    }

    //combine places data and
     function combineData(places, distDur){
        try {
            let data =  places.map((place, i)=>{
                return {...place,
                        distance: `${distDur[i].data.routes[0].legs[0].distance.value / 1000} km (${distDur[i].data.routes[0].legs[0].distance.text})`,
                        duration: distDur[i].data.routes[0].legs[0].duration.text}
            });
             props.setPlaces(data);
        } catch (error) {
            console.log(error)
        }

    }

    //A function that invoke getRoute on each places on places state. 
     function getDirections(){
        try {
            directionLoading.current = 0;
            setDirectionLoadingState(0);
            results.current = [];
            props.places.forEach((place, index)=>{setTimeout(getRoute, index * 700, place.latlng)});
        } catch (error) {
            console.log(error);
        }
    }

    //A function to retrieve a route for a place
    async function getRoute(latlng){
        try {
            const directionsService = new google.maps.DirectionsService()
            //request call to google maps api server to get direction responses
            const result = await directionsService.route({
              origin: props.center,
              destination: latlng,
              travelMode: google.maps.TravelMode[travelMode.current],
            })
            results.current.push({data: result});
            props.setDirectionResults(results.current);
        } catch (error) {
            results.current.push({data: {routes: [{legs: [{distance: {value: 0, text: "Not found"}, duration: {text: "Not found"}}]}]}})
            props.setDirectionResults(results.current)
            console.log(error.message)
        } finally {
            directionLoading.current++;
            setDirectionLoadingState(directionLoading.current);
            if(results.current.length === 20) {combineData(props.places,results.current);props.setDirectionsLoaded(true)};
        }
    }

    return(
    <>
    <div className='searchbox'>
        <StandaloneSearchBox
        onLoad={onSBLoad}
        defaultBounds={defaultBounds}
        bounds={props.bounds}
        onPlacesChanged={onPlacesChanged}
        >
            
            <div className="input-group mb-3 searchbox-input">
                <input
                    type="text"
                    placeholder="Type in keywords..."
                    className="form-control"
                    ref={placeInputRef}
                />
                <button type="button" className="btn btn-light btn-cross" onClick={searchBoxCross}>
                    <i className="fa fa-times"></i>
                </button>
            </div>
        </StandaloneSearchBox>
    </div>
    {placeInputRef.current.value &&
        <DirectionBar
        directionLoading={directionLoading}
        travelMode={travelMode}
        directionLoadingState={directionLoadingState}
        getDirections={getDirections}
        places={props.places}
        />
    }
    </>
    )
}
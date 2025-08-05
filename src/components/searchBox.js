//This component contains logics for searchbox and direction search feature.

import { useState, useRef } from 'react';
// import {StandaloneSearchBox} from "@react-google-maps/api" // Removed - using custom search
// import { useMemo } from "react"; // Removed - no longer needed
import '../css/style.css';
import DirectionBar from "./directionBar"
// import { getGeocode, getLatLng } from 'use-places-autocomplete'; // Removed - using Netlify functions
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';


export default function SearchBox(props){

    //importing global google variable. This is used in getRoute function.
    const google = window.google;

    // Removed StandaloneSearchBox related states - using custom search with Netlify functions

    //Used in getRoute function as a parameter for direciton requests. 
    const travelMode = useRef("");

    //this store all results(20) from getDirections functions. useState does not work in SetTimeout inside forEach function so useRef is used.
    const results = useRef([]);

    //Input refs
    const placeInputRef = useRef("");
    const originInputRef = useRef("");
    
    //this ref and state are used in getRoute function to determine is this program finished laoading the direction results. 
    const directionLoading = useRef(0);
    const [directionLoadingState, setDirectionLoadingState] = useState(0)

    // Helper function to call Netlify functions
    const callNetlifyFunction = async (functionName, data) => {
        try {
            const response = await fetch(`/.netlify/functions/${functionName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error calling ${functionName}:`, error);
            throw error;
        }
    };



    //Used in the searchbox. invoked everytime you submit the place search input.
    const onPlacesChanged = async () => {
        try {
            const searchTerm = placeInputRef.current.value;
            if (!searchTerm.trim()) return;
            
            props.setDirectionsLoaded(false);
            props.setPlaces();
            props.setDirectionResults([]);
            
            // Use geocoding to get coordinates for the search term
            const geocodeResult = await callNetlifyFunction('geocode', {
                address: searchTerm
            });
            
            if (geocodeResult.results && geocodeResult.results.length > 0) {
                const location = geocodeResult.results[0].geometry.location;
                const locationString = `${location.lat},${location.lng}`;
                
                // Search for places near this location
                const placesResult = await callNetlifyFunction('places-search', {
                    location: locationString,
                    radius: 5000, // 5km radius
                    keyword: searchTerm
                });
                
                if (placesResult.results) {
                    savePlaces(placesResult.results);
                }
            }
        } catch (error) {
            console.log(`onPlacesChanged errors: ${error.message}`);
        }
    };

    //When user submitted origin through the box. 
    async function onOriginChanged(){
        try{
            const geocodeResult = await callNetlifyFunction('geocode', {
                address: originInputRef.current.value
            });
            
            if (geocodeResult.results && geocodeResult.results.length > 0) {
                const location = geocodeResult.results[0].geometry.location;
                props.setUserLocation({ lat: location.lat, lng: location.lng });
            } else {
                console.log('No geocoding results found');
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    //this erases searchbox ref
    const originCross = ()=>{
        originInputRef.current.value = "";
    }

    //this erases searchbox ref
    const searchBoxCross = ()=>{
        props.setDirectionsLoaded(false);
        placeInputRef.current.value = "";
        props.setPlaces("");
    }

    //add index and latlng to gmap response then save 
    const savePlaces = (places) => {
        let data = places.map((place, i)=>{
            // Handle the different format from Netlify function (plain JSON vs Google Maps objects)
            const lat = typeof place.geometry.location.lat === 'function' 
                ? place.geometry.location.lat() 
                : place.geometry.location.lat;
            const lng = typeof place.geometry.location.lng === 'function' 
                ? place.geometry.location.lng() 
                : place.geometry.location.lng;
            
            return {...place, index: i + 1, latlng: {lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4))}}
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
            //Google maps api has query limit and the requests need to be made in certain time intervals.
            props.places.forEach((place, index)=>{setTimeout(getRoute, index * 700, place.latlng)});
        } catch (error) {
            console.log(error);
        }
    }

    //A function to retrieve a route for a place
    async function getRoute(latlng){
        try {
            //request call to netlify function to get direction responses
            const result = await callNetlifyFunction('directions', {
                origin: props.center,
                destination: latlng,
                travelMode: travelMode.current,
            });
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
        <div className='searchbox-origin-group-wrapper'>
            <InputGroup className="searchbox-group">
                <Form.Control
                    className='searchbox-input'
                    type="text"
                    placeholder="Center/origin.."
                    ref={originInputRef}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            onOriginChanged();
                        }
                    }}
                />
                <Button className='btn-search' onClick={onOriginChanged}>
                    <i className="fa fa-search"></i>
                </Button>
                <Button className='btn-cross' onClick={originCross}>
                    <i className="fa fa-times"></i>
                </Button>
            </InputGroup>            
        </div>
        <div className='searchbox-destination-group-wrapper'>
            <InputGroup className="searchbox-group searchbox-group-destination">
                <Form.Control
                    className='searchbox-input'
                    type="text"
                    placeholder="Destinations.."
                    ref={placeInputRef}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            onPlacesChanged();
                        }
                    }}
                />
                <Button className='btn-search' onClick={onPlacesChanged}>
                    <i className="fa fa-search"></i>
                </Button>
                <Button className='btn-cross' onClick={searchBoxCross}>
                    <i className="fa fa-times"></i>
                </Button>
            </InputGroup>            
        </div>
        {props.places &&
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
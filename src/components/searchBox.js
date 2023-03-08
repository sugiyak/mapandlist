//This component contains logics for searchbox and direction search feature.

import { useState, useRef } from 'react';
import {StandaloneSearchBox} from "@react-google-maps/api"
import { useMemo } from "react";
import '../css/style.css';
import DirectionBar from "./directionBar"
import { getGeocode, getLatLng } from 'use-places-autocomplete';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';


export default function SearchBox(props){

    //importing global google variable. This is used in getRoute function.
    const google = window.google;

    //Seachbox ref state. This is the ref to StandaloneSearchBox components and it is defined when StandaloneSearchBox is loaded.
    const [searchBox, setSearchBox] = useState(null);

    //Seachbox ref
    const onSBLoad = ref => {
        setSearchBox(ref);
        };

    //boundry of place search. used in <StandAloneSeachBox>
    const defaultBounds = useMemo(()=>({sw: [47.35560844768126, -123.309883203125], ne:[47.855596745192116, -121.354316796875]}),[]);

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



    //Used in the searchbox. invoked everytime you submit the place search input.
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

    //When user submitted origin through the box. 
    async function onOriginChanged(){
        try{
            const results = await getGeocode({ address: originInputRef.current.value });
            const { lat, lng } = await getLatLng(results[0]);
            props.setUserLocation({ lat, lng })
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
            //Google maps api has query limit and the requests need to be made in certain time intervals.
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
        <div className='searchbox-origin-group-wrapper'>
            <InputGroup className="searchbox-group">
                <StandaloneSearchBox
                        onPlacesChanged={onOriginChanged}
                    >
                    <Form.Control
                    className='searchbox-input'
                    type="text"
                    placeholder="Center/origin.."
                    ref={originInputRef}
                    />
                </StandaloneSearchBox>
                <Button className='btn-cross' onClick={originCross}>
                    <i className="fa fa-times"></i>
                </Button>
            </InputGroup>            
        </div>
        <div className='searchbox-destination-group-wrapper'>
            <InputGroup className="searchbox-group searchbox-group-destination">
                <StandaloneSearchBox
                    onLoad={onSBLoad}
                    defaultBounds={defaultBounds}
                    bounds={props.bounds}
                    onPlacesChanged={onPlacesChanged}
                    >
                    <Form.Control
                    className='searchbox-input'
                    type="text"
                    placeholder="Destinations.."
                    ref={placeInputRef}
                    />
                </StandaloneSearchBox>
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
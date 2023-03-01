import '../css/style.css';
import { CarFrontFill, TrainFrontFill, Bicycle, PersonFill } from 'react-bootstrap-icons';
import ProgressBar from 'react-bootstrap/ProgressBar';


export default function DirectionBar(props){

        if(props.directionLoadingState === 0 || props.directionLoadingState === 20)
        return(
            <div className="input-group directions-buttons">
                <div className="input-group-prepend directions-buttons-text">
                    <span className="input-group-text" id="basic-addon1">How far they are...</span>
                </div>
                <button className="btn btn-primary directions-button directions-button-left" value="DRIVING" onClick={()=>{props.travelMode.current="DRIVING";props.getDirections()}}>
                    <CarFrontFill/>
                </button>
                <button className="btn btn-primary directions-button" value="TRANSIT" onClick={()=>{props.travelMode.current="TRANSIT";props.getDirections()}}>
                    <TrainFrontFill/>
                </button>
                <button className="btn btn-primary directions-button" value="BICYCLING" onClick={()=>{props.travelMode.current="BICYCLING";props.getDirections()}}>
                    <Bicycle/>
                </button>
                <button className="btn btn-primary directions-button" value="WALKING" onClick={()=>{props.travelMode.current="WALKING";props.getDirections()}}>
                    <PersonFill/>
                </button>
            </div>
        )
        else {
            return(

                <div className="mb-3 directions-buttons progress-bar-box bg-white rounded">
                    <ProgressBar animated now={props.directionLoadingState * 5} label={`${props.directionLoadingState * 5}%`}></ProgressBar>
                </div>
            )
        }

}

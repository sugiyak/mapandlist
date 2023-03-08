import '../css/style.css';
import { CarFrontFill, TrainFrontFill, Bicycle, PersonFill } from 'react-bootstrap-icons';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


export default function DirectionBar(props){

        if(props.directionLoadingState === 0 || props.directionLoadingState === 20)
        return(
            <div className='directions-buttons-wrapper'>
                <ButtonGroup className='directions-buttons' aria-label="Basic example">
                    <Button className='btn-left' variant="primary" onClick={()=>{props.travelMode.current="TRANSIT";props.getDirections()}}><CarFrontFill/></Button>
                    <Button variant="primary" onClick={()=>{props.travelMode.current="TRANSIT";props.getDirections()}}><TrainFrontFill/></Button>
                    <Button variant="primary" onClick={()=>{props.travelMode.current="BICYCLING";props.getDirections()}}><Bicycle/></Button>
                    <Button className="btn-right" variant="primary" onClick={()=>{props.travelMode.current="WALKING";props.getDirections()}}><PersonFill/></Button>
                </ButtonGroup>
            </div>
        )
        else {
            return(
                <>
                    <div className='progress-bar-wrapper'>
                        <div className='progress-bar-box'>
                        <ProgressBar striped variant="success" now={props.directionLoadingState * 15} />
                        <ProgressBar striped variant="warning" now={props.directionLoadingState * 8} />
                        <ProgressBar striped variant="danger" now={props.directionLoadingState * 5} />
                        </div>
                    </div>
                </>
            )
        }

}

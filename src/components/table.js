export default function PlaceTable (props) {
    const places = props.places;

    return(
        <>

            <table className='table table-light bdr table-striped'>
                <thead>
                    <tr>
                        <th scope="col">No.</th>
                        <th scope="col">Name</th>
                        <th scope="col">Adress</th>
                        <th scope="col">Rating</th>
                    {props.directionsLoaded && 
                        <>
                        <th scope="col">Distance</th>
                        <th scope="col">Duration</th>
                        </>
                        }
                    </tr>
                </thead>
                <tbody>
            {places.map((place, i)=>{    
                        return (
                
                        <tr key={i}>
                            <td>{place.index}</td>
                            <td>{place.name}</td>
                            <td>{place.formatted_address}</td>
                            <td>{place.rating}</td>
                            {props.directionsLoaded && 
                            <>
                            <td>{place.distance}</td>
                            <td>{place.duration}</td>
                            </>
                            }
                        </tr>
                        )})}
                </tbody>
                
            </table>
            </>
    )
}
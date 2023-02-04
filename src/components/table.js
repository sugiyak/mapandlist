export default function Table (props) {
    const places = props.places;

    return(
            <table cellSpacing="0" cellPadding="0" className='styled-table'>
                <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Adress</th>
                        <th scope="col">Rating</th>
                    </tr>
                </thead>
                <tbody>
            {places.map((place, i)=>{    
                        return (
                
                        <tr key={i}>
                            <td>{place.name}</td>
                            <td>{place.address}</td>
                            <td>{place.rating}</td>
                        </tr>
                        )})}
                </tbody>
            </table>
    )
}
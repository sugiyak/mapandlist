import { useState } from 'react';
import {StandaloneSearchBox} from "@react-google-maps/api"

export default function SideBar () {
    const [searchBox, setSearchBox] = useState(null);
    const [places, setPlaces] = useState(null);
    const onSBLoad = ref => {
      setSearchBox(ref);
    };
    const onPlacesChanged = async () => {
        try {
            let data = await searchBox.getPlaces();
            setPlaces(data);
            console.log(places)    
        } catch (error) {
            console.log(error.massage)
        }
        
    };
        //Seachbox
        const {ready, value, setValue, suggestions:{status, data}, clearSuggestions} = usePlacesAutocomplete({
            requestOptions: {
              /* Define search scope here */
            },
            debounce: 300,
          });

    return (
        <div className="sidebar">
            <StandaloneSearchBox
            onLoad={onSBLoad}
            bounds={null}
            onPlacesChanged={onPlacesChanged}
            >
            <input
                type="text"
                placeholder="Type in keywords..."
                className="searchbox"
            />
            </StandaloneSearchBox>

            <div className="result-box">
                {places && 
                <table className='styled-table'>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Adress</th>
                            <th scope="col">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                {places.map((place, i)=>{    
                            return (
                    
                            <tr key={i}>
                                <td>{place.name}</td>
                                <td>{place.formatted_address}</td>
                                <td>{place.business_status}</td>
                            </tr>
                            )})}
                    </tbody>
                </table>
                }
            </div>

        </div>
    )
}
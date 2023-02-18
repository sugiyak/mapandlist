import { useLoadScript } from "@react-google-maps/api"
import Map from "./components/map"

const libraries = ['places']

export default function Home () {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_API_KEY,
        libraries
    });

    if(!isLoaded) return <div>Loading...</div>;
    return (
        <Map />
    )
}
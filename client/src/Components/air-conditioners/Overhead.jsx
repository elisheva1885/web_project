import { useLocation, useParams } from 'react-router-dom';
import { useState, useEffect} from 'react'
import axios from 'axios'

const Overhead = () => {
    const {product} =  useParams();

    const [overhead, setOverhead] = useState([])
    const getOverheadById = async (_id) => {
        try {
            console.log(_id);
            const res = await axios.get(`http://localhost:8000/api/air-conditioner/overhead/${_id}`)
            if (res.status === 200) {
                setOverhead(res.data)
                console.log(res.data);
            }
        }
        catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getOverheadById(product);
    }, [])
    return (
        <>
                       <h1>{overhead.title}</h1>


        </>
    )
}
export default Overhead

//מפרט טכני:
//react stepper component
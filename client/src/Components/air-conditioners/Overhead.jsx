import { useLocation, useParams } from 'react-router-dom';
import { useState, useEffect} from 'react'
import axios from 'axios'


const Overhead = () => {
    const {product} =  useParams();

    const [overhead, setOverhead] = useState([])
    const getOverheadById = async (_id) => {
        try {
            console.log(_id);
            const res = await axios.get(`http://localhost:8000/api/air-conditioner/overhead/overhead/${_id}`)
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
        <br/><br/><br/><br/>
                            {/* <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${overhead.company.imagePath}`} /> */}
                             <h1>{overhead.title}</h1>
                            {/* { console.log(overhead.imagepath)} */}
                            {/* <img src={`${overhead.imagepath}`} /> */}
                            <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${product.imagepath}`} />
                            
                            <h3>{overhead.describe}</h3>
                            {/* { console.log(overhead.company.imagePath)} */}
                            { console.log(overhead.company)}
                            {/* <img src={`${overhead.company.imagePath}`} /> */}
                            <p>  ש"ח {overhead.price}</p>
        </>
    )
}
export default Overhead

//מפרט טכני:
//react stepper component
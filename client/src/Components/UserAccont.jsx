import { useDispatch, useSelector } from 'react-redux';
import { clearUserDetails } from '../store/userDetailsSlice';
import { clearToken } from '../store/tokenSlice';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { clearBasket } from '../store/basketSlice';



const UserAccont =()=> {
    const {userDetails} = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    console.log("userDetails",userDetails.username)
    const signOut = ()=> {
        dispatch(clearToken())
        dispatch(clearUserDetails())
        dispatch(clearBasket())
        navigate("/")       
    }
    return(
        <>
                <div style={{ paddingTop: '60px' }}>

        <h1> hello {userDetails.username}</h1>
        <Button type="submit" label="ליציאה מהפרופיל" className="mt-2" onClick={signOut}/>
        </div>
</>
    )
}
export default UserAccont
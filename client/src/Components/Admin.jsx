import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const Admin= ()=> {
    const {userDetails} = useSelector((state) => state.userDetails);
    const navigate = useNavigate()
  const registerOfficial = async (data)=> {
        navigate('/admin/register')
        const official = {
            // name: data.name,
            // username: data.username,
            // password: data.password,
            // email: data.email,
            // phone: data.phone,
            // roles: 'official'
        }
        // onSubmit(official)
    }
    console.log("aaaa");
    return(
        <>
            <div style={{ paddingTop: '60px' }}>
   <Button type="button"label="הוספת מזכירה" className="mt-2" onClick={registerOfficial} /> 
   </div>
   </>
    )
}
export default Admin
const useGetFilePath = () => {  
    const getFilePath = (img) => {
        if (img) 
        {
            return 'http://localhost:8000/uploads/' + img;
        }
        else{
            return 'http://localhost:8000/uploads/default.png';
        }
    }
    return {getFilePath}
}
export default useGetFilePath;  
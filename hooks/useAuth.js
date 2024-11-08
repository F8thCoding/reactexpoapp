import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useEffect, useState }from 'react';

//Display current user auth info
export default function useAuth() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('got user', user);
            if(user){
                setUser(user);
            }else{
                setUser(null);
            }
        });
        return unsubscribe;
    },[])
    
    return {user}
}
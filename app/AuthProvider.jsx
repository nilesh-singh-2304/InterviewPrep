import { api } from '@/convex/_generated/api';
import { useUser } from '@stackframe/stack'
import { useMutation } from 'convex/react';
import React, { useEffect , Suspense, useState } from 'react'
import { UserContext } from './_context/userContext';

const AuthProvider = ({children}) => {
    const user = useUser();
    const CreateUser = useMutation(api.users.createUser);
    const [userData, setuserData] = useState()
    useEffect(() => {
        // console.log(user);
        user&&createNewUser();
    }, [user])

    const createNewUser = async()=>{
        const result = await CreateUser({
            name:user?.displayName,
            email:user?.primaryEmail
        })
        console.log("result" ,result);
        setuserData(result);
        localStorage.setItem("userData",JSON.stringify(result));
        console.log("userdata:",userData);
    }
  return (
    // <div>
    //   {children}
    // </div>

    <Suspense fallback={<p>Loading auth...</p>}>
        <UserContext.Provider value={{userData,setuserData}}>
            {children}
        </UserContext.Provider>
    </Suspense> 
  )
}

export default AuthProvider

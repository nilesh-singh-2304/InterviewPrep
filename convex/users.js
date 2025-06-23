import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createUser = mutation({
    args:{
        name : v.string(),
        email : v.string(), 
    },
    handler: async(convexToJson,args)=>{
        //if user exist
        const userData = await convexToJson.db.query('users').filter(q=>q.eq(q.field('email'),args.email)).collect();
        //if not exist

        if(userData?.length == 0){
            const data = {
                name : args.name,
                email : args.email,
                credit : 50000,
            }
            const result = await convexToJson.db.insert('users',{...data});
            console.log(result);
            return data; 
        }

        return userData[0];     
    }
})
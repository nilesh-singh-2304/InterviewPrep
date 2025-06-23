import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const createNewRoom = mutation({
    args:{
        category:v.string(),
        topic:v.string(),
        tutor : v.string(),
        uid : v.id('users')
    },
    handler:async(ctx,args)=>{
        const result = await ctx.db.insert("DiscussionRoom",{
            category : args.category,
            topic : args.topic,
            tutor : args.tutor,
            uid: args.uid,
        })

        return result
    }
})

export const GetDiscussionRoom = query({
     args:{
        id:v.id('DiscussionRoom')
     },
     handler: async(ctx,args)=>{
        const result = await ctx.db.get(args.id)
        return result
     }
})


export const updateConvo = mutation({
    args:{
        id:v.id('DiscussionRoom'),
        conversation:v.any(),
    },
    handler: async(ctx,args)=>{
        await ctx.db.patch(args.id,{
            conversation : args.conversation
        })
    }
})


export const updateSummary = mutation({
    args:{
        id:v.id('DiscussionRoom'),
        summary:v.any()
    },
    handler: async(ctx,args)=>{
        await ctx.db.patch(args.id,{
            summary : args.summary
        })
    }
})

export const GetAllDiscussionRoom = query({
    args:{
       uid:v.id('users')
    },
    handler: async(ctx,args)=>{
       const result = await ctx.db.query('DiscussionRoom').filter(q=>q.eq(q.field('uid'),args.uid)).order('desc').collect()
       return result
    }
})
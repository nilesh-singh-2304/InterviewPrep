import { defineSchema , defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    user:defineTable({
        name:v.string(),
        email:v.string(),
        credit:v.number(),
        subscriptionId:v.optional(v.string())
    }),

    DiscussionRoom:defineTable({
        category:v.string(),
        topic:v.string(),
        tutor : v.string(),
        conversation : v.optional(v.any()),
        summary : v.optional(v.any()),
        uid : v.optional(v.id('users')),  
    })
});
import { AssemblyAI } from "assemblyai";
import { NextResponse } from "next/server";

const assemblyAi = new AssemblyAI({apiKey: process.env.ASSEMBLY_API_KEY});
console.log("AssemblyAI", process.env.ASSEMBLY_API_KEY)
export async function GET(){
    const token = await assemblyAi.realtime.createTemporaryToken({
        expires_in: 3600, // 1 hour
    })
    console.log(token)

    return NextResponse.json(token)
}
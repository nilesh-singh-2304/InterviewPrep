"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import React , { Suspense } from 'react'
import AuthProvider from "./AuthProvider";

const Provider = ({children}) => { 
    const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
  return (
    <div>
     <ConvexProvider client={convex}>
     <Suspense fallback={<p>Loading auth...</p>}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
    </ConvexProvider>
    </div>
  )
}

export default Provider

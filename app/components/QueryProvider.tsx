"use client"
import {useState} from "react";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query"

interface Props{
    children : React.ReactNode
}

export default function QueryProvider({children} : Props){
const [queryClient, SetQueryClient] = useState(()=> new QueryClient());
return <QueryClientProvider client= {queryClient}> {children} </QueryClientProvider>
}
import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "@/Components/Nav"
import '../app/globals.css'
import { useState } from "react";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession()
  if (!session) {
    return (
      <div className=" w-screen h-screen flex justify-center items-center bg-blue-900">
        <div className="text-center w-full">
          <button onClick={() => signIn('google')} className="bg-white p-2 px-4 rounded-lg text-black">Login with Google</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-[#fff]">
      <div className="p-4 md:hidden" >
        <button onClick={() => setShowNav(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
      <div className="flex w-screen max950:flex-col">
        <Nav show={showNav} />
        <div className="h-[98vh] max-h-screen border border-[black] bg-[#f6ffff] p-4 flex-grow mt-2 mr-2 mb-2 rounded-lg">{children}</div>
      </div>
    </div>
  )
}
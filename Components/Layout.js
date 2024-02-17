import { useSession, signIn, signOut } from "next-auth/react"
import Nav from "./Nav.js"
import '../app/globals.css'

export default function Layout({children}) {
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
    <div className="min-w-screen min-h-screen bg-blue-900 flex">
      <Nav/>
      <div className="bg-white p-4 flex-grow mt-2 mr-2 mb-2 rounded-lg">{children}</div>
    </div>
  )
}
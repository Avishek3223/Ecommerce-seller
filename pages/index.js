import Layout from "@/Components/Layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  console.log(session)
  const userImg = session?.user?.image
  if (!session) {
    return (
      <>Please Loggin</>
    )
  }
  return <Layout>
    <div className="flex text-blue-900 justify-between">
      <h2>
        Hello, <b>{session?.user?.name}</b>
      </h2>
      <div className="flex bg-gray-300 gap-2 text-black rounded-lg overflow-hidden">
        <img src={userImg} alt=" " className="w-7 h-7" />
        {session?.user?.name}
        <span className="py-1 px-1">
        </span>
      </div>
    </div>
  </Layout>
}
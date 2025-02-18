import { notFound } from "next/navigation";
import { getRoom } from "@/actions/roomActions";
import { getMessages } from "@/actions/messageActions";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Chat from "@/components/Chat";
import CopyRoomUrlButton from "@/components/CopyRoomUrlButton";
import { Video } from "@/components/Video";

export async function generateMetadata({ params }) {
  const roomId = (await params).id;
  const room = await getRoom(roomId);

  if (!room) return { title: "Room Not Found" };

  return {
    title: `Room ${roomId}`,
  };
}

export default async function RoomPage({ params }) {
  const roomId = (await params).id;
  const room = await getRoom(roomId);

  if (!room) {
    notFound();
  }

  const messages = await getMessages(roomId);

  return (
    <div className="flex flex-col min-h-screen bg-gray-800">
      <div className="container mx-auto px-4 flex-grow">
        <Navbar />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-6">
            Watch YouTube Videos Together
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="col-span-3 aspect-w-16 aspect-h-9">
              <div className="w-full h-full rounded-lg shadow-lg">
                <Video
                  id={room.id}
                  url={room.video_url}
                  cursor={room.cursor}
                  state={room.video_state}
                />
              </div>
            </div>
            <div className="col-span-2 bg-gray-900 text-gray-300 rounded-lg shadow-lg p-4 h-full flex flex-col">
              <Chat initialMessages={messages} roomId={roomId} />
              <CopyRoomUrlButton roomId={roomId} />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

import FriendsList from "@/components/FriendList";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 border-r hidden lg:block">
        <h2 className="text-lg font-bold mb-4">Friends</h2>
        <ul className="space-y-2 text-sm">
          <li className="font-semibold text-blue-600">All</li>
          <li className="text-gray-600">Suggestions</li>
          <li className="text-gray-600">Friend requests</li>
          <li className="text-gray-600">Following</li>
        </ul>
        <div className="mt-6 text-sm text-gray-500">
          <p><strong>New friends</strong></p>
          <p>Châu Đức and Hương Hồng accepted your request.</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="w-full h-44 bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
          CARNIVAL PARTY
        </div>

        {/* Search */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Enter friend's name..."
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <FriendsList />
      </main>
    </div>
  );
}

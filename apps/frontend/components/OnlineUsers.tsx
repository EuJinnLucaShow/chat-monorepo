"use client";

interface OnlineUser {
  id: string;
  username: string;
  avatar_url?: string;
}

interface OnlineUsersProps {
  users: OnlineUser[];
}

export default function OnlineUsers({ users }: OnlineUsersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-bold text-lg mb-3">Онлайн ({users.length})</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {users.map((user) => (
          <div key={user.id} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm">{user.username}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

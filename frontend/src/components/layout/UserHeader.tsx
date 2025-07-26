import { UserData } from "@/types/authTypes";

export function UserHeader({ user }: { user: UserData }) {
  const userClass = user.role === "TEACHER" ? "Mestre" : "Aventureiro";

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="flex justify-end items-center">
      <div
        className="flex items-center space-x-4 p-4 pixel-border bg-opacity-25"
        style={{ backgroundColor: "#252637" }}
      >
        <div className="text-right">
          <span className="font-semibold text-white">{user.name}</span>
          <p className="text-sm text-yellow-300">{userClass}</p>
        </div>
        <div
          className="w-16 h-16 pixel-border bg-gray-600 flex items-center justify-center text-2xl"
          style={{
            backgroundImage: `url("/male_avatar.png")`,
            backgroundSize: "cover",
          }}
        ></div>
      </div>
    </header>
  );
}

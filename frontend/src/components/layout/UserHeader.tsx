export function UserHeader() {
  const userName = "Breno Klywer";
  const userClass = "Aventureiro";

  return (
    <header className="flex justify-end items-center">
      <div className="flex items-center space-x-4 p-4 pixel-border bg-black bg-opacity-25">
        <div className="text-right">
          <span className="font-semibold text-white">{userName}</span>
          <p className="text-sm text-yellow-300">{userClass}</p>
        </div>
        <div
          className="w-16 h-16 pixel-border bg-gray-600 flex items-center justify-center text-2xl"
          style={{
            backgroundImage: `url('https://placehold.co/64x64/a16207/ffffff?text=BK')`,
            backgroundSize: "cover",
          }}
        ></div>
      </div>
    </header>
  );
}

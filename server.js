import React from "react";

export default function GameBoard({ boardData, players, currentPlayerId }) {
  // Correct mapping of 40 tiles to a hollow 11x11 grid
  const getGridPosition = (idx) => {
    if (idx >= 0 && idx <= 10) {
      // Bottom row: 0–10, right → left
      return { row: 11, col: 11 - idx };
    } else if (idx >= 11 && idx <= 19) {
      // Left column: 11–19, bottom → top
      return { row: 11 - (idx - 10), col: 1 };
    } else if (idx >= 20 && idx <= 30) {
      // Top row: 20–30, left → right
      return { row: 1, col: idx - 19 };
    } else if (idx >= 31 && idx <= 39) {
      // Right column: 31–39, top → bottom
      return { row: idx - 30 + 2, col: 11 }; // +2 to start below top row
    }
  };

  return (
    <div
      className="mx-auto grid grid-cols-11 grid-rows-11 rounded-2xl shadow-lg p-1 box-border"
      style={{
        width: "min(95vw, 95vh * 1.5)",
        height: "min(65vh, 65vw / 1.5)",
        gridTemplateColumns: "repeat(11, 1fr)",
        gridTemplateRows: "repeat(11, 1fr)",
        backgroundColor: "#f5f0e1",
      }}
    >
      {boardData.map((tile, idx) => {
        const { row, col } = getGridPosition(idx);
        const playersOnTile = players.filter((p) => p.position === idx);
        const name = tile.property?.name || "";

        const bgColor =
          name.includes("Station")
            ? "#d4a373"
            : name.includes("Tax") ||
              name.includes("Jail") ||
              name.includes("Free Parking")
            ? "#f5f0e1"
            : "#fffacd";

        return (
          <div
            key={idx}
            className="border rounded flex flex-col items-start justify-start
                       p-1 text-[6px] md:text-[8px] relative overflow-hidden
                       hover:scale-105 hover:shadow-lg transition-transform duration-150 box-border"
            style={{
              backgroundColor: bgColor,
              gridRow: row,
              gridColumn: col,
            }}
          >
            <p className="font-bold truncate">{tile.property?.name}</p>
            {tile.property?.description && (
              <p className="text-[5px] md:text-[7px] mt-1 px-1 truncate">
                {tile.property.description}
              </p>
            )}
            {tile.property?.price > 0 && (
              <p className="text-[5px] md:text-[7px] mt-1">
                ${tile.property.price} | Rent: {tile.property.rent}
              </p>
            )}
            <div className="flex flex-wrap gap-0.5 mt-1 justify-center w-full">
              {playersOnTile.map((p) => (
                <span
                  key={p._id}
                  className={`w-3 h-3 rounded-full border-2 border-black ${
                    p._id === currentPlayerId ? "bg-green-500" : "bg-blue-500"
                  }`}
                  title={p.user?.name || "Player"}
                />
              ))}
            </div>
            {tile.owner && (
              <p className="text-[5px] md:text-[7px] mt-1 truncate">
                Owner: {tile.owner.user?.name || tile.owner}
              </p>
            )}
          </div>
        );
      })}

      {/* Center MONOPOLY text */}
      <div
        className="col-start-2 col-end-11 row-start-2 row-end-11
                   flex items-center justify-center text-4xl md:text-5xl font-bold opacity-20"
      >
        MONOPOLY
      </div>
    </div>
  );
}

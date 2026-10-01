const background = "#09090b";
const amber = "#fbbf24";

export function PwaIconArt({ size, padded = false }: { size: number; padded?: boolean }) {
  const mark = padded ? size * 0.8 : size;

  if (size < 64) {
    return (
      <div
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background,
          borderRadius: size * 0.2,
        }}
      >
        <div
          style={{
            width: size * 0.45,
            height: size * 0.45,
            borderRadius: "50%",
            background: amber,
            boxShadow: `0 0 ${size * 0.25}px ${amber}`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background,
      }}
    >
      <div
        style={{
          width: mark * 0.72,
          height: mark * 0.72,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          border: `${Math.max(2, mark * 0.035)}px solid ${amber}`,
          boxShadow: `0 0 ${mark * 0.12}px ${amber}, inset 0 0 ${mark * 0.08}px rgba(251, 191, 36, 0.45)`,
          color: amber,
          fontSize: mark * 0.3,
          fontWeight: 800,
          letterSpacing: -mark * 0.01,
        }}
      >
        PI
      </div>
    </div>
  );
}

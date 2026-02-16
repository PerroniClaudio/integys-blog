import "@/app/globals.css";

export default function PalettePage() {
  const colors = [
    { name: "--background", light: "0 0% 87%", dark: "0 0% 20%" },
    { name: "--foreground", light: "0 0% 3.9%", dark: "0 0% 98%" },
    { name: "--card", light: "0 0% 95%", dark: "0 0% 10%" },
    { name: "--card-foreground", light: "0 0% 3.9%", dark: "0 0% 98%" },
    { name: "--popover", light: "0 0% 87%", dark: "0 0% 20%" },
    { name: "--popover-foreground", light: "0 0% 3.9%", dark: "0 0% 98%" },
    { name: "--primary", light: "0 72.2% 50.6%", dark: "0 72.2% 50.6%" },
    { name: "--primary-foreground", light: "0 85.7% 97.3%", dark: "0 85.7% 97.3%" },
    { name: "--secondary", light: "0 0% 87%", dark: "0 0% 20%" },
    { name: "--secondary-foreground", light: "0 0% 9%", dark: "0 0% 98%" },
    { name: "--muted", light: "0 0% 96.1%", dark: "0 0% 14.9%" },
    { name: "--muted-foreground", light: "0 0% 45.1%", dark: "0 0% 63.9%" },
    { name: "--accent", light: "0 0% 96.1%", dark: "0 0% 14.9%" },
    { name: "--accent-foreground", light: "0 0% 9%", dark: "0 0% 98%" },
    { name: "--destructive", light: "0 84.2% 60.2%", dark: "0 62.8% 30.6%" },
    { name: "--destructive-foreground", light: "0 0% 98%", dark: "0 0% 98%" },
    { name: "--border", light: "0 0% 89.8%", dark: "0 0% 14.9%" },
    { name: "--input", light: "0 0% 94%", dark: "0 0% 14.9%" },
    { name: "--ring", light: "0 72.2% 50.6%", dark: "0 72.2% 50.6%" },
  ];

  return (
    <>
      <h1 className="p-4 text-xl text-center">Palette (i colori vanno allineati a mano con quelli del global.css)</h1>
      <div className="flex">
        {/* Tema chiaro */}
        <div
          className="w-1/2 p-8"
          style={{
            backgroundColor: "hsl(0, 0%, 100%)", // Valore di --background per il tema chiaro
          }}
        >
          <h2 className="text-lg font-bold mb-4"
            color={`hsl(${colors.find(c=>c.name == "--foreground")!.light})`}
          >
            Tema Chiaro
          </h2>
          <ul>
            {colors.map((color) => (
              <li
                key={color.name}
                className={"flex items-center mb-2 "}
                style={{
                  backgroundColor: `hsl(${color.light})`,
                  // color: `hsl(0, 0%, 3.9%)`, // Valore di --foreground per il tema chiaro
                  color: `${(color.name.includes("-foreground") && !color.name.includes("--foreground") )
                    ? "hsl(" + colors.find(c=>c.name == color.name.replace("-foreground", ""))!.light + ")" 
                    : (color.name.includes("--foreground") 
                      ? "hsl(" + colors.find(c=>c.name == "--background")!.light + ")" 
                      : "hsl(0, 0%, 3.9%)")
                  }`,
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                }}
              >
                {color.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Tema scuro */}
        <div
          className="w-1/2 p-8"
          style={{
            backgroundColor: "hsl(0, 0%, 3.9%)", // Valore di --background per il tema scuro
          }}
        >
          <h2 className="text-lg font-bold mb-4"
            color={`hsl(${colors.find(c=>c.name == "--foreground")!.dark})`}
          >
            Tema Scuro
          </h2>
          <ul>
            {colors.map((color) => (
              <li
                key={color.name}
                className="flex items-center mb-2"
                style={{
                  backgroundColor: `hsl(${color.dark})`,
                  color: `${(color.name.includes("-foreground") && !color.name.includes("--foreground") )
                    ? "hsl(" + colors.find(c=>c.name == color.name.replace("-foreground", ""))!.dark + ")" 
                    : (color.name.includes("--foreground") 
                      ? "hsl(" + colors.find(c=>c.name == "--background")!.dark + ")" 
                      : "hsl(0, 0%, 98%)")
                  }`, // Valore di --foreground per il tema scuro
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                }}
              >
                {color.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

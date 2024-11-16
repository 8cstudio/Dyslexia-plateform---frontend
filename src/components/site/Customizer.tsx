import { ToggleSwitch } from "flowbite-react";
import { useEffect, useState } from "react";

const Customizer = () => {
  // Color options
  const bgColors = [
    "#D8BFD8",
    "#FFD700",
    "#87CEEB",
    "#32CD32",

    "#9370DB",
    "#F8F9FA",
  ];
  const textColors = [
    "#000000",
    "#FFFFFF",
    "#4B5563",
    "#1E90FF",
    "#28A745",
    "#DC3545",
  ];
  const navbarColors = [
    "#6C757D",
    "#343A40",
    "#ffffff",
    "#FFC107",
    "#007BFF",
    "#6610F2",
    "#E83E8C",
  ];

  // Font options
  const fonts = [
    "Roboto Condensed",
    "OpenDyslexic",
    "Poppins",
    "Arial",
    "Georgia",
    "Courier New",
  ];
  const fontWeights = ["400", "500", "600", "700", "800", "900"];
  const fontStyles = ["normal", "italic", "oblique"];

  const [open, setOpen] = useState<boolean>(false);
  const [selectedBgColor, setSelectedBgColor] = useState<string>(
    localStorage.getItem("bgColor") || "#D8BFD8"
  );
  const [selectedTextColor, setSelectedTextColor] = useState<string>(
    localStorage.getItem("textColor") || "#000000"
  );
  const [selectedNavbarColor, setSelectedNavbarColor] = useState<string>(
    localStorage.getItem("navbarColor") || "#ffffff"
  );
  const [selectedFont, setSelectedFont] = useState<string>(
    localStorage.getItem("fontFamily") || fonts[0]
  );
  const [selectedFontWeight, setSelectedFontWeight] = useState<string>(
    localStorage.getItem("fontWeight") || fontWeights[0]
  );
  const [selectedFontStyle, setSelectedFontStyle] = useState<string>(
    localStorage.getItem("fontStyle") || fontStyles[0]
  );

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("bgColor", selectedBgColor);
    localStorage.setItem("textColor", selectedTextColor);
    localStorage.setItem("navbarColor", selectedNavbarColor);
    localStorage.setItem("fontFamily", selectedFont);
    localStorage.setItem("fontWeight", selectedFontWeight);
    localStorage.setItem("fontStyle", selectedFontStyle);
  }, [
    selectedBgColor,
    selectedTextColor,
    selectedNavbarColor,
    selectedFont,
    selectedFontWeight,
    selectedFontStyle,
  ]);

  return (
    <div
      className={`fixed ${
        open ? "top-[0%]" : "top-[40%]"
      } right-0 bg-white shadow-lg border rounded-lg z-50`}
    >
      {/* Toggle Switch */}
      <div className="p-4 border-b">
        <ToggleSwitch
          checked={open}
          title="Customize Theme"
          onChange={() => setOpen(!open)}
        />
      </div>

      {/* Customizer Panel */}
      {open && (
        <div className="space-y-4 w-[350px] h-[550px] overflow-y-auto bg-white shadow-lg p-5">
          {/* Background Color Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Background Colors</h3>
            <div className="grid grid-cols-3 gap-2">
              {bgColors.map((bg, i) => (
                <div
                  key={i}
                  className="h-[50px] w-full rounded-lg border cursor-pointer"
                  style={{ backgroundColor: bg }}
                  onClick={() => setSelectedBgColor(bg)}
                ></div>
              ))}
            </div>
          </div>

          {/* Text Color Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Text Colors</h3>
            <div className="grid grid-cols-3 gap-2">
              {textColors.map((color, i) => (
                <div
                  key={i}
                  className="h-[50px] w-full rounded-lg border cursor-pointer flex items-center justify-center"
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedTextColor(color)}
                >
                  <span
                    style={{ color: color === "#FFFFFF" ? "#000" : "#FFF" }}
                  >
                    A
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Navbar Color Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Navbar Colors</h3>
            <div className="grid grid-cols-3 gap-2">
              {navbarColors.map((color, i) => (
                <div
                  key={i}
                  className="h-[50px] w-full rounded-lg border cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedNavbarColor(color)}
                ></div>
              ))}
            </div>
          </div>

          {/* Font Family Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Font Family</h3>
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              {fonts.map((font, i) => (
                <option key={i} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Font Weight Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Font Weight</h3>
            <select
              value={selectedFontWeight}
              onChange={(e) => setSelectedFontWeight(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              {fontWeights.map((weight, i) => (
                <option key={i} value={weight}>
                  {weight}
                </option>
              ))}
            </select>
          </div>

          {/* Font Style Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Font Style</h3>
            <select
              value={selectedFontStyle}
              onChange={(e) => setSelectedFontStyle(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              {fontStyles.map((style, i) => (
                <option key={i} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Preview Section */}
          <div
            className="p-4 border rounded-lg mt-4"
            style={{
              backgroundColor: selectedBgColor,
              color: selectedTextColor,
              fontFamily: selectedFont,
              fontWeight: selectedFontWeight,
              fontStyle: selectedFontStyle,
            }}
          >
            <h3 className="text-lg font-semibold">Preview</h3>
            <p>This is a preview of your selected customization.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customizer;

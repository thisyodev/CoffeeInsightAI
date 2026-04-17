import { useState } from "react";

export default function Navigation({
  selectedBranch,
  branches,
  onBranchChange,
  lang,
  onLanguageChange,
  currentPage = "dashboard",
  onPageChange,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: "dashboard",
      label: lang === "th" ? "🏠 แดชบอร์ด" : "🏠 Dashboard",
      icon: "📊",
    },
    {
      id: "analytics",
      label: lang === "th" ? "📊 การวิเคราะห์" : "📊 Analytics",
      icon: "📈",
      submenu: [
        { id: "geo", label: lang === "th" ? "ภูมิศาสตร์" : "Geo-Spatial" },
        { id: "demand", label: lang === "th" ? "ความต้องการ" : "Demand" },
        { id: "revenue", label: lang === "th" ? "รายได้" : "Revenue" },
      ],
    },
    {
      id: "simulation",
      label: lang === "th" ? "🎯 การจำลอง" : "🎯 Simulation",
      icon: "🎯",
    },
    {
      id: "locations",
      label: lang === "th" ? "📍 สถานที่" : "📍 Locations",
      icon: "📍",
    },
    {
      id: "settings",
      label: lang === "th" ? "⚙️ ตั้งค่า" : "⚙️ Settings",
      icon: "⚙️",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-espresso-600 to-espresso-700 border-b-4 border-caramel-400 shadow-lg">
      {/* Top Navigation Bar - Minimalist */}
      <div className="flex items-center justify-between px-6 py-4 gap-3">
        {/* Logo & Menu Toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-3 bg-caramel-500 hover:bg-caramel-600 rounded-lg transition flex-shrink-0 text-2xl font-bold text-cream-50 border-2 border-caramel-300 shadow-md"
            title={sidebarOpen ? "Close menu" : "Open menu"}
            aria-label="Toggle navigation menu"
          >
            {sidebarOpen ? "≡" : "☕"}
          </button>
          <h1 className="hidden sm:block text-lg font-bold text-cream-100 flex-shrink-0">CoffeeInsight</h1>
        </div>

        {/* Location Selector (PRIORITY) */}
        <div className="flex-1 max-w-xs mx-2">
          <select
            value={selectedBranch}
            onChange={(e) => {
              console.log(`📍 Switching to branch: ${e.target.value}`);
              onBranchChange(e.target.value);
            }}
            className="w-full bg-cream-100 border-2 border-caramel-300 rounded-lg px-3 py-2.5 text-xs md:text-sm text-espresso-900 focus:outline-none focus:border-caramel-500 font-semibold hover:border-caramel-400 transition cursor-pointer"
            title={lang === "th" ? "เลือกสถานที่" : "Select location"}
          >
            {branches && branches.length > 0 ? (
              branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  📍 {branch.name}
                </option>
              ))
            ) : (
              <option disabled>
                {lang === "th" ? "ไม่มีสถานที่" : "No locations available"}
              </option>
            )}
          </select>
        </div>

        {/* Language Toggle Only */}
        <button
          onClick={() => onLanguageChange(lang === "th" ? "en" : "th")}
          className="px-2 md:px-3 py-2 bg-cream-100 rounded-lg text-xs md:text-sm font-medium text-espresso-900 hover:bg-caramel-300 transition border-2 border-cream-200 flex-shrink-0"
          title={lang === "th" ? "Switch to English" : "Switch to Thai"}
        >
          {lang === "th" ? "EN" : "TH"}
        </button>
      </div>

      {/* Navigation Modal */}
      {sidebarOpen && (
        <>
          {/* Overlay Backdrop */}
          <div
            className="fixed inset-0 bg-espresso-900/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Modal Dialog */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300">
            <div className="bg-gradient-to-br from-cream-100 to-latte-50 border-2 border-caramel-300 rounded-[2rem] shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-espresso-700 to-espresso-800 px-6 py-5 flex items-center justify-between border-b-2 border-caramel-400">
                <h2 className="text-2xl font-black text-cream-50">
                  {lang === "th" ? "☕ เมนู" : "☕ Menu"}
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 text-2xl text-cream-100 hover:text-cream-50 transition font-bold"
                  title="Close menu"
                  aria-label="Close navigation menu"
                >
                  ✕
                </button>
              </div>

              {/* Menu Items */}
              <div className="p-4 sm:p-6 space-y-2">
                {menuItems.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                        onPageChange(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-5 py-4 rounded-xl transition font-semibold text-base ${
                        currentPage === item.id
                          ? "bg-gradient-to-r from-caramel-500 to-caramel-600 text-cream-50 shadow-lg border-2 border-caramel-300"
                          : "text-espresso-900 hover:bg-caramel-300/30 hover:text-caramel-600 border-2 border-transparent hover:border-caramel-300"
                      }`}
                    >
                      {item.label}
                    </button>

                    {/* Submenu */}
                    {item.submenu && currentPage === item.id && (
                      <div className="ml-2 space-y-2 mt-2 pl-4 border-l-3 border-caramel-400">
                        {item.submenu.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              onPageChange(sub.id);
                              setSidebarOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 text-sm rounded-lg bg-gradient-to-r from-caramel-200/50 to-caramel-100/50 text-espresso-900 hover:from-caramel-300 hover:to-caramel-200 hover:text-caramel-700 transition cursor-pointer font-medium"
                          >
                            → {sub.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gradient-to-r from-espresso-700 to-espresso-800 px-6 py-3 border-t-2 border-caramel-400">
                <button
                  onClick={() => {
                    onPageChange("settings");
                    setSidebarOpen(false);
                  }}
                  className="w-full px-4 py-2 bg-caramel-500 hover:bg-caramel-600 text-cream-50 rounded-lg font-semibold transition text-sm"
                >
                  ⚙️ {lang === "th" ? "ตั้งค่า" : "Settings"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

import { useState } from "react";

export default function SecurityGate({ onAccessGranted }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Get password from environment variable, fallback to .env value
  const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD || "1234";

  const handleAccess = (e) => {
    e.preventDefault();
    setIsVerifying(true);

    // จำลองความปลอดภัยระดับสูงด้วยการหน่วงเวลา
    setTimeout(() => {
      if (password === CORRECT_PASSWORD) {
        onAccessGranted();
      } else {
        setError(true);
        setIsVerifying(false);
        setPassword("");
        setTimeout(() => setError(false), 2000);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-cream-50 to-latte-100 flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-15">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-caramel-400/30 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-espresso-600/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div
          className={`p-8 rounded-[3rem] bg-gradient-to-br from-cream-100 to-latte-50 backdrop-blur-3xl border-2 border-caramel-400 shadow-xl transition-all duration-500 ${error ? "border-latte-600/50 scale-95 shadow-latte-600/20" : ""}`}
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-caramel-300/40 border-2 border-caramel-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
              {isVerifying ? "🛡️" : "☕"}
            </div>
            <h1 className="text-3xl font-black text-espresso-900 tracking-tighter mb-2">
              Welcome Back
            </h1>
            <p className="text-espresso-600 text-[10px] font-black uppercase tracking-[0.3em]">
              CoffeeInsight Analytics Portal
            </p>
          </div>

          <form onSubmit={handleAccess} className="space-y-6">
            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Access Code"
                className={`w-full bg-cream-200/40 border-2 border-caramel-300 py-5 px-6 rounded-2xl text-espresso-900 font-bold tracking-wide placeholder:text-espresso-600 focus:outline-none focus:border-caramel-500 focus:bg-cream-100 transition-all text-center ${error ? "text-latte-600" : ""}`}
                autoFocus
              />
              {error && (
                <div className="absolute top-full left-0 right-0 mt-2 text-center">
                  <span className="text-[10px] font-black text-latte-600 uppercase tracking-widest animate-bounce">
                    ✗ Access Denied • Try Again
                  </span>
                </div>
              )}
            </div>

            <button
              disabled={isVerifying || !password}
              className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all duration-500 shadow-lg ${isVerifying ? "bg-caramel-300/50 text-espresso-900 cursor-wait" : "bg-gradient-to-r from-caramel-500 to-caramel-600 text-cream-50 hover:from-caramel-600 hover:to-caramel-700 hover:scale-[1.02] active:scale-95"}`}
            >
              {isVerifying ? "Verifying..." : "Enter Analytics"}
            </button>
          </form>

          <footer className="mt-12 text-center">
            <div className="flex justify-center gap-4 mb-4 opacity-40">
              <span className="w-1.5 h-1.5 bg-espresso-600 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-espresso-600 rounded-full"></span>
              <span className="w-1.5 h-1.5 bg-espresso-600 rounded-full"></span>
            </div>
            <p className="text-[8px] font-black text-espresso-600 uppercase tracking-[0.4em]">
              CoffeeInsight AI v2.0.0 • Secure Access
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

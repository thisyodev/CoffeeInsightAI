import { useState } from "react";

export default function SettingsPanel({ lang, onLanguageChange }) {
  const [settings, setSettings] = useState({
    theme: "cafe",
    notifications: true,
    autoRefresh: true,
    refreshInterval: 60,
    currency: "THB",
    units: "meters",
  });

  const t = {
    th: {
      title: "ตั้งค่าระบบ",
      subtitle: "ปรับแต่งประสบการณ์การใช้งานของคุณ",
      language: "ภาษา",
      languageDesc: "เลือกภาษาที่ต้องการใช้",
      theme: "ธีม",
      themeDesc: "เลือกธีมสีสำหรับแอปพลิเคชัน",
      notifications: "การแจ้งเตือน",
      notificationsDesc: "รับการแจ้งเตือนเมื่อมีการเปลี่ยนแปลงสำคัญ",
      autoRefresh: "รีเฟรชอัตโนมัติ",
      autoRefreshDesc: "อัปเดตข้อมูลโดยอัตโนมัติทุกๆ",
      seconds: "วินาที",
      currency: "สกุลเงิน",
      currencyDesc: "เลือกสกุลเงินสำหรับการแสดงราคา",
      units: "หน่วยวัด",
      unitsDesc: "เลือกหน่วยวัดสำหรับระยะทาง",
      save: "บันทึกการตั้งค่า",
      saved: "✓ บันทึกเรียบร้อย",
      cafe: "Cafe (ตัวแนะนำ)",
      dark: "มืด",
      light: "สว่าง",
      english: "English",
      thai: "ไทย",
      meters: "เมตร",
      kilometers: "กิโลเมตร",
      miles: "ไมล์",
    },
    en: {
      title: "System Settings",
      subtitle: "Customize your CoffeeInsight experience",
      language: "Language",
      languageDesc: "Choose your preferred language",
      theme: "Theme",
      themeDesc: "Select color theme for the application",
      notifications: "Notifications",
      notificationsDesc: "Get alerts when important changes occur",
      autoRefresh: "Auto Refresh",
      autoRefreshDesc: "Automatically update data every",
      seconds: "seconds",
      currency: "Currency",
      currencyDesc: "Choose currency for pricing display",
      units: "Units",
      unitsDesc: "Select distance measurement units",
      save: "Save Settings",
      saved: "✓ Settings saved",
      cafe: "Cafe (Recommended)",
      dark: "Dark",
      light: "Light",
      english: "English",
      thai: "ไทย",
      meters: "Meters",
      kilometers: "Kilometers",
      miles: "Miles",
    },
  }[lang];

  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const SettingRow = ({ icon, label, description, children }) => (
    <div className="p-5 md:p-6 bg-gradient-to-r from-cream-100 to-latte-50 border-2 border-caramel-200 rounded-2xl hover:border-caramel-400 transition-all">
      <div className="flex items-start gap-4 mb-4">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-espresso-900">{label}</h3>
          <p className="text-sm text-espresso-600">{description}</p>
        </div>
      </div>
      <div className="ml-12">{children}</div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-espresso-900 mb-2">{t.title}</h1>
        <p className="text-espresso-600">{t.subtitle}</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-5">
        {/* Language Setting */}
        <SettingRow icon="🌐" label={t.language} description={t.languageDesc}>
          <div className="flex gap-3">
            {[
              { code: "th", label: t.thai },
              { code: "en", label: t.english },
            ].map((option) => (
              <button
                key={option.code}
                onClick={() => onLanguageChange(option.code)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  lang === option.code
                    ? "bg-caramel-500 text-cream-50 shadow-md"
                    : "bg-cream-200 text-espresso-900 hover:bg-cream-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </SettingRow>

        {/* Theme Setting */}
        <SettingRow icon="🎨" label={t.theme} description={t.themeDesc}>
          <div className="flex gap-3">
            {[
              { id: "cafe", label: t.cafe },
              { id: "dark", label: t.dark },
              { id: "light", label: t.light },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSettings({ ...settings, theme: option.id })}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  settings.theme === option.id
                    ? "bg-caramel-500 text-cream-50 shadow-md"
                    : "bg-cream-200 text-espresso-900 hover:bg-cream-300"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </SettingRow>

        {/* Notifications */}
        <SettingRow icon="🔔" label={t.notifications} description={t.notificationsDesc}>
          <button
            onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
            className={`px-6 py-2 rounded-lg font-bold transition-all ${
              settings.notifications
                ? "bg-espresso-600 text-cream-50"
                : "bg-cream-200 text-espresso-600"
            }`}
          >
            {settings.notifications ? "✓ " : "○ "}
            {settings.notifications ? (lang === "th" ? "เปิดใช้งาน" : "Enabled") : (lang === "th" ? "ปิดใช้งาน" : "Disabled")}
          </button>
        </SettingRow>

        {/* Auto Refresh */}
        <SettingRow icon="🔄" label={t.autoRefresh} description={t.autoRefreshDesc}>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.autoRefresh}
                onChange={(e) => setSettings({ ...settings, autoRefresh: e.target.checked })}
                className="w-5 h-5 rounded cursor-pointer"
              />
              <span className="text-espresso-900 font-medium">
                {settings.autoRefresh ? (lang === "th" ? "เปิดใช้งาน" : "Enabled") : (lang === "th" ? "ปิดใช้งาน" : "Disabled")}
              </span>
            </label>
            {settings.autoRefresh && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={settings.refreshInterval}
                  onChange={(e) =>
                    setSettings({ ...settings, refreshInterval: parseInt(e.target.value) })
                  }
                  className="w-16 px-3 py-1 border-2 border-caramel-300 rounded-lg text-espresso-900 text-center font-bold"
                />
                <span className="text-espresso-600">{t.seconds}</span>
              </div>
            )}
          </div>
        </SettingRow>

        {/* Currency */}
        <SettingRow icon="💰" label={t.currency} description={t.currencyDesc}>
          <select
            value={settings.currency}
            onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
            className="px-4 py-2 border-2 border-caramel-300 rounded-lg bg-cream-100 text-espresso-900 font-bold focus:outline-none focus:border-caramel-500"
          >
            <option value="THB">THB (Thai Baht)</option>
            <option value="USD">USD (US Dollar)</option>
            <option value="EUR">EUR (Euro)</option>
            <option value="GBP">GBP (British Pound)</option>
          </select>
        </SettingRow>

        {/* Units */}
        <SettingRow icon="📏" label={t.units} description={t.unitsDesc}>
          <select
            value={settings.units}
            onChange={(e) => setSettings({ ...settings, units: e.target.value })}
            className="px-4 py-2 border-2 border-caramel-300 rounded-lg bg-cream-100 text-espresso-900 font-bold focus:outline-none focus:border-caramel-500"
          >
            <option value="meters">{t.meters}</option>
            <option value="kilometers">{t.kilometers}</option>
            <option value="miles">{t.miles}</option>
          </select>
        </SettingRow>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-caramel-500 to-caramel-600 text-cream-50 font-bold rounded-2xl hover:from-caramel-600 hover:to-caramel-700 transition-all active:scale-95 shadow-lg"
        >
          {savedMessage ? t.saved : t.save}
        </button>
      </div>

      {/* Info Box */}
      <div className="mt-8 p-6 bg-gradient-to-r from-espresso-700 to-espresso-800 border-2 border-caramel-400 rounded-2xl text-cream-100">
        <p className="text-sm leading-relaxed">
          {lang === "th"
            ? "⚙️ การตั้งค่าของคุณจะถูกบันทึกลงในเบราว์เซอร์ของคุณ คุณสามารถแก้ไขได้ตลอดเวลา"
            : "⚙️ Your settings are stored locally in your browser. You can change them anytime."}
        </p>
      </div>
    </div>
  );
}

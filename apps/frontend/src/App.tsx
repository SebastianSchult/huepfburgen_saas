import { Link, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001/api/v1";

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold text-brand-700">{t("app_title")}</h1>
      <p className="text-slate-600">{t("app_subtitle")}</p>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">{t("health_label")}</p>
        <p className="mt-1 text-sm text-slate-500">GET {apiBaseUrl}/health</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">{t("modules_label")}</p>
        <ul className="mt-2 list-disc pl-5 text-sm text-slate-600">
          <li>{t("module_equipment")}</li>
          <li>{t("module_customers")}</li>
          <li>{t("module_bookings")}</li>
          <li>{t("module_availability")}</li>
        </ul>
      </div>
    </section>
  );
};

const Placeholder = ({ title }: { title: string }) => {
  return (
    <section className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
      {title} page scaffold
    </section>
  );
};

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
          <Link className="font-semibold text-brand-700" to="/">
            Dashboard
          </Link>
          <Link className="text-sm text-slate-600 hover:text-slate-900" to="/equipment">
            Equipment
          </Link>
          <Link className="text-sm text-slate-600 hover:text-slate-900" to="/customers">
            Customers
          </Link>
          <Link className="text-sm text-slate-600 hover:text-slate-900" to="/bookings">
            Bookings
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/equipment" element={<Placeholder title="Equipment" />} />
          <Route path="/customers" element={<Placeholder title="Customers" />} />
          <Route path="/bookings" element={<Placeholder title="Bookings" />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;

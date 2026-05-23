import { useState } from "react";
import { Menu, ArrowLeft } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { useNavigate } from "react-router-dom";
import { createClass } from "../../api/classesService";

const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

export default function AddClassPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    level: "BEGINNER",
    dayOfWeek: "TUESDAY",
    startTime: "10:00",
    endTime: "11:30",
    maxParticipants: "",
    status: "Scheduled",
  });
  const [errors, setErrors] = useState<any>({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: any = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.maxParticipants || isNaN(Number(form.maxParticipants)) || Number(form.maxParticipants) <= 0)
      newErrors.maxParticipants = "Please enter a valid number.";
    return newErrors;
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setLoading(true);
      await createClass({
        name: form.name,
        description: form.description,
        level: form.level,
        dayOfWeek: form.dayOfWeek,
        startTime: form.startTime,
        endTime: form.endTime,
        maxParticipants: Number(form.maxParticipants),
      });
      navigate("/coach/classes");
    } catch (err: any) {
      setErrors({ general: "Erreur lors de la création de la classe." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed top-0 left-0 h-full z-30 w-64 bg-white border-r border-gray-200 transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <p className="text-xl font-bold text-[#2d3a6e]">FitTech</p>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0 p-4 sm:p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            <button onClick={() => navigate("/coach/classes")} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Add New Class</h1>
          </div>
          <PageHeader
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search for classes"
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>

        {/* COVER IMAGE */}
        <div className="w-full h-40 sm:h-56 rounded-2xl overflow-hidden mb-8">
          <img
            src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=80"
            alt="cover"
            className="w-full h-full object-cover"
          />
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <h2 className="text-base font-bold text-gray-900 mb-6">Class Information</h2>

          <div className="flex flex-col gap-5 max-w-2xl">

            {/* Name */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-gray-500 w-44 shrink-0">Name</label>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Class 01"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 transition
                    ${errors.name ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:ring-yellow-100 focus:border-yellow-400"}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col sm:flex-row gap-2">
              <label className="text-sm text-gray-500 w-44 shrink-0 pt-2">Description</label>
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 transition resize-none"
              />
            </div>

            {/* Class Level */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-gray-500 w-44 shrink-0">Class level</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 transition bg-white"
              >
                {levels.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-gray-500 w-44 shrink-0">Date</label>
              <div className="flex gap-3 flex-1 flex-wrap">
                <select
                  value={form.dayOfWeek}
                  onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 transition bg-white"
                >
                  {days.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 transition"
                />
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 transition"
                />
              </div>
            </div>

            {/* Maximum Participants */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-gray-500 w-44 shrink-0">Maximum Participants</label>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="25"
                  value={form.maxParticipants}
                  onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 transition
                    ${errors.maxParticipants ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:ring-yellow-100 focus:border-yellow-400"}`}
                />
                {errors.maxParticipants && <p className="text-red-500 text-xs mt-1">{errors.maxParticipants}</p>}
              </div>
            </div>

            {/* Status */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm text-gray-500 w-44 shrink-0">Status</label>
              <div className="flex gap-6">
                {["Scheduled", "Unavailable"].map((s) => (
                  <label key={s} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="radio"
                      name="status"
                      checked={form.status === s}
                      onChange={() => setForm({ ...form, status: s })}
                      className="accent-[#FFD300]"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* General Error */}
          {errors.general && (
            <p className="text-red-500 text-sm mt-4">{errors.general}</p>
          )}

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#FFD300] hover:bg-yellow-400 transition-colors text-gray-900 font-semibold text-sm px-6 py-2.5 rounded-xl disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
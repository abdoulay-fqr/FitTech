import { useState, useEffect, useRef } from "react";
import { Menu, ArrowLeft, Camera, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getCoachProfile, updateCoachProfile, uploadCoachPicture } from "../../api/coachService";

const coverImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80";
const specialitiesList = ["Yoga", "Cardio", "Strength", "Pilates", "CrossFit", "Swimming", "HIIT", "Spinning"];

export default function EditSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    phone: "",
    birthDate: "",
    gender: "MALE",
    specialties: "",
    biography: "",
    profilePic: null as string | null,
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [coachId, setCoachId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      try {
        setFetching(true);
        const data = await getCoachProfile();
        setCoachId(data.id);
        setFirstName(data.firstName);
        setSecondName(data.secondName);
        const coachId = localStorage.getItem("userId");

setForm({
  phone: data.phone || "",
  birthDate: data.birthDate || "",
  gender: data.gender || "MALE",
  specialties: data.specialties || "",
  biography: data.biography || "",
  profilePic: data.id
  ? `${process.env.REACT_APP_API_URL}/users/files/coaches/${data.id}?t=${Date.now()}`
  : null,
});
      } catch (err) {
        setErrors({ general: "Erreur lors du chargement du profil." });
      } finally {
        setFetching(false);
      }
    }
    fetchProfile();
  }, []);

  const validate = () => {
    const newErrors: any = {};
    if (newPassword && newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";
    return newErrors;
  };

  const handleSubmit = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      setLoading(true);
      await updateCoachProfile({
        phone: form.phone,
        birthDate: form.birthDate,
        gender: form.gender,
        specialties: form.specialties,
        biography: form.biography,
      });
      navigate("/coach/settings");
    } catch (err: any) {
      setErrors({ general: "Erreur lors de la mise à jour du profil." });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed top-0 left-0 h-full z-30 w-64 bg-white border-r border-gray-200 transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6">
          <p className="text-xl font-bold text-[#2d3a6e]">FitTech</p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
            <button onClick={() => navigate("/coach/settings")} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Information</h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {/* COVER + AVATAR */}
          <div className="relative h-40 sm:h-52">
            <img src={coverImage} alt="cover" className="w-full h-full object-cover" />
            <div className="relative w-24 h-24" onClick={() => fileInputRef.current?.click()}>
  {form.profilePic ? (
    <img src={form.profilePic} alt="avatar" className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md" />
  ) : (
    <div className="w-24 h-24 rounded-full border-4 border-white bg-[#2d3a6e] flex items-center justify-center shadow-md">
      <span className="text-white text-2xl font-bold">
        {firstName?.[0]}{secondName?.[0]}
      </span>
    </div>
  )}
  <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center cursor-pointer">
    <Camera size={20} className="text-[#FFD300]" />
  </div>
</div>

{/* Hidden input */}
<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  className="hidden"
 onChange={async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  console.log("FILE =", file);
  console.log("TYPE =", file.type);
  console.log("SIZE =", file.size);

  try {
    setLoading(true);
    setErrors({});

    // upload image
    await uploadCoachPicture(file);

    // generate image URL
    const imageUrl = `${process.env.REACT_APP_API_URL}/users/files/coaches/${coachId}`;

    // refresh displayed image
    setForm((prev) => ({
      ...prev,
      profilePic: `${imageUrl}?t=${Date.now()}`,
    }));

  } catch (err) {
    console.error(err);

    setErrors({
      general: "Erreur lors de l'upload de la photo.",
    });
  } finally {
    setLoading(false);
    e.target.value = "";
  }
}}
/>
          </div>

          <div className="pt-16 px-4 sm:px-8 pb-8">
            <button
  onClick={() => fileInputRef.current?.click()}
  className="text-[#FFD300] text-sm font-medium mb-6 block"
>
  Upload new picture
</button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* LEFT */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4">Personal Information</h3>
                <div className="flex flex-col gap-4">

                  {/* Phone */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-sm text-gray-500 w-36 shrink-0">Phone Number</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 transition"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-sm text-gray-500 w-36 shrink-0">Date of Birth</label>
                    <input
                      type="date"
                      value={form.birthDate}
                      onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 transition"
                    />
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-sm text-gray-500 w-36 shrink-0">Gender</label>
                    <div className="flex gap-6">
                      {["MALE", "FEMALE"].map((g) => (
                        <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                          <input
                            type="radio"
                            name="gender"
                            checked={form.gender === g}
                            onChange={() => setForm({ ...form, gender: g })}
                            className="accent-[#FFD300]"
                          />
                          {g === "MALE" ? "Man" : "Woman"}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Professional Profile */}
                <h3 className="text-base font-bold text-gray-900 mt-8 mb-4">Professional Profile</h3>
                <div className="flex flex-col gap-4">

                  {/* Specialties */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <label className="text-sm text-gray-500 w-36 shrink-0">Specialties</label>
                    <select
                      value={form.specialties}
                      onChange={(e) => setForm({ ...form, specialties: e.target.value })}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 transition bg-white"
                    >
                      <option value="">Select speciality</option>
                      {specialitiesList.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Biography */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="text-sm text-gray-500 w-36 shrink-0 pt-2">Biography</label>
                    <textarea
                      placeholder="Biography"
                      value={form.biography}
                      onChange={(e) => setForm({ ...form, biography: e.target.value })}
                      rows={4}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-100 focus:border-yellow-400 transition resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT — Security */}
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-4">Security</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Old Password", value: oldPassword, setter: setOldPassword },
                    { label: "New Password", value: newPassword, setter: setNewPassword },
                    { label: "Confirm Password", value: confirmPassword, setter: setConfirmPassword, error: errors.confirmPassword },
                  ].map((field) => (
                    <div key={field.label} className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <label className="text-sm text-gray-500 w-36 shrink-0">{field.label}</label>
                      <div className="flex-1">
                        <input
                          type="password"
                          placeholder={field.label}
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 transition ${field.error ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:ring-yellow-100 focus:border-yellow-400"}`}
                        />
                        {field.error && <p className="text-red-500 text-xs mt-1">{field.error}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Avatar preview */}
                
              </div>
            </div>

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
        </div>
      </main>
    </div>
  );
}
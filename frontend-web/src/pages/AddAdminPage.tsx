import React, { useState } from "react";
import { ArrowLeft, Bell, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/noprofil.png";
import { adminService } from "../services/adminService";

type Props = {
    onLogout: () => void;
};

const AddAdminPage: React.FC<Props> = ({ onLogout }) => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>(fallbackAvatar);

    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        email: "",
        password: "",
        phone: "",
        birthDate: "",
        gender: "MALE" as "MALE" | "FEMALE",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "gender" ? (value as "MALE" | "FEMALE") : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            const created = await adminService.createAdmin({
                firstName: formData.firstName,
                secondName: formData.secondName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                birthDate: formData.birthDate,
                gender: formData.gender,
            });

            if (selectedImage && created?.id) {
                try {
                    await adminService.uploadAdminPicture(created.id, selectedImage);
                } catch {
                    // preview handled; upload may fail if created.id is auth id not admin id
                }
            }

            navigate("/super-admin/admins");
        } catch (err: any) {
            setError(err.response?.data || err.message || "Failed to create admin");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <Sidebar onLogout={onLogout} />

            <main className="pt-14 md:ml-[156px] md:pt-0">
                <div className="min-h-screen bg-white">
                    <div className="flex items-center justify-between border-b px-4 py-5 md:px-7">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate("/super-admin/admins")}>
                                <ArrowLeft size={18} />
                            </button>
                            <h1 className="text-[18px] font-semibold text-[#2f4053]">Add Admin</h1>
                        </div>

                        <button className="flex items-center gap-2 text-[13px]">
                            <Bell size={15} />
                            Notifications
                        </button>
                    </div>

                    <div className="h-[145px]">
                        <img src={cover} alt="cover" className="h-full w-full object-cover" />
                    </div>

                    <form onSubmit={handleSave} className="px-5 pb-10 md:px-7">
                        <div className="-mt-12 mb-5">
                            <div className="relative inline-block">
                                <img
                                    src={preview}
                                    alt="New admin"
                                    className="h-24 w-24 rounded-full border-4 border-white object-cover"
                                />
                                <label className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#f2cc0c] text-white">
                                    <Camera size={16} />
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 rounded bg-red-50 px-4 py-3 text-red-500">
                                {error}
                            </div>
                        )}

                        <div className="max-w-[500px] space-y-3">
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="h-10 w-full rounded border px-3"
                            />

                            <input
                                name="secondName"
                                value={formData.secondName}
                                onChange={handleChange}
                                placeholder="Second Name"
                                className="h-10 w-full rounded border px-3"
                            />

                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="h-10 w-full rounded border px-3"
                            />

                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="h-10 w-full rounded border px-3"
                            />

                            <input
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone Number"
                                className="h-10 w-full rounded border px-3"
                            />

                            <input
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                placeholder="YYYY-MM-DD"
                                className="h-10 w-full rounded border px-3"
                            />

                            <div className="flex items-center gap-6 text-[14px]">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="MALE"
                                        checked={formData.gender === "MALE"}
                                        onChange={handleChange}
                                    />
                                    Man
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="FEMALE"
                                        checked={formData.gender === "FEMALE"}
                                        onChange={handleChange}
                                    />
                                    Woman
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded bg-[#f2cc0c] px-6 py-2 text-white"
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AddAdminPage;
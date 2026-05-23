import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Bell, Camera } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/noprofil.png";
import { adminService } from "../services/adminService";
import type { AdminProfile } from "../types/admin";

type Props = {
    onLogout: () => void;
};

const EditAdminPage: React.FC<Props> = ({ onLogout }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [admin, setAdmin] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        phone: "",
        birthDate: "",
        gender: "MALE" as "MALE" | "FEMALE",
        profilePic: null as string | null,
    });

    const getProfileImageSrc = (adminId: string, profilePic: string | null) => {
        if (!profilePic) return fallbackAvatar;
        return `http://localhost:8080/users/files/admins/${adminId}`;
    };

    const loadAdmin = async (adminId: string) => {
        const data = await adminService.getAdminById(adminId);
        setAdmin(data);

        setFormData({
            firstName: data.firstName || "",
            secondName: data.secondName || "",
            phone: data.phone || "",
            birthDate: data.birthDate || "",
            gender: data.gender || "MALE",
            profilePic: data.profilePic || null,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) return;
                setLoading(true);
                await loadAdmin(id);
            } catch (err: any) {
                setError(err.response?.data || err.message || "Failed to load admin");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "gender" ? (value as "MALE" | "FEMALE") : value,
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!id) return;
            setSaving(true);
            setError("");
            setMessage("");

            await adminService.updateAdminById(id, {
                firstName: formData.firstName,
                secondName: formData.secondName,
                phone: formData.phone,
                birthDate: formData.birthDate,
                gender: formData.gender,
            });

            await loadAdmin(id);
            setMessage("Admin updated successfully");
        } catch (err: any) {
            setError(err.response?.data || err.message || "Failed to update admin");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (!file || !id) return;

            setUploadingImage(true);
            setError("");
            setMessage("");

            await adminService.uploadAdminPicture(id, file);
            await loadAdmin(id);

            setMessage("Profile picture updated successfully");
        } catch (err: any) {
            setError(err.response?.data || err.message || "Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
    };

    if (loading) return <div className="p-6">Loading admin...</div>;
    if (!admin) return <div className="p-6 text-red-500">{error || "Admin not found"}</div>;

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
                            <h1 className="text-[18px] font-semibold text-[#2f4053]">Edit Admin</h1>
                        </div>

                        <button className="flex items-center gap-2 text-[13px] text-[#2f4053]">
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
                                    src={getProfileImageSrc(admin.id, formData.profilePic)}
                                    alt={`${admin.firstName} ${admin.secondName}`}
                                    onError={(e) => {
                                        e.currentTarget.src = fallbackAvatar;
                                    }}
                                    className="h-24 w-24 rounded-full border-4 border-white object-cover"
                                />

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingImage}
                                    className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f2cc0c] text-white disabled:opacity-60"
                                >
                                    <Camera size={16} />
                                </button>
                            </div>
                        </div>

                        {message && (
                            <div className="mb-4 rounded bg-green-50 px-4 py-3 text-green-600">
                                {message}
                            </div>
                        )}

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

export default EditAdminPage;
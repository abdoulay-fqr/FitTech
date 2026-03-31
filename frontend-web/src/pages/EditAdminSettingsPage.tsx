import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Bell, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/avatar1.png";
import { adminService } from "../services/adminService";
import { changePassword } from "../api/auth.service";
import type { AdminProfile } from "../types/admin";

type Props = {
    onLogout: () => void;
};

const EditAdminSettingsPage: React.FC<Props> = ({ onLogout }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [admin, setAdmin] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState("");
    const [saveError, setSaveError] = useState("");
    const [uploadError, setUploadError] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        secondName: "",
        phone: "",
        birthDate: "",
        gender: "MALE" as "MALE" | "FEMALE",
        profilePic: null as string | null,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const getProfileImageSrc = (adminId: string, profilePic: string | null) => {
        if (!profilePic) return fallbackAvatar;

        if (
            profilePic.startsWith("http://") ||
            profilePic.startsWith("https://") ||
            profilePic.startsWith("data:image")
        ) {
            return profilePic;
        }

        return `http://localhost:8080/users/files/admins/${adminId}`;
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await adminService.getMyProfile();
                setAdmin(data);

                setFormData({
                    firstName: data.firstName,
                    secondName: data.secondName,
                    phone: data.phone || "",
                    birthDate: data.birthDate || "",
                    gender: data.gender,
                    profilePic: data.profilePic,
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } catch (err: any) {
                console.error(err);
                setError(err.response?.data || err.message || "Failed to load admin profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChooseImage = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingImage(true);
            setUploadError("");

            await adminService.uploadMyProfilePicture(file);

            const refreshedProfile = await adminService.getMyProfile();
            setAdmin(refreshedProfile);

            setFormData((prev) => ({
                ...prev,
                profilePic: refreshedProfile.profilePic,
            }));
        } catch (err: any) {
            console.error(err);
            setUploadError(
                err.response?.data || err.message || "Failed to upload profile picture"
            );
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setSaveError("");

            await adminService.updateMyProfile({
                firstName: formData.firstName,
                secondName: formData.secondName,
                phone: formData.phone,
                birthDate: formData.birthDate,
                gender: formData.gender,
                profilePic: formData.profilePic,
            });

            const wantsToChangePassword =
                formData.oldPassword ||
                formData.newPassword ||
                formData.confirmPassword;

            if (wantsToChangePassword) {
                if (
                    !formData.oldPassword ||
                    !formData.newPassword ||
                    !formData.confirmPassword
                ) {
                    throw new Error("Fill all password fields");
                }

                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error("Passwords do not match");
                }

                await changePassword(
                    formData.oldPassword,
                    formData.newPassword,
                    formData.confirmPassword
                );
            }

            navigate("/admin/settings");
        } catch (err: any) {
            console.error(err);
            setSaveError(err.response?.data || err.message || "Error occurred");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-6">Loading profile...</div>;
    }

    if (error || !admin) {
        return <div className="p-6 text-red-500">{error || "Failed to load profile"}</div>;
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <Sidebar onLogout={onLogout} />

            <main className="pt-14 md:ml-[156px] md:pt-0">
                <div className="min-h-screen bg-white">
                    <div className="flex items-center justify-between border-b border-[#ececec] px-4 py-5 md:px-7">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate("/admin/settings")}
                                className="text-[#2f4053]"
                            >
                                <ArrowLeft size={18} strokeWidth={2.2} />
                            </button>
                            <h1 className="text-[18px] font-semibold text-[#2f4053]">
                                Edit information
                            </h1>
                        </div>

                        <button className="flex items-center gap-2 text-[13px] text-[#2f4053]">
                            <Bell size={15} />
                            <span>Notifications</span>
                        </button>
                    </div>

                    <div className="h-[125px] w-full overflow-hidden md:h-[145px]">
                        <img
                            src={cover}
                            alt="Gym cover"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <form onSubmit={handleSave} className="px-5 pb-10 md:px-7">
                        <div className="-mt-12 mb-4 md:-mt-14">
                            <div className="relative inline-block">
                                <img
                                    src={getProfileImageSrc(admin.id, formData.profilePic)}
                                    alt={`${formData.firstName} ${formData.secondName}`}
                                    onError={(e) => {
                                        e.currentTarget.src = fallbackAvatar;
                                    }}
                                    className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md md:h-24 md:w-24"
                                />

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                                <button
                                    type="button"
                                    onClick={handleChooseImage}
                                    disabled={uploadingImage}
                                    className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f2cc0c] text-white shadow disabled:opacity-60"
                                >
                                    <Camera size={16} />
                                </button>
                            </div>

                            <p className="mt-3 text-[12px] font-semibold text-[#f2cc0c]">
                                {uploadingImage ? "Uploading..." : "Upload new picture"}
                            </p>

                            {uploadError && (
                                <p className="mt-2 text-[12px] text-red-500">{uploadError}</p>
                            )}
                        </div>

                        {saveError && (
                            <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-[13px] text-red-500">
                                {saveError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                            <div className="max-w-[430px]">
                                <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                    Personal Information
                                </h3>

                                <div className="space-y-3">
                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <label className="text-[12px] text-[#111827]">
                                            First Name*
                                        </label>
                                        <input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="h-9 rounded-[4px] border border-[#f2cc0c] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <label className="text-[12px] text-[#111827]">
                                            Second Name*
                                        </label>
                                        <input
                                            name="secondName"
                                            value={formData.secondName}
                                            onChange={handleChange}
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <label className="text-[12px] text-[#111827]">Email*</label>
                                        <input
                                            value="Not editable"
                                            disabled
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] bg-[#f8f8f8] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <label className="text-[12px] text-[#111827]">
                                            Phone Number
                                        </label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[110px_1fr] items-start gap-4">
                                        <label className="pt-2 text-[12px] text-[#111827]">
                                            Date of Birth
                                        </label>
                                        <div>
                                            <input
                                                name="birthDate"
                                                value={formData.birthDate}
                                                onChange={handleChange}
                                                className="h-9 w-full rounded-[4px] border border-[#ff6b6b] px-3 text-[12px] outline-none"
                                            />
                                            <p className="mt-1 text-[10px] text-[#ff6b6b]">
                                                Please enter a valid date of birth.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <label className="text-[12px] text-[#111827]">
                                            Civility
                                        </label>
                                        <div className="flex items-center gap-6 text-[12px] text-[#111827]">
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
                                                    className="accent-[#f2cc0c]"
                                                />
                                                Woman
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-[360px]">
                                <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                    Security
                                </h3>

                                <div className="space-y-3">
                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <label className="text-[12px] text-[#111827]">
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            name="oldPassword"
                                            value={formData.oldPassword}
                                            onChange={handleChange}
                                            placeholder="Current Password"
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <label className="text-[12px] text-[#111827]">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            placeholder="New Password"
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-[110px_1fr] items-center gap-4">
                                        <label className="text-[12px] text-[#111827]">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm Password"
                                            className="h-9 rounded-[4px] border border-[#d9d9d9] px-3 text-[12px] outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="mt-16 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded-md bg-[#f2cc0c] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
                                    >
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditAdminSettingsPage;
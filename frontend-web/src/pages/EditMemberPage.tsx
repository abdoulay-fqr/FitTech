import React, { useEffect, useRef, useState } from "react";
import {
    ArrowLeft,
    Bell,
    Camera,
    Lock,
    Ban,
    CheckCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/noprofil.png";
import { memberService } from "../services/memberService";
import type { Member } from "../types/member";

type Props = {
    onLogout: () => void;
};

type EditMemberFormData = {
    firstName: string;
    secondName: string;
    phone: string;
    birthDate: string;
    gender: "MALE" | "FEMALE";
    objective: string;
    medicalRestrictions: string;
    subscriptionPlan: string;
    subscriptionStatus: string;
    password: string;
    confirmPassword: string;
    profilePic: string | null;
};

const EditMemberPage: React.FC<Props> = ({ onLogout }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [suspendLoading, setSuspendLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [uploadError, setUploadError] = useState("");

    const [formData, setFormData] = useState<EditMemberFormData>({
        firstName: "",
        secondName: "",
        phone: "",
        birthDate: "",
        gender: "MALE",
        objective: "",
        medicalRestrictions: "",
        subscriptionPlan: "",
        subscriptionStatus: "",
        password: "",
        confirmPassword: "",
        profilePic: null,
    });

    const getImageSrc = (memberId: string, profilePic: string | null) => {
        if (!profilePic) return fallbackAvatar;
        return `http://localhost:8080/users/files/members/${memberId}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) return;

                setLoading(true);
                setError("");

                const data = await memberService.getMemberById(id);
                setMember(data);

                setFormData({
                    firstName: data.firstName || "",
                    secondName: data.secondName || "",
                    phone: data.phone || "",
                    birthDate: data.birthDate || "",
                    gender: (data.gender as "MALE" | "FEMALE") || "MALE",
                    objective: data.objective || "",
                    medicalRestrictions: data.medicalRestrictions || "",
                    subscriptionPlan: data.subscriptionPlan || "",
                    subscriptionStatus: data.subscriptionStatus || "",
                    password: "",
                    confirmPassword: "",
                    profilePic: data.profilePic || null,
                });
            } catch (err: any) {
                console.error(err);
                setError(err.response?.data || err.message || "Failed to load member");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
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

            await memberService.updateMember(id, {
                firstName: formData.firstName,
                secondName: formData.secondName,
                phone: formData.phone,
                birthDate: formData.birthDate,
                gender: formData.gender,
                objective: formData.objective,
                medicalRestrictions: formData.medicalRestrictions,
                subscriptionPlan: formData.subscriptionPlan || null,
                subscriptionStatus: formData.subscriptionStatus || null,
            });

            const refreshed = await memberService.getMemberById(id);
            setMember(refreshed);

            setMessage("Member updated successfully");
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data || err.message || "Failed to update member");
        } finally {
            setSaving(false);
        }
    };

    const handleResetPassword = async () => {
        try {
            if (!member) return;

            setPasswordLoading(true);
            setError("");
            setMessage("");

            if (!formData.password || !formData.confirmPassword) {
                throw new Error("Please fill both password fields");
            }

            if (formData.password !== formData.confirmPassword) {
                throw new Error("Passwords do not match");
            }

            await memberService.resetMemberPassword(
                member.authId,
                formData.password,
                formData.confirmPassword
            );

            setMessage("Password changed successfully");

            setFormData((prev) => ({
                ...prev,
                password: "",
                confirmPassword: "",
            }));
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data || err.message || "Failed to change password");
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleSuspendToggle = async () => {
        try {
            if (!member || !id) return;

            setSuspendLoading(true);
            setError("");
            setMessage("");

            if (member.suspended) {
                await memberService.unsuspendMember(id);
                setMessage("Member unsuspended successfully");
            } else {
                await memberService.suspendMember(id);
                setMessage("Member suspended successfully");
            }

            const refreshed = await memberService.getMemberById(id);
            setMember(refreshed);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data || err.message || "Failed to update suspension");
        } finally {
            setSuspendLoading(false);
        }
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        try {
            const file = e.target.files?.[0];
            if (!file || !id) return;

            setUploadingImage(true);
            setUploadError("");
            setError("");
            setMessage("");

            await memberService.uploadMemberPicture(id, file);

            const refreshed = await memberService.getMemberById(id);
            setMember(refreshed);
            setFormData((prev) => ({
                ...prev,
                profilePic: refreshed.profilePic || null,
            }));

            setMessage("Profile picture updated successfully");
        } catch (err: any) {
            console.error(err);
            setUploadError(
                err.response?.data || err.message || "Failed to upload image"
            );
        } finally {
            setUploadingImage(false);
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (!member) return <div className="p-6 text-red-500">Member not found</div>;

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <Sidebar onLogout={onLogout} />

            <main className="pt-14 md:ml-[156px] md:pt-0">
                <div className="min-h-screen bg-white">
                    <div className="flex items-center justify-between border-b px-4 py-5 md:px-7">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate("/admin/home")}>
                                <ArrowLeft size={18} />
                            </button>
                            <h1 className="text-[18px] font-semibold text-[#2f4053]">
                                Edit Member
                            </h1>
                        </div>

                        <button className="flex items-center gap-2 text-[13px] text-[#2f4053]">
                            <Bell size={15} />
                            Notifications
                        </button>
                    </div>

                    <div className="h-[145px]">
                        <img
                            src={cover}
                            alt="cover"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <form onSubmit={handleSave} className="px-5 pb-10 md:px-7">
                        <div className="-mt-12 mb-5">
                            <div className="relative inline-block">
                                <img
                                    src={getImageSrc(member.id, formData.profilePic)}
                                    alt={`${member.firstName} ${member.secondName}`}
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

                            {uploadError && (
                                <p className="mt-2 text-[12px] text-red-500">{uploadError}</p>
                            )}
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

                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                            <div>
                                <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                    Personal Information
                                </h3>

                                <div className="space-y-3">
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
                                        placeholder="Phone"
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

                                    <textarea
                                        name="objective"
                                        value={formData.objective}
                                        onChange={handleChange}
                                        placeholder="Objective"
                                        className="w-full rounded border px-3 py-2"
                                        rows={3}
                                    />

                                    <textarea
                                        name="medicalRestrictions"
                                        value={formData.medicalRestrictions}
                                        onChange={handleChange}
                                        placeholder="Medical Restrictions"
                                        className="w-full rounded border px-3 py-2"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 text-[15px] font-semibold text-[#111827]">
                                    Membership
                                </h3>

                                <div className="space-y-3">
                                    <select
                                        name="subscriptionPlan"
                                        value={formData.subscriptionPlan}
                                        onChange={handleChange}
                                        className="h-10 w-full rounded border px-3"
                                    >
                                        <option value="">Select plan</option>
                                        <option value="MONTHLY">MONTHLY</option>
                                        <option value="ANNUAL">ANNUAL</option>
                                        <option value="SESSION">SESSION</option>
                                    </select>

                                    <select
                                        name="subscriptionStatus"
                                        value={formData.subscriptionStatus}
                                        onChange={handleChange}
                                        className="h-10 w-full rounded border px-3"
                                    >
                                        <option value="">Select status</option>
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="EXPIRED">EXPIRED</option>
                                    </select>

                                    <div className="flex justify-between rounded border px-3 py-2 text-[13px] text-[#374151]">
                                        <span>NFC Card</span>
                                        <span>{member.nfcCardId || "-"}</span>
                                    </div>

                                    <div className="flex justify-between rounded border px-3 py-2 text-[13px] text-[#374151]">
                                        <span>NFC Active</span>
                                        <span>{member.nfcActive ? "Yes" : "No"}</span>
                                    </div>
                                </div>

                                <h3 className="mb-3 mt-8 text-[15px] font-semibold text-[#111827]">
                                    Security
                                </h3>

                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="New password"
                                    className="mb-3 h-10 w-full rounded border px-3"
                                />

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm password"
                                    className="mb-4 h-10 w-full rounded border px-3"
                                />

                                <button
                                    type="button"
                                    onClick={handleResetPassword}
                                    disabled={passwordLoading}
                                    className="mb-6 flex w-full items-center justify-center gap-2 rounded bg-[#111827] px-4 py-2 text-white"
                                >
                                    <Lock size={16} />
                                    {passwordLoading ? "Saving..." : "Reset Password"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSuspendToggle}
                                    disabled={suspendLoading}
                                    className={`flex w-full items-center justify-center gap-2 rounded px-4 py-2 text-white ${
                                        member.suspended ? "bg-green-600" : "bg-red-500"
                                    }`}
                                >
                                    {member.suspended ? (
                                        <>
                                            <CheckCircle size={16} />
                                            {suspendLoading ? "Loading..." : "Unsuspend Member"}
                                        </>
                                    ) : (
                                        <>
                                            <Ban size={16} />
                                            {suspendLoading ? "Loading..." : "Suspend Member"}
                                        </>
                                    )}
                                </button>

                                <div className="mt-10 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="rounded bg-[#f2cc0c] px-6 py-2 text-white"
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

export default EditMemberPage;
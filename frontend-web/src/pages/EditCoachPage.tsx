import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, Bell, Camera, Search, Trash2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/adminComponents/Sidebar";
import cover from "../assets/gym-cover.jpg";
import fallbackAvatar from "../assets/noprofil.png";
import { coachService } from "../services/coachService";
import type { Coach, CoachClass } from "../types/coach";

type Props = {
    onLogout: () => void;
};

type FormDataType = {
    firstName: string;
    secondName: string;
    phone: string;
    birthDate: string;
    gender: "MALE" | "FEMALE";
    specialties: string;
    biography: string;
    profilePic: string | null;
};

type PendingClassRow = {
    tempId: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
};

const dayOptions = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
];

const EditCoachPage: React.FC<Props> = ({ onLogout }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [coach, setCoach] = useState<Coach | null>(null);
    const [classes, setClasses] = useState<CoachClass[]>([]);
    const [pendingClasses, setPendingClasses] = useState<PendingClassRow[]>([]);
    const [classesToDelete, setClassesToDelete] = useState<string[]>([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState<FormDataType>({
        firstName: "",
        secondName: "",
        phone: "",
        birthDate: "",
        gender: "MALE",
        specialties: "",
        biography: "",
        profilePic: null,
    });

    const getImageSrc = (coachId: string, profilePic: string | null) => {
        if (!profilePic) return fallbackAvatar;
        return `http://localhost:8080/users/files/coaches/${coachId}`;
    };

    const loadCoachData = async (coachId: string) => {
        const [coachData, classesData] = await Promise.all([
            coachService.getCoachById(coachId),
            coachService.getCoachClasses(coachId),
        ]);

        setCoach(coachData);
        setClasses(classesData);
        setClassesToDelete([]);
        setPendingClasses([]);

        setFormData({
            firstName: coachData.firstName || "",
            secondName: coachData.secondName || "",
            phone: coachData.phone || "",
            birthDate: coachData.birthDate || "",
            gender: (coachData.gender as "MALE" | "FEMALE") || "MALE",
            specialties: coachData.specialties || "",
            biography: coachData.biography || "",
            profilePic: coachData.profilePic || null,
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!id) return;
                setLoading(true);
                setError("");
                await loadCoachData(id);
            } catch (err: any) {
                setError(err.response?.data || err.message || "Failed to load coach");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "gender" ? (value as "MALE" | "FEMALE") : value,
        }));
    };

    const handleAddPendingClassRow = () => {
        setPendingClasses((prev) => [
            ...prev,
            {
                tempId: crypto.randomUUID(),
                dayOfWeek: "",
                startTime: "",
                endTime: "",
            },
        ]);
    };

    const handlePendingClassChange = (
        tempId: string,
        field: "dayOfWeek" | "startTime" | "endTime",
        value: string
    ) => {
        setPendingClasses((prev) =>
            prev.map((row) =>
                row.tempId === tempId ? { ...row, [field]: value } : row
            )
        );
    };

    const handleRemovePendingClassRow = (tempId: string) => {
        setPendingClasses((prev) => prev.filter((row) => row.tempId !== tempId));
    };

    const handleMarkDeleteExistingClass = (classId: string) => {
        setClassesToDelete((prev) =>
            prev.includes(classId) ? prev : [...prev, classId]
        );
    };

    const handleUndoDeleteExistingClass = (classId: string) => {
        setClassesToDelete((prev) => prev.filter((id) => id !== classId));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!id) return;

            setSaving(true);
            setError("");
            setMessage("");

            await coachService.updateCoach(id, {
                firstName: formData.firstName,
                secondName: formData.secondName,
                phone: formData.phone,
                birthDate: formData.birthDate,
                gender: formData.gender,
                specialties: formData.specialties,
                biography: formData.biography,
            });

            for (const classId of classesToDelete) {
                await coachService.deleteCoachClass(classId);
            }

            const validPendingClasses = pendingClasses.filter(
                (row) => row.dayOfWeek && row.startTime && row.endTime
            );

            for (const row of validPendingClasses) {
                await coachService.createCoachClass({
                    coachId: id,
                    dayOfWeek: row.dayOfWeek,
                    startTime: row.startTime,
                    endTime: row.endTime,
                });
            }

            await loadCoachData(id);
            setMessage("Coach and classes updated successfully");
        } catch (err: any) {
            setError(err.response?.data || err.message || "Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        try {
            const file = e.target.files?.[0];
            if (!file || !id) return;

            setUploadingImage(true);
            setError("");
            setMessage("");

            await coachService.uploadCoachPicture(id, file);
            await loadCoachData(id);

            setMessage("Profile picture updated successfully");
        } catch (err: any) {
            setError(err.response?.data || err.message || "Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
    };

    if (loading) return <div className="p-6">Loading coach...</div>;
    if (!coach) return <div className="p-6 text-red-500">{error || "Coach not found"}</div>;

    const visibleClasses = classes.filter(
        (item) => !classesToDelete.includes(item.id)
    );

    return (
        <div className="min-h-screen bg-[#f5f5f5]">
            <Sidebar onLogout={onLogout} />

            <main className="pt-14 md:ml-[156px] md:pt-0">
                <div className="min-h-screen bg-white">
                    <div className="flex items-center justify-between border-b px-4 py-5 md:px-7">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate("/admin/coaches")}>
                                <ArrowLeft size={18} />
                            </button>
                            <h1 className="text-[18px] font-semibold text-[#2f4053]">
                                Edit Coach
                            </h1>
                        </div>

                        <div className="flex items-center gap-5">
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                                <input
                                    type="text"
                                    placeholder="Search for coach"
                                    className="h-10 w-[240px] rounded-md bg-[#f5f5f5] pl-9 pr-3 text-[12px]"
                                />
                            </div>

                            <button className="flex items-center gap-2 text-[13px]">
                                <Bell size={15} />
                                Notifications
                            </button>
                        </div>
                    </div>

                    <div className="h-[145px]">
                        <img src={cover} alt="cover" className="h-full w-full object-cover" />
                    </div>

                    <form onSubmit={handleSave} className="px-5 pb-10 md:px-7">
                        <div className="-mt-12 mb-5">
                            <div className="relative inline-block">
                                <img
                                    src={getImageSrc(coach.id, formData.profilePic)}
                                    alt={`${coach.firstName} ${coach.secondName}`}
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
                            <p className="mt-3 text-[12px] font-semibold text-[#f2cc0c]">
                                {uploadingImage ? "Uploading..." : "Upload new picture"}
                            </p>
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
                                </div>

                                <h3 className="mb-4 mt-8 text-[15px] font-semibold text-[#111827]">
                                    Professional Profile
                                </h3>

                                <div className="space-y-3">
                                    <input
                                        name="specialties"
                                        value={formData.specialties}
                                        onChange={handleChange}
                                        placeholder="Speciality"
                                        className="h-10 w-full rounded border px-3"
                                    />

                                    <textarea
                                        name="biography"
                                        value={formData.biography}
                                        onChange={handleChange}
                                        placeholder="Biography"
                                        rows={4}
                                        className="w-full rounded border px-3 py-2"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-4 text-[15px] font-semibold text-[#111827]">
                                    Classes Overview
                                </h3>

                                <div className="space-y-3">
                                    {visibleClasses.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="grid grid-cols-[80px_1fr_auto] items-center gap-3 rounded border px-3 py-2 text-[13px]"
                                        >
                                            <span>{`Class ${String(index + 1).padStart(2, "0")}`}</span>
                                            <span>{`${item.dayOfWeek}, ${item.startTime} - ${item.endTime}`}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleMarkDeleteExistingClass(item.id)}
                                                className="text-red-500"
                                                title="Delete class"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    ))}

                                    {classesToDelete.length > 0 && (
                                        <div className="rounded border border-dashed border-red-200 p-3 text-[12px]">
                                            <p className="mb-2 font-semibold text-red-500">
                                                Classes marked for deletion
                                            </p>
                                            <div className="space-y-2">
                                                {classes
                                                    .filter((item) => classesToDelete.includes(item.id))
                                                    .map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center justify-between rounded bg-red-50 px-3 py-2"
                                                        >
                                                            <span>{`${item.dayOfWeek}, ${item.startTime} - ${item.endTime}`}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleUndoDeleteExistingClass(item.id)}
                                                                className="text-[12px] font-semibold text-[#2f4053]"
                                                            >
                                                                Undo
                                                            </button>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}

                                    {pendingClasses.map((row, index) => (
                                        <div
                                            key={row.tempId}
                                            className="grid grid-cols-[80px_1fr_1fr_1fr_auto] items-center gap-2"
                                        >
                                            <span className="text-[13px]">{`New ${index + 1}`}</span>

                                            <select
                                                value={row.dayOfWeek}
                                                onChange={(e) =>
                                                    handlePendingClassChange(row.tempId, "dayOfWeek", e.target.value)
                                                }
                                                className="h-10 rounded border px-3 text-[12px]"
                                            >
                                                <option value="">Day</option>
                                                {dayOptions.map((day) => (
                                                    <option key={day} value={day}>
                                                        {day}
                                                    </option>
                                                ))}
                                            </select>

                                            <input
                                                type="time"
                                                value={row.startTime}
                                                onChange={(e) =>
                                                    handlePendingClassChange(row.tempId, "startTime", e.target.value)
                                                }
                                                className="h-10 rounded border px-3 text-[12px]"
                                            />

                                            <input
                                                type="time"
                                                value={row.endTime}
                                                onChange={(e) =>
                                                    handlePendingClassChange(row.tempId, "endTime", e.target.value)
                                                }
                                                className="h-10 rounded border px-3 text-[12px]"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => handleRemovePendingClassRow(row.tempId)}
                                                className="text-red-500"
                                                title="Remove row"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={handleAddPendingClassRow}
                                        className="text-[13px] font-semibold text-[#f2cc0c]"
                                    >
                                        + Add class
                                    </button>
                                </div>

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

export default EditCoachPage;
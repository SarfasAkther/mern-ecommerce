
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Profile() {
    const { token, login } = useAuth();

    const [profile, setProfile] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/profile`,
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            setProfile(data);
            setName(data.name);
            setEmail(data.email);

        } catch (error) {
            console.log("Profile error:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token
                    },

                    body: JSON.stringify({
                        name,
                        email
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            setProfile(data.user);

            login(data.user, token);

            alert("Profile updated successfully");

        } catch (error) {
            console.log(
                "Update profile error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert("New passwords do not match");
            return;
        }

        if (newPassword.length < 6) {
            alert(
                "New password must be at least 6 characters"
            );
            return;
        }

        setPasswordLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token
                    },

                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Password changed successfully");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {
            console.log(
                "Change password error:",
                error
            );
        } finally {
            setPasswordLoading(false);
        }
    };

    if (!profile) {
        return (
            <p className="profile-loading">
                Loading profile...
            </p>
        );
    }

    return (
        <div className="profile-page">

            {/* PROFILE */}

            <div className="profile-card">

                <h1>My Profile</h1>

                <form onSubmit={handleUpdate}>

                    <div className="profile-field">
                        <label>Name</label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />
                    </div>

                    <div className="profile-field">
                        <label>Email</label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />
                    </div>

                    <p className="profile-role">
                        <strong>Role:</strong>{" "}
                        {profile.role}
                    </p>

                    <button
                        type="submit"
                        disabled={loading}
                        className="profile-button"
                    >
                        {loading
                            ? "Updating..."
                            : "Update Profile"}
                    </button>

                </form>

            </div>


            {/* CHANGE PASSWORD */}

            <div className="profile-card">

                <h2>Change Password</h2>

                <form onSubmit={handleChangePassword}>

                    <div className="profile-field">
                        <label>
                            Current Password
                        </label>

                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) =>
                                setCurrentPassword(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="profile-field">
                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="profile-field">
                        <label>
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={passwordLoading}
                        className="profile-button"
                    >
                        {passwordLoading
                            ? "Changing..."
                            : "Change Password"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Profile;

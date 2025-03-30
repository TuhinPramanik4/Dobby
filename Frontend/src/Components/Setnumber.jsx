import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SetNumber = () => {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Function to fetch user ID
    const fetchUserId = async () => {
        try {
            const res = await fetch("https://dobby-fbxy.onrender.com/auth/user", { credentials: "include" });
            const user = await res.json();
            return user?._id || null; // Ensure we return the user ID
        } catch (err) {
            console.error("Error fetching user ID:", err);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset error message

        if (!phone.match(/^\d{10}$/)) {
            setError("Please enter a valid 10-digit phone number.");
            return;
        }

        try {
            const userId = await fetchUserId();
            if (!userId) {
                setError("User not authenticated. Please log in.");
                return;
            }

            const res = await fetch("https://dobby-fbxy.onrender.com/api/update-phone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ userId, phone }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to update phone number");
            }

            alert("Phone number updated successfully!");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error updating phone number:", error);
            setError(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h1 className="text-2xl font-semibold mb-4 text-center">Set Your Phone Number</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        className="border p-3 rounded-md text-lg w-full"
                        placeholder="Enter 10-digit phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-5 py-3 rounded-md font-semibold hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetNumber;

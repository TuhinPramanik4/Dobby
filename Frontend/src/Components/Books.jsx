import { useState } from "react";

export default function PatientForm() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    age: "",
    symptoms: "",
    gender: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      const response = await fetch("http://localhost:8000/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Form submitted successfully!");
        setFormData({ name: "", mobile: "", age: "", symptoms: "", gender: "" });
      } else {
        setMessage(data.message || "Error submitting form.");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700">
      <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-lg border border-white/20 max-w-md w-full">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Patient Form</h2>
        {message && <p className="text-center text-green-300">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-transparent border border-white/30 p-3 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="w-full bg-transparent border border-white/30 p-3 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
            className="w-full bg-transparent border border-white/30 p-3 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="w-full bg-transparent border border-white/30 p-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            name="symptoms"
            placeholder="Describe your symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            required
            className="w-full bg-transparent border border-white/30 p-3 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
          ></textarea>
          <button
            onClick={() => (window.location.href = "http://localhost:5173/dashboard")}
            type="submit"
            className="w-full bg-white/20 text-white p-3 rounded-lg hover:bg-white/30 transition-all duration-300"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
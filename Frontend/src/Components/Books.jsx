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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-4 shadow-lg rounded-2xl bg-white">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-center">Patient Form</h2>
          {message && <p className="text-center text-green-600">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-lg"
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
              className="w-full p-2 border rounded-lg"
            ></textarea>
            <button
            onClick={() => (window.location.href = "http://localhost:5173/dashboard")}
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import axios from "axios";

export default function DonorRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    userName: "",
    userEmail: "",
    age: "",
    bloodGroup: "",
    city: "",
    lastDonationDate: "",
    isAvailable: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const updated = {
      ...form,
      [name]: type === "checkbox" ? checked : value,
    };

    setForm(updated);

    // 🔥 live age validation
    if (name === "age") {
      const age = Number(value);
      if (age < 18 || age > 45) {
        setError("Age must be between 18 and 45 years");
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const age = Number(form.age);

    // 🔥 final protection
    if (age < 18 || age > 45) {
      setError("Age must be between 18 and 45 years");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/donors/register", form);
      alert("🎉 Registered successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">

      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8">

        <h2 className="text-3xl font-bold text-center text-red-600 mb-2">
          Become a Donor ❤️
        </h2>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Eligible age: 18–45 years
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <Input label="Full Name" name="userName" onChange={handleChange} required />

          <Input label="Email" type="email" name="userEmail" onChange={handleChange} required />

          {/* Age with limits */}
          <div>
            <label className="text-sm font-medium text-gray-600">Age</label>
            <input
              type="number"
              name="age"
              min="18"
              max="45"
              onChange={handleChange}
              required
              className={`mt-1 w-full border rounded-xl p-3 outline-none
                ${error ? "border-red-500 ring-2 ring-red-200" : "focus:ring-2 focus:ring-red-400"}`}
            />
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
          </div>

          {/* Blood group */}
          <select
            name="bloodGroup"
            required
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-400"
          >
            <option value="">Select Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>

          <Input label="City" name="city" onChange={handleChange} required />

          <Input label="Last Donation Date" type="date" name="lastDonationDate" onChange={handleChange} />

          <label className="flex items-center gap-3 text-gray-600">
            <input
              type="checkbox"
              name="isAvailable"
              defaultChecked
              onChange={handleChange}
              className="w-5 h-5 accent-red-600"
            />
            Available to donate
          </label>

          <button
            disabled={loading || error}
            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white p-3 rounded-xl font-semibold shadow-md disabled:opacity-50 hover:scale-[1.02] transition"
          >
            {loading ? "Registering..." : "Register as Donor"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        {...props}
        className="mt-1 w-full border rounded-xl p-3 focus:ring-2 focus:ring-red-400 outline-none"
      />
    </div>
  );
}

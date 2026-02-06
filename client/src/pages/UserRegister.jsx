import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function UserRegister() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    city: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/public/register", form);

      // After successful registration, guide user to email verification info page
      navigate("/verify-email", { state: { email: form.email } });

    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-rose-600 mb-2">
          Create Account
        </h2>

        <p className="text-center text-gray-500 text-sm mb-8">
          Join LifeSaver and help save lives
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <Input label="Full Name" name="name" onChange={handleChange} required />

          <Input label="Phone Number" name="phone" onChange={handleChange} required />

          <Input label="Email" type="email" name="email" onChange={handleChange} required />

          <Input label="City" name="city" onChange={handleChange} required />

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>

            <div className="flex mt-1">
              <input
                type={showPass ? "text" : "password"}
                name="password"
                required
                onChange={handleChange}
                className="flex-1 border rounded-l-xl p-3 focus:ring-2 focus:ring-rose-400 outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="px-4 bg-gray-100 rounded-r-xl text-sm"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-xl font-semibold transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
              {error}
            </div>
          )}

          <p className="text-center text-sm text-gray-500">
            Already have account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-rose-600 cursor-pointer font-medium"
            >
              Login
            </span>
          </p>

        </form>
      </div>
    </div>
  );
}

/* reusable input */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        {...props}
        className="mt-1 w-full border rounded-xl p-3 focus:ring-2 focus:ring-rose-400 outline-none"
      />
    </div>
  );
}

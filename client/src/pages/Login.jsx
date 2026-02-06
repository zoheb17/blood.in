import { useState } from "react";
import { useNavigate, Link } from "react-router";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:5000/public/login",
        {
          email,
          password,
        }
      );

      // ✅ save token
      localStorage.setItem("token", res.data.token);

      navigate("/dashboard"); // go home
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-rose-200">

        <h2 className="text-3xl font-bold text-center text-rose-600 mb-2">
          Welcome Back ❤️
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Login to contact donors
        </p>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 border rounded-lg p-3"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 text-white py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-rose-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full text-sm text-gray-400 hover:text-rose-600"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

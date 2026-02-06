import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  const [status, setStatus] = useState("idle"); // idle | verifying | success | error | info
  const [message, setMessage] = useState("");

  // Extract token from query string if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    // If there is no token, just show info message
    if (!token) {
      setStatus("info");
      const emailFromState = location.state?.email;
      setMessage(
        emailFromState
          ? `We sent a verification link to ${emailFromState}. Please open your inbox and click the link to verify your account.`
          : "We sent a verification link to your email. Please open your inbox and click the link to verify your account."
      );
      return;
    }

    const verify = async () => {
      try {
        setStatus("verifying");
        setMessage("Verifying your email, please wait...");

        await axios.post("http://localhost:5000/public/verify-email", {
          emailotp: token,
        });

        setStatus("success");
        setMessage("Your email has been verified successfully. You can now login.");
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.msg ||
            "Verification failed. The link may have expired or is invalid."
        );
      }
    };

    verify();
  }, [location.search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-rose-50 via-white to-rose-100 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-rose-600 mb-3">
          Email Verification
        </h2>

        <p className="text-sm text-gray-600 mb-6">{message}</p>

        {(status === "success" || status === "info") && (
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold transition"
          >
            Go to Login
          </button>
        )}

        {status === "error" && (
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl font-semibold transition"
          >
            Back to Register
          </button>
        )}
      </div>
    </div>
  );
}


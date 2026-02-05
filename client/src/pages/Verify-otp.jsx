import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const phone = state?.phone;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
        console.log(`function running`)
      const res = await axios.post(
        "http://localhost:5000/public/verify-phone",
        {
          phoneotp: otp, // ✅ matches backend
        }
      );

      console.log(res.data)
    //   alert(res.data.msg);

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-center text-rose-600 mb-2">
          Verify Phone 📱
        </h2>

        <p className="text-sm text-center text-gray-500 mb-6">
          OTP sent to {phone}
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border rounded-lg p-3 mb-4 text-center tracking-widest"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-rose-600 text-white p-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}

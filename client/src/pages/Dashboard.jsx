import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();

  const [donors, setDonors] = useState([]);
  const [group, setGroup] = useState("O+");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ show like → 📞 +91 99***
  const maskPhone = (phone = "") =>
    `+91 ${(phone.toString().slice(0, 2) || "00")}***`;

  // ================= Logout =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    setDonors([]);
    navigate("/", { replace: true });
  };

  // ================= Fetch donors =================
  const fetchDonors = async (bloodGroup) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // ✅ FIXED: no redirect anymore
      if (!token) return;

      const res = await axios.post(
        "http://localhost:5000/private/blood-request",
        { bloodGroup },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      setDonors(res.data || []);
    } catch (err) {
      setDonors([]);

      setError(
        err.response?.data?.msg ||
          "No donors found for this group in your city."
      );
    } finally {
      setLoading(false);
    }
  };

  // fetch when blood group changes
  useEffect(() => {
    fetchDonors(group);
  }, [group]);

  // ================= Filter =================
  const filtered = donors.filter((d) => {
    const name = (d.userName || "").toLowerCase();
    const city = (d.city || "").toLowerCase();
    const term = search.toLowerCase();

    return name.includes(term) || city.includes(term);
  });

  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-rose-100 text-gray-900">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 bg-white border-b border-rose-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-rose-600">❤️ LifeSaver</h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/donor-register")}
              className="bg-rose-600 text-white px-6 py-2 rounded-full"
            >
              Donate Now
            </button>

            {token && (
              <button
                onClick={handleLogout}
                className="border border-rose-600 text-rose-600 px-6 py-2 rounded-full hover:bg-rose-50"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ================= SEARCH ================= */}
      <section className="max-w-6xl mx-auto px-6 my-10">
        <div className="bg-white rounded-2xl shadow-md p-6 flex gap-4">
          <input
            placeholder="Search donor or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-rose-200 rounded-lg p-3 outline-none"
          />

          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="border border-rose-200 rounded-lg p-3"
          >
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>
      </section>

      {/* ================= DONORS ================= */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 pb-20">

        {loading && <p className="text-gray-500">Loading donors...</p>}
        {!loading && error && <p className="text-gray-500">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="text-gray-500">
            {search ? "No donors match your search" : "No donors found"}
          </p>
        )}

        {!loading &&
          filtered.map((d) => (
            <div
              key={d._id}
              className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
            >
              <h3 className="font-semibold">{d.userName || "Unknown"}</h3>

              <p className="text-sm text-gray-500">
                {d.city || "Unknown city"}
              </p>

              {/* ✅ masked phone */}
              <p className="text-xs text-gray-500 mt-1">
                📞 {maskPhone(d.phone)}
              </p>

              <div className="flex justify-between mt-4">
                <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-xs">
                  {d.bloodGroup}
                </span>

                {/* ✅ direct call dialer */}
                <a
                  href={`tel:+91${d.phone}`}
                  className="text-rose-600 text-sm font-semibold"
                >
                  Contact →
                </a>
              </div>
            </div>
          ))}
      </section>
    </div>
  );
}

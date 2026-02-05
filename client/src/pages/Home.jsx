import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const mock = [
  { id: 1, name: "Rahil Don", city: "Akola", group: "O+", phone: "7666892754" },
  { id: 2, name: "Kasim", city: "Akola", group: "O-", phone: "8087248248" },
];

export default function Home() {
  const navigate = useNavigate(); // ✅ hook must be inside component

  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("All");

  useEffect(() => {
    setDonors(mock);
  }, []);

  const filtered = donors.filter((d) => {
    const s =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase());

    const g = group === "All" || d.group === group;

    return s && g;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-rose-100 text-gray-900">
      {/* NAVBAR */}
      <nav className="sticky top-0 bg-white/90 backdrop-blur-lg border-b border-rose-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-rose-600 flex gap-2">
            ❤️ LifeSaver
          </h1>

          <button
            onClick={() => navigate("/donor-register")}
            className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-full font-semibold transition"
          >
            Donate Now
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="text-center py-20 px-6">
        <h2 className="text-5xl font-bold text-rose-600 mb-4">
          Find Blood Donors Near You
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Connect instantly with donors and save lives today.
        </p>
      </section>

      {/* SEARCH */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-2xl shadow-md p-6 flex gap-4">
          <input
            placeholder="Search donor or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-rose-200 rounded-lg p-3 focus:border-rose-600 outline-none"
          />

          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="border border-rose-200 rounded-lg p-3"
          >
            {["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
              (g) => (
                <option key={g}>{g}</option>
              )
            )}
          </select>
        </div>
      </section>

      {/* DONOR CARDS */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 pb-20">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="bg-white border border-rose-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
          >
            <h3 className="font-semibold">{d.name}</h3>
            <p className="text-gray-500 text-sm">{d.city}</p>

            <div className="mt-4 flex justify-between items-center">
              <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                {d.group}
              </span>

              {/* ✅ Navigate to login on click */}
              <button
                onClick={() => navigate("/login")}
                className="text-rose-600 text-sm font-semibold hover:underline"
              >
                Contact →
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

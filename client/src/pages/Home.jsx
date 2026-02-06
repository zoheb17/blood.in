import { useState } from "react";
import { useNavigate } from "react-router";

const mock = [
  { id: 1, name: "Zoheb", city: "Akola", group: "AB-", phone: "9022442668" },
  { id: 2, name: "Rahil", city: "Akola", group: "O+", phone: "7666892754" },
  { id: 3, name: "Kasim", city: "Akola", group: "O-", phone: "8087248248" },
  { id: 4, name: "Ayaan", city: "Nagpur", group: "A+", phone: "9876543210" },
  { id: 5, name: "Sameer", city: "Pune", group: "B+", phone: "9123456780" },
];

export default function Home() {
  const navigate = useNavigate();

  const [donors] = useState(mock);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("All");

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
            onClick={() => navigate("/login")}
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
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-6 pb-20">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-rose-100 flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-gray-800">{d.name}</h3>
              <p className="text-sm text-gray-500 mt-1">📍 {d.city}</p>
            </div>

            <div className="my-5">
              <span className="bg-linear-to-r from-rose-600 to-red-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow">
                {d.group}
              </span>
            </div>

            {/* ✅ masked phone only */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {d.phone.slice(0, 4) + "******"}
              </p>

              <button
                onClick={() => navigate("/login")}
                className="bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-rose-100 transition"
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

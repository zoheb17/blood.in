import { useEffect, useState } from "react";

export default function Home() {
  const [donors, setDonors] = useState([]);
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("All");

  /* ---------------- MOCK DATA ---------------- */
  useEffect(() => {
    setDonors([
      { id: 1, name: "Rahul Sharma", city: "Mumbai", group: "O+" },
      { id: 2, name: "Anjali Mehta", city: "Hyderabad", group: "A-" },
      { id: 3, name: "Ravi Kumar", city: "Pune", group: "B+" },
      { id: 4, name: "Sneha Patil", city: "Bangalore", group: "AB+" },
      { id: 5, name: "Amit Joshi", city: "Mumbai", group: "O-" },
    ]);
  }, []);

  /* ---------------- FILTER ---------------- */
  const filtered = donors.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.city.toLowerCase().includes(search.toLowerCase());

    const matchGroup = group === "All" || d.group === group;

    return matchSearch && matchGroup;
  });

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen text-white overflow-x-hidden
      bg-gradient-to-br from-[#2b0000] via-[#120000] to-black relative">

      {/* glowing background effect */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(255,0,0,0.25),transparent_40%)]" />

      {/* ================= HEADER ================= */}
      <header className="flex justify-between items-center px-8 py-4
        backdrop-blur-lg bg-black/40 border-b border-red-600/30 sticky top-0 z-50">

        <h1 className="text-2xl font-bold text-red-500 flex items-center gap-2">
          🩸 LifeSaver
        </h1>

        <button className="bg-gradient-to-r from-red-600 to-red-700
          px-6 py-2 rounded-full font-semibold shadow-lg
          hover:scale-110 transition hover:shadow-red-600/40">
          Donate Now
        </button>
      </header>

      {/* ================= EMERGENCY BANNER ================= */}
      <div className="text-center bg-red-600 animate-pulse py-2 font-semibold shadow-lg">
        🚨 URGENT: O- Blood Required Immediately 🚨
      </div>

      {/* ================= HERO ================= */}
      <section className="text-center py-20 px-6">
        <h2 className="text-5xl md:text-6xl font-bold mb-6
          bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
          Save Lives. Donate Blood.
        </h2>

        <p className="text-gray-300 max-w-2xl mx-auto">
          One donation can save up to 3 lives. Find nearby donors or become a
          hero today.
        </p>
      </section>

      {/* ================= SEARCH ================= */}
      <section className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row gap-4
          bg-black/40 backdrop-blur-lg p-5 rounded-2xl border border-red-600/30 shadow-xl">

          <input
            type="text"
            placeholder="Search donor by name or city..."
            className="flex-1 p-3 rounded-lg bg-black/60 border border-red-500/40 focus:border-red-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="p-3 rounded-lg bg-black/60 border border-red-500/40"
          >
            <option>All</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
        </div>
      </section>

      {/* ================= DONORS ================= */}
      <section className="max-w-6xl mx-auto px-6 pb-20">

        {filtered.length === 0 && (
          <p className="text-center text-gray-400">No donors found</p>
        )}

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((donor) => (
            <div
              key={donor.id}
              className="bg-black/40 backdrop-blur-lg border border-red-600/20
              rounded-2xl p-6 shadow-xl hover:scale-105 hover:border-red-500
              transition duration-300"
            >
              <h3 className="text-lg font-semibold">{donor.name}</h3>
              <p className="text-gray-400">{donor.city}</p>

              <div className="mt-4 flex justify-between items-center">

                {/* blood badge */}
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                  {donor.group}
                </span>

                <button className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded-md text-sm">
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="text-center py-6 border-t border-red-600/20 text-gray-400">
        ❤️ Every drop counts. LifeSaver Blood Donation Platform
      </footer>
    </div>
  );
}

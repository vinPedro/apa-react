
export default function StatusCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 hover:shadow-lg transition">
      <p className="text-gray-500 text-sm uppercase font-semibold">{title}</p>
      <p className="text-3xl font-bold text-blue-900 mt-1">{value}</p>
    </div>
  );
}
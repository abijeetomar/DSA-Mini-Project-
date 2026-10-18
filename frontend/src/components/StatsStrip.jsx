export default function StatsStrip({ stats }) {
  if (!stats) return null;

  const { algorithmUsed, sortedBy, comparisons, timeTakenMs } = stats;

  return (
    <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 text-white shadow-lg border border-indigo-500/30">
      <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm text-2xl shadow-inner">
            📊
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span>Algorithm Benchmark Result</span>
              <span className="text-xs bg-white/25 px-2.5 py-0.5 rounded-full font-semibold">
                Live Execution
              </span>
            </h3>
            <p className="text-xs text-indigo-100">
              Sorted by <span className="font-semibold text-white capitalize">{sortedBy}</span> using manual algorithm implementation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center md:text-right">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
            <span className="block text-xs uppercase font-medium text-indigo-200">Algorithm</span>
            <span className="text-sm sm:text-base font-bold text-white">{algorithmUsed}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
            <span className="block text-xs uppercase font-medium text-indigo-200">Sorted Field</span>
            <span className="text-sm sm:text-base font-bold text-white capitalize">{sortedBy}</span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
            <span className="block text-xs uppercase font-medium text-indigo-200">Comparisons</span>
            <span className="text-sm sm:text-base font-bold text-amber-300 font-mono">
              {Number(comparisons).toLocaleString()}
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10">
            <span className="block text-xs uppercase font-medium text-indigo-200">Time Taken</span>
            <span className="text-sm sm:text-base font-bold text-emerald-300 font-mono">
              {timeTakenMs} ms
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

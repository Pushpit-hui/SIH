const stats = [
  { label: "Total Cases", value: "1,240", change: "+12.5%", icon: "cases", tone: "bg-blue-50 text-blue-600" },
  { label: "Active Applications", value: "342", change: "+8.2%", icon: "folder", tone: "bg-violet-50 text-violet-600" },
  { label: "Resolved Issues", value: "858", change: "+18.7%", icon: "check", tone: "bg-emerald-50 text-emerald-600" },
  { label: "Pending Alerts", value: "40", change: "-3.1%", icon: "alert", tone: "bg-amber-50 text-amber-600" },
];

const cases = [
  { id: "SIH-2024-0187", title: "Smart irrigation monitoring", status: "In Progress", date: "May 24, 2024" },
  { id: "SIH-2024-0186", title: "Rural health access system", status: "Approved", date: "May 23, 2024" },
  { id: "SIH-2024-0185", title: "Waste management portal", status: "Pending", date: "May 22, 2024" },
  { id: "SIH-2024-0184", title: "Digital learning platform", status: "Approved", date: "May 21, 2024" },
];

const activities = [
  { title: "Case SIH-2024-0187 updated", detail: "Application moved to review", time: "12 min ago", color: "bg-blue-500" },
  { title: "New case submitted", detail: "Waste management portal", time: "48 min ago", color: "bg-violet-500" },
  { title: "Case approved", detail: "Digital learning platform", time: "2 hrs ago", color: "bg-emerald-500" },
  { title: "Report generated", detail: "Weekly performance summary", time: "5 hrs ago", color: "bg-amber-500" },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    folder: <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-10Z" />,
    file: <><path d="M6 3h8l4 4v14H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" /><path d="M14 3v5h5M8 13h8M8 17h6" /></>,
    chart: <><path d="M4 19V5M4 19h16" /><path d="m7 15 4-4 3 2 5-6" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20.3h-3v-.08A1.7 1.7 0 0 0 10.68 18.66a1.7 1.7 0 0 0-1.88.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 7.02 15 1.7 1.7 0 0 0 5.46 14H5.4v-3h.06A1.7 1.7 0 0 0 7.02 10a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.12-2.12.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.7 4.78V4.7h3v.08a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06A1.7 1.7 0 0 0 19.4 10 1.7 1.7 0 0 0 20.96 11H21v3h-.04A1.7 1.7 0 0 0 19.4 15Z" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" /></>,
    cases: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 4v-1M16 4v-1M3 9h18M8 13h3M8 16h6" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16.5 9" /></>,
    alert: <><path d="M10.3 4.4 3.4 17a2 2 0 0 0 1.75 3h13.7a2 2 0 0 0 1.75-3L13.7 4.4a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    down: <path d="m7 10 5 5 5-5" />,
  };

  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
        <div className="mb-10 flex items-center gap-3 px-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-sm font-bold text-white">S</div>
          <div><p className="text-base font-bold tracking-tight text-slate-900">SIH PS 107</p><p className="text-xs text-slate-400">Portal Dashboard</p></div>
        </div>
        <nav className="space-y-1">
          {[["Dashboard", "grid"], ["Applications / Cases", "folder"], ["Reports", "file"], ["Analytics", "chart"], ["Settings", "settings"]].map(([label, icon], index) => (
            <a key={label} href="#" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${index === 0 ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}`}>
              <Icon name={icon} className="h-5 w-5" />{label}
            </a>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-slate-900 p-4 text-white"><p className="text-sm font-semibold">Need assistance?</p><p className="mt-1 text-xs leading-5 text-slate-300">Get help from the SIH support team.</p><button className="mt-3 text-xs font-semibold text-blue-300">Contact support →</button></div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3 lg:hidden"><div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-sm font-bold text-white">S</div><span className="font-bold text-slate-900">SIH PS 107</span></div>
          <div className="relative hidden w-full max-w-md lg:block"><Icon name="search" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input aria-label="Search cases or data" placeholder="Search cases or data..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50" /></div>
          <div className="flex items-center gap-3"><button aria-label="Notifications" className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100"><Icon name="bell" className="h-5 w-5" /><span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-white bg-rose-500" /></button><div className="hidden h-8 w-px bg-slate-200 sm:block" /><button className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-50"><div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xs font-bold text-white">PK</div><span className="hidden text-left sm:block"><span className="block text-sm font-semibold text-slate-700">Pushpit Kumar</span><span className="block text-xs text-slate-400">Administrator</span></span><Icon name="down" className="hidden h-4 w-4 text-slate-400 sm:block" /></button></div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-sm font-medium text-blue-600">Welcome back, Pushpit</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">SIH PS 107 Overview</h1><p className="mt-1 text-sm text-slate-500">Here is what’s happening across your portal today.</p></div><button className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-600 shadow-sm"><span className="h-2 w-2 rounded-full bg-blue-500" />May 1 – May 31, 2024<Icon name="down" className="h-4 w-4" /></button></div>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{stat.label}</p><p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</p></div><div className={`grid h-10 w-10 place-items-center rounded-xl ${stat.tone}`}><Icon name={stat.icon} className="h-5 w-5" /></div></div><p className="mt-4 text-xs text-slate-400"><span className={`mr-1 font-semibold ${stat.change.startsWith("-") ? "text-rose-600" : "text-emerald-600"}`}>{stat.change}</span> vs. last month</p></article>)}
          </section>

          <section className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)]">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-bold text-slate-900">Case Analytics</h2><p className="mt-1 text-sm text-slate-500">Cases received and resolved this month</p></div><select aria-label="Analytics period" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 outline-none"><option>Last 6 months</option></select></div><div className="mt-8 flex h-56 items-end gap-3 border-b border-l border-slate-100 px-5 pt-3 sm:gap-5">{[38, 55, 44, 68, 57, 82, 71, 90, 67, 78, 95, 84].map((height, i) => <div key={i} className="group flex h-full flex-1 items-end"><div style={{ height: `${height}%` }} className="w-full rounded-t-md bg-blue-100 transition hover:bg-blue-500"><div className="h-2/3 w-full rounded-t-md bg-blue-500" /></div></div>)}</div><div className="mt-3 flex justify-between text-[11px] text-slate-400"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span></div><div className="mt-5 flex gap-5 text-xs text-slate-500"><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-blue-500" />Applications</span><span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-blue-100" />Resolved</span></div></article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Recent Activity</h2><p className="mt-1 text-sm text-slate-500">Latest portal updates</p></div><button className="text-xs font-semibold text-blue-600">View all</button></div><div className="mt-6 space-y-5">{activities.map((activity) => <div key={activity.title} className="flex gap-3"><div className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${activity.color}`} /><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-700">{activity.title}</p><p className="mt-0.5 text-xs text-slate-500">{activity.detail}</p></div><span className="shrink-0 text-[11px] text-slate-400">{activity.time}</span></div>)}</div></article>
          </section>

          <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:px-6"><div><h2 className="font-bold text-slate-900">Recent Applications / Cases</h2><p className="mt-1 text-sm text-slate-500">Track the latest submissions and their current status.</p></div><button className="text-sm font-semibold text-blue-600">View all cases</button></div><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400"><tr><th className="px-6 py-3.5">Case ID</th><th className="px-6 py-3.5">Title</th><th className="px-6 py-3.5">Status</th><th className="px-6 py-3.5">Date</th><th className="px-6 py-3.5 text-right">Action</th></tr></thead><tbody className="divide-y divide-slate-100">{cases.map((item) => <tr key={item.id} className="text-sm"><td className="px-6 py-4 font-semibold text-blue-600">{item.id}</td><td className="px-6 py-4 font-medium text-slate-700">{item.title}</td><td className="px-6 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === "Approved" ? "bg-emerald-50 text-emerald-700" : item.status === "Pending" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"}`}>{item.status}</span></td><td className="px-6 py-4 text-slate-500">{item.date}</td><td className="px-6 py-4 text-right"><button aria-label={`View ${item.id}`} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600"><Icon name="arrow" className="h-4 w-4" /></button></td></tr>)}</tbody></table></div></section>
        </main>
      </div>
    </div>
  );
}

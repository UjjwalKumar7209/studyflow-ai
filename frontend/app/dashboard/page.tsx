import AppLayout from '@/components/layout/AppLayout'

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>

        <div className="grid grid-cols-4 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Documents</p>

            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Notes</p>

            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Flashcards</p>

            <p className="mt-2 text-3xl font-bold">0</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Avg Score</p>

            <p className="mt-2 text-3xl font-bold">0%</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

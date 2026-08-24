import { Bone } from '@/components/Skeleton/Bone.tsx'

const panelClass = 'rounded-lg bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]'

export function AdminArticleFormSkeleton() {
  return (
    <div className="space-y-5" aria-busy aria-label="加载中">
      <section className={`${panelClass} px-5 py-4`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Bone className="h-6 w-28" />
            <Bone className="h-4 w-48" />
          </div>
          <Bone className="h-4 w-16" />
        </div>
      </section>

      <section className={`${panelClass} p-5`}>
        <Bone className="mb-4 h-4 w-16" />
        <div className="space-y-4">
          <div>
            <Bone className="mb-1.5 h-4 w-10" />
            <Bone className="h-10 w-full" />
          </div>
          <div>
            <Bone className="mb-1.5 h-4 w-10" />
            <Bone className="h-20 w-full" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Bone className="mb-1.5 h-4 w-10" />
              <Bone className="h-10 w-full" />
            </div>
            <div>
              <Bone className="mb-1.5 h-4 w-10" />
              <Bone className="h-10 w-full" />
            </div>
          </div>
          <div>
            <Bone className="mb-1.5 h-4 w-24" />
            <Bone className="h-10 w-full" />
          </div>
        </div>
      </section>

      <section className={`${panelClass} p-5`}>
        <Bone className="mb-4 h-4 w-16" />
        <Bone className="h-[360px] w-full" />
      </section>

      <section className="sticky bottom-0 z-10 rounded-lg bg-white px-5 py-3 shadow-[0_-1px_4px_rgba(16,24,40,0.05)]">
        <div className="flex justify-end gap-3">
          <Bone className="h-10 w-16" />
          <Bone className="h-10 w-20" />
        </div>
      </section>
    </div>
  )
}

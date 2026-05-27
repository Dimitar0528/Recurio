import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-background text-foreground pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-22">
        <section className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-4">
          <div className="space-y-3 flex flex-col items-center md:items-start w-full md:w-auto">
            <Skeleton className="h-8 w-56 md:w-64 " />
            <Skeleton className="h-5 w-44 md:w-52" />
          </div>
          <Skeleton className="h-10 w-full md:w-56 rounded-md" />
        </section>

        <section className="mb-8 bg-muted/10 border border-border/40 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="space-y-2 w-full md:w-auto">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48 md:w-64" />
            </div>
          </div>
          <Skeleton className="h-4 w-24 shrink-0" />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div
            className="group relative rounded-3xl overflow-hidden bg-card border border-border p-4 flex flex-col justify-between h-44"
            style={{
              clipPath:
                "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
            }}>
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="size-9 rounded-xl shrink-0" />
            </div>
            <div className="flex items-end gap-6 relative">
              <div className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-secondary" />
          </div>

          <div
            className="group relative rounded-3xl overflow-hidden bg-foreground/9 dark:bg-card border border-border/80 p-4 flex flex-col justify-between h-44"
            style={{
              clipPath:
                "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
            }}>
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="size-9 rounded-xl shrink-0" />
            </div>
            <div className="flex items-end gap-6 relative">
              <div className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-28" />
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-secondary" />
          </div>
        </section>

        <section className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="border-2 border-primary bg-primary rounded-xl py-3 px-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              <Skeleton className="h-5 w-40 mx-auto bg-primary-foreground/40" />
            </div>
            <div className="flex flex-col md:flex-row gap-2 py-2">
              <div className="flex grow gap-4">
                <Skeleton className="h-9 w-full md:max-w-md rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
              <div className="md:ml-auto">
                <Skeleton className="h-9 w-32 rounded-md" />
              </div>
            </div>
            <div className="border border-border/40 rounded-xl overflow-hidden bg-card/20">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-muted/40 p-4 border-b border-border/40">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16 hidden md:block" />
                <Skeleton className="h-4 w-16 hidden md:block" />
                <Skeleton className="h-4 w-20 hidden md:block" />
                <Skeleton className="h-4 w-12 text-right justify-self-end" />
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 border-b border-border/10 last:border-0 items-center bg-card/50">
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-6 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-4 w-16 hidden md:block" />
                  <Skeleton className="h-4 w-16 hidden md:block" />
                  <Skeleton className="h-4 w-20 hidden md:block" />
                  <Skeleton className="h-4 w-12 text-right justify-self-end" />
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 pt-4 border-t border-border/30 mt-4">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
              <div className="flex gap-2 justify-center">
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="size-8 rounded-lg" />
                <Skeleton className="size-8 rounded-lg" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 max-lg:border-t lg:border-l lg:pl-6 pt-6 lg:pt-0 border-border/60 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-2.5 w-full rounded-full" />
              <Skeleton className="h-5 w-32 rounded-full" />
            </div>

            <div className="border-t border-border/60 my-2" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-32" />
                <div className="flex gap-1 p-0.5 bg-muted rounded-full">
                  <Skeleton className="h-5 w-14 rounded-full" />
                  <Skeleton className="h-5 w-14 rounded-full" />
                </div>
              </div>
              <div className="flex h-2.5 w-full rounded-full overflow-hidden gap-0.5 bg-muted">
                <Skeleton className="h-full w-[40%] bg-muted-foreground/20 rounded-l-full" />
                <Skeleton className="h-full w-[25%] bg-muted-foreground/15" />
                <Skeleton className="h-full w-[15%] bg-muted-foreground/10" />
                <Skeleton className="h-full w-[20%] bg-muted-foreground/5 rounded-r-full" />
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 py-1">
                    <Skeleton className="size-2 rounded-full shrink-0" />
                    <Skeleton className="h-3.5 w-20 grow" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="lg:w-3xl mx-auto bg-foreground/95 text-background dark:bg-card dark:border dark:border-border rounded-2xl p-4 mt-8 relative overflow-hidden"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
          }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-1">
            <div className="space-y-2 text-center md:text-left flex flex-col items-center md:items-start w-full md:w-auto">
              <Skeleton className="h-3 w-28 bg-background/20 dark:bg-muted" />
              <Skeleton className="h-4 w-full max-w-sm bg-background/20 dark:bg-muted" />
            </div>
            <Skeleton
              className="h-10 w-36 bg-background dark:bg-primary shrink-0"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)",
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

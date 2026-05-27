import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main
      id="main-content"
      className="min-h-screen bg-background text-foreground pb-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 pt-16">

        <section className="grid lg:grid-cols-12 gap-16 items-center relative py-12">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-screen h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
          <div className="lg:col-span-4 space-y-7 relative z-10 mx-auto text-center flex flex-col items-center">
            <div className="space-y-5 w-full flex flex-col items-center">
              <Skeleton className="h-10 w-48 md:w-64" />
              <Skeleton className="h-8 w-32 md:w-44" />
            </div>
            <div className="space-y-2 w-full max-w-sm flex flex-col items-center">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex items-center gap-6 justify-center w-full">
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-8 w-10" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex flex-col items-center gap-2">
                <Skeleton className="h-8 w-10" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-8 relative z-10 w-full">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border/50" />
            <div className="space-y-10 relative">
              <div className="space-y-6">
                <div className="pl-16">
                  <Skeleton className="h-4 w-32" />
                </div>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between pl-16 py-2 relative">
                    <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-muted-foreground/30" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="size-10 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-28 md:w-36" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
              <div className="pl-16 py-5 relative">
                <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary/30" />
                <div className="h-px w-full bg-border/50 relative">
                  <Skeleton className="absolute -top-1.5 left-0 h-3 w-16" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="pl-16">
                  <Skeleton className="h-4 w-24" />
                </div>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between pl-16 py-2 relative">
                    <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-muted-foreground/30" />
                    <div className="flex items-center gap-4">
                      <Skeleton className="size-10 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-28 md:w-36" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <Skeleton className="h-5 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="w-full space-y-8 relative z-10 border border-border/40 rounded-2xl p-6 bg-card/50">
            <div className="flex items-center gap-4 justify-between pb-3 border-b border-border/40 flex-wrap">
              <Skeleton className="h-8 w-44" />
              <div className="flex gap-1 p-1 bg-muted/30 rounded-lg border border-border/30">
                <Skeleton className="h-7 w-20 rounded-md" />
                <Skeleton className="h-7 w-20 rounded-md" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:gap-0 md:divide-x md:divide-border/40">
              <div className="space-y-2 px-4">
                <Skeleton className="h-3 w-20 mx-auto" />
                <Skeleton className="h-7 w-24 mx-auto" />
              </div>
              <div className="space-y-2 px-4">
                <Skeleton className="h-3 w-20 mx-auto" />
                <Skeleton className="h-7 w-24 mx-auto" />
              </div>
              <div className="space-y-2 px-4">
                <Skeleton className="h-3 w-20 mx-auto" />
                <Skeleton className="h-7 w-24 mx-auto" />
              </div>
              <div className="space-y-2 px-4">
                <Skeleton className="h-3 w-20 mx-auto" />
                <Skeleton className="h-7 w-24 mx-auto" />
              </div>
            </div>
            <div className="h-[300px] md:h-[380px] w-full bg-muted/10 border border-border/20 rounded-2xl p-6 flex flex-col justify-end gap-4">
              <div className="flex items-end justify-between h-full gap-4 px-2">
                <Skeleton className="h-[40%] w-[12%] md:w-[8%] rounded-t-lg" />
                <Skeleton className="h-[70%] w-[12%] md:w-[8%] rounded-t-lg" />
                <Skeleton className="h-[50%] w-[12%] md:w-[8%] rounded-t-lg" />
                <Skeleton className="h-[85%] w-[12%] md:w-[8%] rounded-t-lg" />
                <Skeleton className="h-[60%] w-[12%] md:w-[8%] rounded-t-lg" />
                <Skeleton className="h-[95%] w-[12%] md:w-[8%] rounded-t-lg" />
              </div>
              <div className="h-px bg-border/40 w-full" />
              <div className="flex justify-between px-2">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="relative overflow-hidden bg-linear-to-b from-card to-card/95 border border-border/80 rounded-2xl p-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4 px-2 pt-2">
              <div className="space-y-3 w-full md:w-auto">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-8 w-full md:w-80 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-full md:w-64 rounded-full" />
            </div>
            <div className="overflow-x-auto rounded-xl border border-border/40 bg-card/40">
              <div className="w-full min-w-[600px]">
                <div className="flex bg-muted/30 py-3 px-4 border-b border-border/40 justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex py-4 px-4 border-b border-border/10 justify-between items-center last:border-0">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-6 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 pt-4 border-t border-border/30 mt-4">
              <div className="flex items-center gap-2">
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
        </section>
        
      </div>
    </main>
  );
}

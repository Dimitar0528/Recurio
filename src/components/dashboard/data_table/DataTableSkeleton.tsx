import { Skeleton } from "@/components/ui/skeleton";
import { Table,TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

export default function DataTableSkeleton (){
    return (
        <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-sm overflow-hidden px-2">
                <div className="p-3 px-4 border-b border-border bg-primary rounded-2xl">
                  <Skeleton className="h-4 w-32 sm:w-40 mx-auto bg-white/30" />
                </div>
                <div className="flex flex-col md:flex-row gap-3 py-4 px-4">
                  <Skeleton className="h-9 w-2/3 mx-auto" />
                  <Skeleton className="h-9 w-1/3 mx-auto" />
                </div>
                <div className="hidden md:block overflow-hidden rounded-md border mx-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <TableHead key={i}>
                            <Skeleton className="h-5 w-20" />
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 5 }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {Array.from({ length: 7 }).map((_, cellIndex) => (
                            <TableCell key={cellIndex}>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="md:hidden px-4 space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-border rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                      <div className="flex gap-4">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <div className="flex flex-col gap-3 -mt-22 -mr-2">
                          <Skeleton className="h-7 w-15 rounded-md" />
                          <Skeleton className="h-7 w-15 rounded-md" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between py-4 px-4 gap-4">
                  <Skeleton className="h-4 w-40" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8 hidden lg:block" />
                  </div>
                </div>
              </div>
    )
}
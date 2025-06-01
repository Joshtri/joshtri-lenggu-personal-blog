import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Column {
  label: string;
  accessor: string | ((item: any, index: number) => React.ReactNode);
  center?: boolean;
}

interface CardGridProps {
  data: any[];
  columns: Column[];
  actionsConfig?: any;
  isLoading?: boolean;
}

export default function CardGrid({
  data,
  columns,
  actionsConfig,
  isLoading,
}: CardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item, i) => (
        <Card key={item.id || i} className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {typeof columns[0].accessor === "function"
                ? columns[0].accessor(item, i)
                : item[columns[0].accessor]}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {typeof columns[1].accessor === "function"
                ? columns[1].accessor(item, i)
                : item[columns[1].accessor]}
            </p>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            {columns[2] && (
              <p>
                {typeof columns[2].accessor === "function"
                  ? columns[2].accessor(item, i)
                  : item[columns[2].accessor]}
              </p>
            )}

            {actionsConfig?.onView && (
              <button
                onClick={() => actionsConfig.onView(item)}
                className="text-blue-600 hover:underline text-sm"
              >
                Lihat Detail
              </button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

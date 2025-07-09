import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface HistoryEntry {
  _id: string;
  updatedAt: string;
  description: string;
  status: string;
}

export default function History({ history }: { history: HistoryEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <CardContent>
        {history && history.length > 0 ? (
          history.map((entry) => (
            <div key={entry._id} className="flex items-center gap-4 mb-2">
              <span>{new Date(entry.updatedAt).toLocaleString()}</span>
              <span>{entry.description}</span>
              <span>{entry.status}</span>
              {/* Optionally add a status icon here */}
            </div>
          ))
        ) : (
          <div>No history found.</div>
        )}
      </CardContent>
    </Card>
  );
}
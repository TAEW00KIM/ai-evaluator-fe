import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { LeaderboardRow } from "../types";

export default function LeaderboardPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchLeaderboard() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/leaderboard/${assignmentId}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data: LeaderboardRow[] = await res.json();
        if (!ignore) setRows(data);
      } catch (e: any) {
        if (!ignore) setError(e?.message ?? "Failed to load leaderboard");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (assignmentId) fetchLeaderboard();
    return () => {
      ignore = true;
    };
  }, [assignmentId]);

  if (loading) return <div style={{ padding: 16 }}>불러오는 중…</div>;
  if (error)
    return <div style={{ padding: 16, color: "crimson" }}>오류: {error}</div>;
  if (!rows.length)
    return <div style={{ padding: 16 }}>데이터가 없습니다.</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>리더보드 (과제 #{assignmentId})</h2>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}
      >
        <thead>
          <tr>
            <th style={th}>등수</th>
            <th style={th}>학생명</th>
            <th style={th}>최고점</th>
            <th style={th}>마지막 제출시각</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.studentId}-${r.rank}`}>
              <td style={td}>{r.rank}</td>
              <td style={td}>{r.studentName}</td>
              <td style={td}>{r.bestScore.toFixed(2)}</td>
              <td style={td}>{new Date(r.lastSubmittedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = {
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  padding: 8,
};
const td: React.CSSProperties = { borderBottom: "1px solid #eee", padding: 8 };

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate 추가
import type { LeaderboardRow, Assignment } from "../types"; // Assignment 타입 임포트
import apiClient from "../api"; // apiClient 임포트

export default function LeaderboardPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]); // 과제 목록 상태 추가
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    assignmentId || ""
  ); // 선택된 과제 ID 상태 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 과제 목록 불러오기 useEffect
  useEffect(() => {
    let ignore = false;
    async function fetchAssignments() {
      try {
        const res = await apiClient.get("/api/assignments");
        if (!ignore) {
          const fetchedAssignments: Assignment[] = res.data.data;
          setAssignments(fetchedAssignments);
          // URL 파라미터가 없거나 유효하지 않으면 첫 번째 과제를 기본값으로 설정
          if (
            (!assignmentId ||
              !fetchedAssignments.some((a) => String(a.id) === assignmentId)) &&
            fetchedAssignments.length > 0
          ) {
            const defaultId = String(fetchedAssignments[0].id);
            setSelectedAssignmentId(defaultId);
            // URL도 기본값으로 변경 (선택사항)
            navigate(`/leaderboard/${defaultId}`, { replace: true });
          } else {
            setSelectedAssignmentId(
              assignmentId ||
                (fetchedAssignments.length > 0
                  ? String(fetchedAssignments[0].id)
                  : "")
            );
          }
        }
      } catch (e) {
        if (!ignore) console.error("Failed to load assignments", e);
      }
    }
    fetchAssignments();
    return () => {
      ignore = true;
    };
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // 리더보드 데이터 불러오기 useEffect
  useEffect(() => {
    let ignore = false;
    async function fetchLeaderboard() {
      if (!selectedAssignmentId) {
        setLoading(false);
        setRows([]); // 선택된 과제가 없으면 데이터 비움
        return;
      }
      try {
        setLoading(true);
        setError(null);
        // apiClient 사용하도록 수정
        const res = await apiClient.get(
          `/api/leaderboard/${selectedAssignmentId}`
        );
        // 백엔드 ApiResponse 구조에 맞게 데이터 추출
        const data: LeaderboardRow[] = res.data; // 백엔드 API가 List<LeaderboardRowDto>를 바로 반환하므로 .data 사용
        if (!ignore) setRows(data);
      } catch (e: any) {
        if (!ignore) setError(e?.message ?? "Failed to load leaderboard");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchLeaderboard();
    return () => {
      ignore = true;
    };
  }, [selectedAssignmentId]); // selectedAssignmentId가 변경될 때마다 실행

  // 드롭다운 변경 핸들러
  const handleAssignmentChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newAssignmentId = event.target.value;
    setSelectedAssignmentId(newAssignmentId);
    navigate(`/leaderboard/${newAssignmentId}`); // URL 변경
  };

  return (
    <div style={{ padding: 16 }}>
      {/* 과제 선택 드롭다운 */}
      <div>
        <label htmlFor="assignment-select">과제 선택: </label>
        <select
          id="assignment-select"
          value={selectedAssignmentId}
          onChange={handleAssignmentChange}
          style={{ marginBottom: "1rem", padding: "0.5rem" }}
        >
          {assignments.length === 0 && (
            <option value="" disabled>
              과제를 불러오는 중...
            </option>
          )}
          {assignments.map((assignment) => (
            <option key={assignment.id} value={assignment.id}>
              {assignment.title} (ID: {assignment.id})
            </option>
          ))}
        </select>
      </div>

      <h2>리더보드 (과제 #{selectedAssignmentId || "선택 안됨"})</h2>

      {/* 로딩, 에러, 데이터 없음 처리 */}
      {loading && <div style={{ padding: 16 }}>불러오는 중…</div>}
      {error && (
        <div style={{ padding: 16, color: "crimson" }}>오류: {error}</div>
      )}
      {!loading && !error && !rows.length && selectedAssignmentId && (
        <div style={{ padding: 16 }}>데이터가 없습니다.</div>
      )}
      {!loading && !error && !selectedAssignmentId && (
        <div style={{ padding: 16 }}>과제를 선택해주세요.</div>
      )}

      {/* 리더보드 테이블 (데이터가 있을 때만 렌더링) */}
      {!loading && !error && rows.length > 0 && (
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
                {/* 백엔드 DTO가 String으로 내려주므로 new Date() 사용 */}
                <td style={td}>
                  {new Date(r.lastSubmittedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 스타일 정의 (기존과 동일)
const th: React.CSSProperties = {
  borderBottom: "1px solid #ddd",
  textAlign: "left",
  padding: 8,
};
const td: React.CSSProperties = { borderBottom: "1px solid #eee", padding: 8 };

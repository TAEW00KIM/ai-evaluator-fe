import React, { useState, useEffect } from "react";
import apiClient from "../api";
import type { Assignment } from "../types";

function AssignmentAdminPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [scriptFile, setScriptFile] = useState<File | null>(null);

  const handleScriptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setScriptFile(e.target.files[0]);
    } else {
      setScriptFile(null);
    }
  };

  // 토글 핸들러
  async function toggleLeaderboard(id: number, nextHidden: boolean) {
    try {
      const res = await apiClient.patch(
        `/api/admin/assignments/${id}/leaderboard`,
        { hidden: nextHidden }
      );
      const updated = res.data; // 백엔드에서 AssignmentDto 반환 시
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
      );
    } catch (e) {
      console.error("리더보드 토글 실패", e);
      alert("리더보드 상태 변경에 실패했습니다.");
    }
  }

  async function toggleSubmissions(id: number, nextClosed: boolean) {
    try {
      const res = await apiClient.patch(
        `/api/admin/assignments/${id}/submissions`,
        { closed: nextClosed }
      );
      const updated = res.data; // 백엔드에서 AssignmentDto 반환 시
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updated } : a))
      );
    } catch (e) {
      console.error("제출 허용/마감 토글 실패", e);
      alert("제출 상태 변경에 실패했습니다.");
    }
  }

  const fetchAssignments = () => {
    apiClient
      .get("/api/assignments")
      .then((response) => {
        setAssignments(response.data.data);
      })
      .catch((error) => {
        console.error("과제 목록 로딩 실패", error);
      });
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await apiClient.post("/api/admin/assignments", { title, description });
      setMessage("새로운 과제가 성공적으로 등록되었습니다.");
      // 등록 성공 후 입력 필드 초기화 및 목록 새로고침
      setTitle("");
      setDescription("");
      fetchAssignments();
    } catch (error) {
      setMessage("과제 등록에 실패했습니다.");
      console.error(error);
    }
  };

  const handleDelete = async (assignmentId: number) => {
    // 사용자에게 정말 삭제할 것인지 확인받음
    if (
      window.confirm(
        `정말로 '${
          assignments.find((a) => a.id === assignmentId)?.title
        }' 과제를 삭제하시겠습니까?`
      )
    ) {
      try {
        await apiClient.delete(`/api/admin/assignments/${assignmentId}`);
        setMessage("과제가 성공적으로 삭제되었습니다.");
        // 삭제 성공 후 목록 새로고침
        fetchAssignments();
      } catch (error) {
        setMessage(
          "과제 삭제에 실패했습니다. 해당 과제에 연결된 제출 기록이 있는지 확인해주세요."
        );
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h1>과제 관리</h1>

      <h2>새 과제 등록</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>과제 제목: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "300px" }}
          />
        </div>
        <br />
        <div>
          <label>과제 설명: </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "300px", height: "100px" }}
          />
        </div>
        <br />
        <button type="submit">
          <svg
            className="icon"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14m-7-7h14" />
          </svg>
          과제 등록하기
        </button>
      </form>
      {message && <p>{message}</p>}

      <hr style={{ margin: "30px 0" }} />

      <h2>등록된 과제 목록</h2>
      <table>
        <thead>
          <tr>
            <th>과제 제목</th>
            <th>리더보드</th>
            <th>제출 허용</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
            <tr key={assignment.id}>
              <td>
                <strong>{assignment.title}</strong> (ID: {assignment.id})
              </td>
              <td>
                <button
                  onClick={() =>
                    toggleLeaderboard(
                      assignment.id,
                      !assignment.leaderboardHidden
                    )
                  }
                  style={{
                    backgroundColor: assignment.leaderboardHidden
                      ? "#777"
                      : "#4CAF50",
                    color: "white",
                    marginRight: "10px",
                  }}
                >
                  {assignment.leaderboardHidden
                    ? "리더보드 열기"
                    : "리더보드 닫기"}
                </button>
              </td>
              <td>
                <button
                  onClick={() =>
                    toggleSubmissions(
                      assignment.id,
                      !assignment.submissionsClosed
                    )
                  }
                  style={{
                    backgroundColor: assignment.submissionsClosed
                      ? "#777"
                      : "#4CAF50",
                    color: "white",
                    marginRight: "10px",
                  }}
                >
                  {assignment.submissionsClosed ? "제출 열기" : "제출 닫기"}
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleDelete(assignment.id)}
                  className="danger"
                >
                  <svg
                    className="icon"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <hr style={{ margin: "30px 0" }} />

      <h2>채점 스크립트 업데이트</h2>
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          // input.files[0] 대신 state 사용
          if (!scriptFile) {
            return alert("업로드할 파일을 선택해주세요.");
          }

          const formData = new FormData();
          formData.append("file", scriptFile);

          try {
            const res = await apiClient.post(
              "/api/admin/grading-script",
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            alert("✅ " + res.data);
            setScriptFile(null); // 성공 시 파일 선택 초기화
            // DOM 직접 접근 대신, input의 value를 리셋하기 위해 key를 바꾸거나 폼을 리셋할 수 있지만,
            // 간단하게 DOM을 직접 리셋합니다.
            const input = document.getElementById(
              "gradingScript"
            ) as HTMLInputElement;
            if (input) input.value = "";
          } catch (err: any) {
            alert("❌ 업로드 실패: " + (err.response?.data || err.message));
          }
        }}
      >
        {/* SubmitPage와 동일한 UI 패턴 적용 */}
        <label htmlFor="gradingScript" className="custom-file-upload">
          <svg
            className="icon"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          채점 스크립트 (.py) 선택
        </label>
        <input
          id="gradingScript"
          type="file"
          accept=".py"
          onChange={handleScriptFileChange} // state 연결
        />
        {scriptFile && (
          <span className="file-name" style={{ marginLeft: "1rem" }}>
            {scriptFile.name}
          </span>
        )}

        <button
          type="submit"
          style={{ marginLeft: "10px", marginTop: "1rem", display: "block" }} // 버튼을 다음 줄로 내림
        >
          업로드
        </button>
      </form>
    </div>
  );
}

export default AssignmentAdminPage;

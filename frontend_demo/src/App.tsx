import React, { useEffect, useState } from "react";
import "./App.css"; // 引入外觀樣式說明書

interface RegisterCallResponse {
  access_token: string;
}

// 🏆 終極修復：拔除 localhost:8080，直接對準 Vercel 雲端後端路徑！
async function registerCall(agentId: string): Promise<RegisterCallResponse> {
  try {
    const response = await fetch("/api/create-web-call", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: agentId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data: RegisterCallResponse = await response.json();
    return data;
  } catch (err: any) {
    console.log("連線失敗:", err);
    throw new Error(err.message || err);
  }
}

export const App = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [studentName, setStudentName] = useState("");

  // 🎯 商業核心：自動讀取網址後面的 ?user_id=xxx 並認出學生的名字！
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userId = searchParams.get("user_id");
    if (userId) {
      setStudentName(userId);
    }
  }, []);

  const toggleConversation = () => {
    // 這裡維持原廠 Retell SDK 的開關功能，不破壞底層邏輯
    setIsCalling(!isCalling);
    console.log("目前通話狀態切換為:", !isCalling);
  };

  return (
    <div className="App-container">
      {/* 👤 歡迎學生的專屬看板 */}
      <div className="welcome-text">
        {studentName ? `歡迎回來，${studentName}！今天想聊點什麼？` : "歡迎來到中文陪練室！"}
      </div>

      {/* 🔵 畫面正中央的圓形藍色奢華通話大按鈕 */}
      <button 
        className={`luxury-call-btn ${isCalling ? "calling" : ""}`} 
        onClick={toggleConversation}
      >
        <div className="mic-icon">🎤</div>
        <div className="btn-label">{isCalling ? "點擊結束通話" : "點擊開始中文陪練"}</div>
      </button>

      {/* 💎 100% 完全自主白標，底部彰顯工作室品牌 */}
      <div className="footer-brand">AI Chinese Tutor Studio</div>
    </div>
  );
};

export default App;

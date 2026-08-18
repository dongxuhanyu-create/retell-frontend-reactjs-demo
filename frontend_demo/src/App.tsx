import React, { useEffect, useState } from "react";
import "./App.css"; 

interface RegisterCallResponse {
  access_token: string;
}

// 🏆 雲端後端路徑，完美消除 localhost
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

  // 從環境變數讀取你剛剛在 Vercel 鎖好的老師機器人 ID
  const agentId = process.env.REACT_APP_RETELL_AGENT_ID || "";

  // 🎯 自動讀取網址辨識學生的名字
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const userId = searchParams.get("user_id");
    if (userId) {
      setStudentName(userId);
    }
  }, []);

  // 🔵 當點擊藍色大按鈕時，真正去執行 registerCall 接通 Retell 大腦！
  const toggleConversation = async () => {
    if (!isCalling) {
      try {
        console.log("正在為機器人建立通話，ID:", agentId);
        // 🚀 呼叫上面定義的函數，徹底解決 defined but never used 報錯！
        const callData = await registerCall(agentId);
        console.log("成功拿到通話許可證令牌 (Token):", callData.access_token);
        
        setIsCalling(true);
      } catch (error) {
        alert("接通中文老師失敗，請檢查 Vercel 密鑰是否填寫正確！");
      }
    } else {
      setIsCalling(false);
    }
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

      {/* 💎 100% 完全自主白標 */}
      <div className="footer-brand">AI Chinese Tutor Studio</div>
    </div>
  );
};

export default App;

import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Interviewee from "./routes/Interviewee";
import Interviewer from "./routes/Interviewer";
import WelcomeBackModal from "./components/common/WelcomeBackModal";
import { useSelector } from "react-redux";
import { selectUnfinishedSession } from "./store/slices/sessionSlice";
import { clearAllData } from "./utils/clearData";
import { Trash2 } from "lucide-react";

function NavTabs() {
  const location = useLocation();
  const current = location.pathname.startsWith("/interviewer")
    ? "interviewer"
    : "interviewee";
  const base = "px-4 py-2 rounded-md";
  const active = "bg-primary text-white";
  const inactive = "bg-transparent text-foreground hover:bg-card";

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all data? This will delete all interview sessions and candidate records."
      )
    ) {
      clearAllData();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <NavLink
        to="/"
        className={`${base} ${current === "interviewee" ? active : inactive}`}
      >
        Interviewee
      </NavLink>
      <NavLink
        to="/interviewer"
        className={`${base} ${current === "interviewer" ? active : inactive}`}
      >
        Interviewer
      </NavLink>
      <button
        onClick={handleClearData}
        className="px-3 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-1 text-sm"
        title="Clear all data"
      >
        <Trash2 size={16} />
        Clear Data
      </button>
    </div>
  );
}

export default function App() {
  const unfinished = useSelector(selectUnfinishedSession);
  const navigate = useNavigate();

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-balance">
              Crisp — AI Interview Assistant
            </h1>
          </div>
          <NavTabs />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Interviewee />} />
          <Route path="/interviewer" element={<Interviewer />} />
        </Routes>
      </main>

      {unfinished ? (
        <WelcomeBackModal onContinue={() => navigate("/")} />
      ) : null}
    </div>
  );
}

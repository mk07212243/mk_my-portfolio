import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CategoryProblemList } from "./pages/CategoryProblemList";
import { LanguageHub } from "./pages/LanguageHub";
import { LanguageSelect } from "./pages/LanguageSelect";
import { ProblemDetail } from "./pages/ProblemDetail";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Routes>
          <Route path="/" element={<LanguageSelect />} />
          <Route path="/languages/:language" element={<LanguageHub />} />
          <Route path="/languages/:language/level/:level" element={<CategoryProblemList />} />
          <Route path="/languages/:language/topic/:topicId" element={<CategoryProblemList />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/authContext";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { API_BASE_URL } from "../lib/utils";
import { Loader2 } from "lucide-react";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function createInterviewReview(questionText) {
  const question = (questionText || "").trim();
  const lower = question.toLowerCase();
  const wordCount = question ? question.split(/\s+/).length : 0;

  const hasOptimizationSignals = /(optimi[sz]|time complexity|space complexity|big\s*o|trade\s*-?\s*off|scal)/.test(lower);
  const hasStructureSignals = /(approach|step|first|then|explain|design|plan|implement)/.test(lower);
  const hasEdgeCaseSignals = /(edge case|corner case|invalid|constraints?|test case)/.test(lower);
  const isDetailedPrompt = wordCount >= 12;

  const communication = clamp(5 + (isDetailedPrompt ? 2 : 0) + (hasStructureSignals ? 1 : 0), 1, 10);
  const codingAbility = clamp(5 + (hasStructureSignals ? 2 : 0) + (wordCount >= 8 ? 1 : 0), 1, 10);
  const problemSolving = clamp(5 + (hasEdgeCaseSignals ? 2 : 0) + (isDetailedPrompt ? 1 : 0), 1, 10);
  const optimization = clamp(4 + (hasOptimizationSignals ? 4 : 0) + (hasEdgeCaseSignals ? 1 : 0), 1, 10);

  const total = communication + codingAbility + problemSolving + optimization;
  const overall = (total / 4).toFixed(1);

  const strengths = [
    communication >= 7 ? "Your prompt gives clear context, which helps interviewer interaction." : "You are starting with a focused problem statement.",
    codingAbility >= 7 ? "You signal a structured coding approach before implementation." : "You can improve by outlining your approach before coding.",
    optimization >= 7 ? "You show awareness of complexity and performance trade-offs." : "Consider discussing time/space complexity explicitly.",
  ];

  const nextSteps = [
    "State assumptions first, then confirm constraints out loud.",
    "Walk through one example and one edge case before final code.",
    "Finish with complexity analysis and one optimization idea.",
  ];

  return {
    communication,
    codingAbility,
    problemSolving,
    optimization,
    overall,
    strengths,
    nextSteps,
  };
}

function History() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  const { currentUser, userLoggedIn } = useAuth();
  const userId = currentUser?.uid;
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    axios.get(`${API_BASE_URL}/questions/${userId}`)
      .then(res => {
        setQuestions(res.data);
      })
      .catch(err => console.log("Failed to load questions", err))
      .finally(() => setLoading(false));
  }, [userId]);

  // Added: GSAP page intro animation for history title and cards.
  useEffect(() => {
    gsap.fromTo(headingRef.current, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" });
  }, []);

  // Added: animate list rows whenever question data changes.
  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    const rows = listRef.current.querySelectorAll("[data-history-row='true']");
    gsap.fromTo(rows, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" });
  }, [questions]);

  async function handleDelete(id) {
    try {
      await axios.delete(`${API_BASE_URL}/questions/${userId}/${id}`);
      setQuestions((prev) => prev.filter(q => q.id !== id));
    } catch (error) {
      console.log("couldn't delete question", error);
    }
  }

  function handleReattempt(question) {
    navigate("/interview/" + encodeURIComponent(question), { state: { question } });
  }

  function toggleReview(id) {
    setExpandedReviewId((prev) => (prev === id ? null : id));
  }

  if (!userLoggedIn) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="px-4 py-8 text-slate-900 dark:text-slate-100 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 ref={headingRef} className="mb-8 text-center text-5xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:text-6xl">Past Interviews</h1>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        ) : questions.length === 0 ? (
          <p className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white px-6 py-5 text-center text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">No history found.</p>
        ) : (
          <ul ref={listRef} className="space-y-4">
            {questions.map((q) => (
              <li
                key={q.id}
                data-history-row="true"
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-slate-800 dark:text-slate-100 sm:text-base">{q.question}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleReattempt(q.question)}
                      className="cursor-pointer rounded-md bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 sm:text-sm"
                    >
                      Re-attempt
                    </button>
                    <button
                      onClick={() => toggleReview(q.id)}
                      className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-300 sm:text-sm"
                    >
                      {expandedReviewId === q.id ? "Hide Review" : "View Review"}
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="cursor-pointer rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-100 sm:text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {expandedReviewId === q.id && (
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                    {(() => {
                      const review = createInterviewReview(q.question);
                      return (
                        <>
                          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-indigo-700 dark:border-indigo-400/40 dark:bg-indigo-500/15 dark:text-indigo-200">Overall: {review.overall}/10</span>
                            <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Communication: {review.communication}/10</span>
                            <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Coding: {review.codingAbility}/10</span>
                            <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Problem Solving: {review.problemSolving}/10</span>
                            <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Optimization: {review.optimization}/10</span>
                          </div>

                          <p className="mb-2 text-xs text-slate-400 dark:text-slate-500 sm:text-sm">
                            Review is estimated from the saved interview prompt and current activity signals.
                          </p>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300 sm:text-sm">Strengths</p>
                          <ul className="mb-3 mt-1 list-disc space-y-1 pl-5 text-xs text-slate-700 dark:text-slate-300 sm:text-sm">
                            {review.strengths.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>

                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300 sm:text-sm">Next Attempt Focus</p>
                          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-700 dark:text-slate-300 sm:text-sm">
                            {review.nextSteps.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </>
                      );
                    })()}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default History;

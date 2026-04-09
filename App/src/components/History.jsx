import { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/authContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { API_BASE_URL } from "../lib/utils";

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
  const [expandedReviewId, setExpandedReviewId] = useState(null);
  // AUTHLESS: currentUser is now always available
  const { currentUser } = useAuth();
  // AUTHLESS: Use static authless user ID
  const userId = "authless-user-001";
  const navigate = useNavigate();
  const headingRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    // AUTHLESS: Always load questions for authless user
    axios.get(`${API_BASE_URL}/questions/${userId}`)
      .then(res => {
        setQuestions(res.data);
      })
      .catch(err => console.log("Failed to load questions", err));
  }, []);

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
      // AUTHLESS: Use static authless user ID
      await axios.delete(`${API_BASE_URL}/questions/authless-user-001/${id}`);
      setQuestions((prev) => prev.filter(q => q.id !== id));
    } catch (error) {
      console.log("couldn't delete question", error);
    }
  }

  function handleReattempt(question) {
    navigate("/interviewSpace", { state: { question } });
  }

  function toggleReview(id) {
    setExpandedReviewId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="page-shell px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h1 ref={headingRef} className="retro-title neon-text mb-8 text-center text-5xl text-rose-100 sm:text-6xl">History</h1>

        {questions.length === 0 ? (
          <p className="glass-card mx-auto max-w-xl rounded-xl px-6 py-5 text-center text-slate-300">No history found.</p>
        ) : (
          <ul ref={listRef} className="space-y-4">
            {questions.map((q) => (
              <li
                key={q.id}
                data-history-row="true"
                className="glass-card glow-hover rounded-xl p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-sm text-slate-100 sm:text-base">{q.question}</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleReattempt(q.question)}
                      className="warm-button cursor-pointer rounded-md border border-rose-100/25 px-3 py-2 text-xs font-semibold sm:text-sm"
                    >
                      Re-attempt
                    </button>
                    <button
                      onClick={() => toggleReview(q.id)}
                      className="cursor-pointer rounded-md border border-white/20 bg-slate-900/70 px-3 py-2 text-xs font-medium text-rose-100 transition hover:-translate-y-0.5 hover:border-rose-300/45 sm:text-sm"
                    >
                      {expandedReviewId === q.id ? "Hide Review" : "View Review"}
                    </button>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="cursor-pointer rounded-md border border-red-200/20 bg-red-500/80 px-3 py-2 text-xs font-medium text-red-50 transition hover:-translate-y-0.5 hover:bg-red-500 sm:text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {expandedReviewId === q.id && (
                  <div className="mt-4 rounded-lg border border-white/15 bg-slate-950/45 p-4">
                    {(() => {
                      const review = createInterviewReview(q.question);
                      return (
                        <>
                          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                            <span className="rounded-full border border-rose-300/35 bg-rose-400/10 px-2 py-1 text-rose-100">Overall: {review.overall}/10</span>
                            <span className="rounded-full border border-slate-200/20 bg-slate-800/70 px-2 py-1 text-slate-200">Communication: {review.communication}/10</span>
                            <span className="rounded-full border border-slate-200/20 bg-slate-800/70 px-2 py-1 text-slate-200">Coding: {review.codingAbility}/10</span>
                            <span className="rounded-full border border-slate-200/20 bg-slate-800/70 px-2 py-1 text-slate-200">Problem Solving: {review.problemSolving}/10</span>
                            <span className="rounded-full border border-slate-200/20 bg-slate-800/70 px-2 py-1 text-slate-200">Optimization: {review.optimization}/10</span>
                          </div>

                          <p className="mb-2 text-xs text-slate-400 sm:text-sm">
                            Review is estimated from the saved interview prompt and current activity signals.
                          </p>

                          <p className="text-xs font-semibold uppercase tracking-wide text-rose-200 sm:text-sm">Strengths</p>
                          <ul className="mb-3 mt-1 list-disc space-y-1 pl-5 text-xs text-slate-200 sm:text-sm">
                            {review.strengths.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>

                          <p className="text-xs font-semibold uppercase tracking-wide text-rose-200 sm:text-sm">Next Attempt Focus</p>
                          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-200 sm:text-sm">
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

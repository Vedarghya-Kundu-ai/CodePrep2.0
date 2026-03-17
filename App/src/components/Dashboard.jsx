import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import axios from 'axios';
import { gsap } from 'gsap';
import { DSA_ROADMAP } from '../lib/dsaRoadmap';

const difficultyStyles = {
    Easy: "border-emerald-300/35 bg-emerald-400/10 text-emerald-200",
    Medium: "border-amber-300/35 bg-amber-400/10 text-amber-200",
    Hard: "border-rose-300/35 bg-rose-400/10 text-rose-200",
    "Not Specified": "border-slate-300/35 bg-slate-400/10 text-slate-200",
};

function Dashboard(){
    const [activeTopicIndex, setActiveTopicIndex] = useState(0);
    const [generatingQuestionId, setGeneratingQuestionId] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const activeTopic = DSA_ROADMAP[activeTopicIndex];
    const rootRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const cardRef = useRef(null);
    const listRef = useRef(null);

    // Added: GSAP intro timeline for a smoother dashboard first load.
    useEffect(() => {
        if (!rootRef.current) {
            return;
        }

        const ctx = gsap.context(() => {
            gsap.timeline({ defaults: { ease: "power3.out" } })
                .from(titleRef.current, { y: 26, opacity: 0, duration: 0.7 })
                .from(subtitleRef.current, { y: 22, opacity: 0, duration: 0.65 }, "-=0.38")
                .from(cardRef.current, { y: 28, opacity: 0, scale: 0.985, duration: 0.75 }, "-=0.35");
        }, rootRef);

        return () => ctx.revert();
    }, []);

    // Added: animate question rows whenever topic changes.
    useEffect(() => {
        if (!listRef.current) {
            return;
        }

        const items = listRef.current.querySelectorAll("[data-question-row='true']");
        gsap.fromTo(
            items,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.42, stagger: 0.045, ease: "power2.out" },
        );
    }, [activeTopicIndex]);

    async function handleGenerate(selectedQuestion, questionId) {
        if(!currentUser){
            navigate("/Login");
            return;
        } else {
            setGeneratingQuestionId(questionId);
            try {
                await axios.post("http://127.0.0.1:8000/add_question", {
                    user: currentUser.uid,
                    question: selectedQuestion,
                });
            } catch (error) {
                console.log("couldn't add question`")
                console.log(error)
            } finally {
                setGeneratingQuestionId(null);
            }
            navigate("/interviewSpace", { state: { question: selectedQuestion } });
        }
    }

    return (
        <div ref={rootRef} className="page-shell dashboard-shell mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-6xl flex-col items-center justify-center px-4 py-8 sm:px-6">
            <h1 ref={titleRef} className="retro-title neon-text mb-3 text-center text-4xl leading-relaxed text-rose-100 sm:text-5xl md:text-6xl">
                Ready to ace your next coding interview?
            </h1>
            <h2 ref={subtitleRef} className="mb-10 -mt-1 max-w-4xl text-center text-base leading-relaxed text-slate-200 sm:text-xl md:text-2xl lg:text-3xl">
                Pick a DSA topic, choose a ranked question, and generate your interview instantly.
            </h2>
            
            <div ref={cardRef} className="glass-card glow-hover floating mt-3 w-full rounded-2xl p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap gap-2">
                    {DSA_ROADMAP.map((topic, index) => (
                        <button
                            key={topic.name}
                            onClick={() => setActiveTopicIndex(index)}
                            className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
                                index === activeTopicIndex
                                    ? "border-rose-300/45 bg-rose-400/15 text-rose-100 shadow-[0_0_18px_rgba(196,82,122,0.28)]"
                                    : "border-slate-300/20 bg-slate-900/40 text-slate-200 hover:border-rose-300/35 hover:text-rose-100"
                            }`}
                            type="button"
                        >
                            {topic.name}
                        </button>
                    ))}
                </div>

                <div className="rounded-xl border border-white/15 bg-slate-950/45 p-3 sm:p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <p className="retro-title text-2xl text-rose-100 sm:text-3xl">{activeTopic.name}</p>
                        <span className="text-xs text-slate-400 sm:text-sm">{activeTopic.questions.length} questions</span>
                    </div>

                    <div ref={listRef} className="max-h-[56vh] space-y-2 overflow-y-auto pr-1">
                        {activeTopic.questions.map((item, index) => {
                            const questionId = `${activeTopic.name}-${index}`;
                            const difficultyClass = difficultyStyles[item.difficulty] || difficultyStyles["Not Specified"];
                            return (
                            <div
                                key={questionId}
                                data-question-row="true"
                                className="flex flex-col gap-3 rounded-lg border border-slate-300/15 bg-slate-900/45 p-3 sm:flex-row sm:items-center sm:justify-between"
                            >
                                <div className="min-w-0 flex-1">
                                    <span className="mb-1 block text-sm font-semibold text-slate-100 sm:text-base">
                                        {item.title}
                                    </span>
                                </div>

                                {/* Added: difficulty pill positioned in the middle free space on larger screens. */}
                                <div className="flex justify-center sm:w-32 sm:flex-none">
                                    <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${difficultyClass}`}>
                                        {item.difficulty}
                                    </span>
                                </div>

                                <button
                                    className="warm-button w-full cursor-pointer rounded-lg border border-rose-100/25 px-4 py-2 text-sm font-semibold sm:w-auto"
                                    onClick={() => handleGenerate(item.title, questionId)}
                                    disabled={generatingQuestionId === questionId}
                                    type="button"
                                >
                                    {generatingQuestionId === questionId ? "Generating..." : "Generate"}
                                </button>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;

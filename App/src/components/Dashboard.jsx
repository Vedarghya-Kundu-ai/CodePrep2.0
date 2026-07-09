import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';
import axios from 'axios';
import { gsap } from 'gsap';
import { DSA_ROADMAP } from '../lib/dsaRoadmap';
import { API_BASE_URL } from '../lib/utils';

function Dashboard() {
    const [activeTopicIndex, setActiveTopicIndex] = useState(0);
    const [generatingQuestionId, setGeneratingQuestionId] = useState(null);
    const [selectedDifficulty, setSelectedDifficulty] = useState("Easy");

    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const activeTopic = DSA_ROADMAP[activeTopicIndex];

    const rootRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const cardRef = useRef(null);

    useEffect(() => {
        if (!rootRef.current) return;

        const ctx = gsap.context(() => {
            gsap.timeline({ defaults: { ease: "power3.out" } })
                .from(titleRef.current, {
                    y: 26,
                    opacity: 0,
                    duration: 0.7
                })
                .from(
                    subtitleRef.current,
                    {
                        y: 22,
                        opacity: 0,
                        duration: 0.65
                    },
                    "-=0.38"
                )
                .from(
                    cardRef.current,
                    {
                        y: 28,
                        opacity: 0,
                        scale: 0.985,
                        duration: 0.75
                    },
                    "-=0.35"
                );
        }, rootRef);

        return () => ctx.revert();
    }, []);

    async function handleGenerate(selectedQuestion, questionId) {
        if (!currentUser?.uid) {
            navigate("/Login");
            return;
        }

        setGeneratingQuestionId(questionId);

        try {
            await axios.post(`${API_BASE_URL}/add_question`, {
                user: currentUser.uid,
                question: selectedQuestion,
            });
        } catch (error) {
            console.log(error);
        } finally {
            setGeneratingQuestionId(null);
        }

        navigate("/interviewSpace", {
            state: {
                question: selectedQuestion,
            },
        });
    }

    const handleDifficultyChange = (event) => {
        setSelectedDifficulty(event.target.value);
    };

    const handleGenerateRandomQuestion = () => {
        if (!selectedDifficulty) {
            alert("Please select a difficulty.");
            return;
        }

        const filteredQuestions = activeTopic.questions.filter(
            (question) => question.difficulty === selectedDifficulty
        );

        if (filteredQuestions.length === 0) {
            alert("No questions available for this difficulty.");
            return;
        }

        const randomQuestion =
            filteredQuestions[
                Math.floor(Math.random() * filteredQuestions.length)
            ];

        handleGenerate(
            randomQuestion.title,
            `${activeTopic.name}-${randomQuestion.title}`
        );
    };

    return (
        <div
            ref={rootRef}
            className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-6xl flex-col items-center justify-center px-4 py-8 sm:px-6"
        >
            <h1
                ref={titleRef}
                className="mb-3 text-center text-4xl font-bold leading-relaxed tracking-tight text-slate-950 dark:text-slate-100 sm:text-5xl md:text-6xl"
            >
                Ready to ace your next coding interview?
            </h1>

            <h2
                ref={subtitleRef}
                className="-mt-1 mb-10 max-w-4xl text-center text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-xl md:text-2xl lg:text-3xl"
            >
                Pick a DSA topic, choose a difficulty, and generate your interview instantly.
            </h2>

            <div
                ref={cardRef}
                className="mt-3 w-full rounded-2xl p-4 sm:p-6"
            >
                <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="text-2xl font-semibold text-slate-950 dark:text-slate-100 sm:text-3xl">
                        Choose a Topic
                    </p>
                </div>

                <div className="mb-5 flex flex-wrap gap-2">
                    {DSA_ROADMAP.map((topic, index) => (
                        <button
                            key={topic.name}
                            onClick={() => setActiveTopicIndex(index)}
                            className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold transition-all ${
                                index === activeTopicIndex
                                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/15 dark:text-indigo-200"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
                            }`}
                            type="button"
                        >
                            {topic.name}
                        </button>
                    ))}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="mb-5 flex items-center justify-between">
                        <p className="text-2xl font-semibold text-slate-950 dark:text-slate-100 sm:text-3xl">
                            {activeTopic.name}
                        </p>
                    </div>

                    <div className="mb-8 flex items-center gap-3">
                        <label
                            className="text-slate-700 dark:text-slate-300"
                            htmlFor="difficulty-level"
                        >
                            Select Difficulty:
                        </label>

                        <select
                            id="difficulty-level"
                            value={selectedDifficulty}
                            onChange={handleDifficultyChange}
                            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                        >
                            <option value="">-- Select --</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div className="flex justify-center">
                        <button
                            className="cursor-pointer rounded-lg bg-indigo-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            onClick={handleGenerateRandomQuestion}
                            disabled={
                                !selectedDifficulty ||
                                generatingQuestionId !== null
                            }
                            type="button"
                        >
                            {generatingQuestionId
                                ? "Please wait..."
                                : "Generate Interview"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

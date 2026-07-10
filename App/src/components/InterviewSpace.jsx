import Editor from '@monaco-editor/react';
import micIcon from '../assets/microphone.png';
import waveimg from '../assets/message.png';
import Vapi from '@vapi-ai/web';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import mutedMicIcon from '../assets/micMuted.png';
import { gsap } from 'gsap';

function InterviewSpace() {
    const [code, setCode] = useState("");
    const [Transcription, setTranscription] = useState("")
    const [interviewActive, setInterviewActive] = useState(false);
    const vapiref = useRef(null);
    const location = useLocation();
    const { question } = location.state || {};
    const [assistantSpeaking, setAssistantSpeaking] = useState(false);
    const [userSpeaking, setUserSpeaking] = useState(false);
    const [micActive, setMicActive] = useState(false);
    const [language, setLanguage] = useState('python');
    const panelRootRef = useRef(null);
    const questionForInterview = question;
    

    const getPlaceholderFor = (lang) => {
        switch (lang) {
            case 'python':
                return '# Start coding here...';
            case 'javascript':
            case 'typescript':
            case 'java':
            case 'cpp':
            case 'c':
            default:
                return '// Start coding here...';
        }
    };

    const isOnlyPlaceholder = (text) => {
        const t = (text || '').trim();
        return (
            t === '' ||
            t === '#Start coding here....' ||
            t === '# Start coding here...' ||
            t === '// Start coding here...'
        );
    };

    // Initialize with a language-appropriate starter line
    useEffect(() => {
        if (isOnlyPlaceholder(code)) {
            setCode(getPlaceholderFor(language));
        }
    }, []);

    // When language changes, update the starter line only if user hasn't typed real code yet
    useEffect(() => {
        if (isOnlyPlaceholder(code)) {
            setCode(getPlaceholderFor(language));
        }
    }, [language]);
    
    const navigate = useNavigate();
    
    useEffect(() => {
        const vapi 
        
        = new Vapi(import.meta.env.VITE_VAPI_API_KEY); // VAPI_API_KEY
        vapiref.current = vapi;
        vapiref.current.on('message', (message) => {
            if(message.role == "assistant") {
                setTranscription(message.transcript);
                setAssistantSpeaking(true);
                setUserSpeaking(false);
            } else if(message.role == "user") {
                setTranscription(message.transcript);
                setAssistantSpeaking(false);
                setUserSpeaking(true);
            } else {
                setTranscription("")
            }
        });
    }, []);

    // Added: GSAP panel stagger for smoother interview screen transitions.
    useEffect(() => {
        if (!panelRootRef.current) {
            return;
        }
        const panels = panelRootRef.current.querySelectorAll("[data-interview-panel='true']");
        gsap.fromTo(panels, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" });
    }, []);

    const assistantoverrides = {
        recordingEnabled: false,
        variableValues: {
            question: questionForInterview,
        },
    };
    
    const handleMicClick = () => {
        if(interviewActive == true) {
            // Simply toggle mute/unmute during active call
            if(micActive) {
                vapiref.current.setMuted(true);
                setMicActive(false);
                console.log("Your mic is muted");
            }else {
                vapiref.current.setMuted(false);
                setMicActive(true);
                console.log("Your mic is unmuted");
            }            
            return ;
        } else {
            if(!questionForInterview) {
                alert("Please ensure that you have selected a topic");
                setInterviewActive(false);
                navigate("/Dashboard");
                return ;
            }
        }
    };

    const endCall = () =>{
        //vapiref.current.say("Our time's up, goodbye!", true);
        //vapiref.current.say("Goodbye!");
        if (confirm("Are you sure you want to end the call?")) {
            navigate("/Dashboard");
            vapiref.current.stop();
        } else {
            // User clicked Cancel
            return ;
        }
    };

    const startCall = () => {
        if(!questionForInterview) {
            alert ("Please enter a question in your Dashboard to start the interview");
            setInterviewActive(false);
            navigate("/Dashboard");
            return ;
        } else {
            setMicActive(true);
            setInterviewActive(true);
            vapiref.current.start(import.meta.env.VITE_VAPI_ASSISTANT_ID, assistantoverrides);
        }
    }

    const handleSubmit = () =>{
        if (!vapiref.current) {
            return;
        }
        const message = code.toString();
        vapiref.current.send({
            type: 'add-message',
            message: {
                role: 'user',
                content: message,
            },
        });
    // 2) Force the assistant to generate & speak a reply
        vapiref.current.send({
        type: 'response.create',
        response: {conversation: 'continue'},
        });
    };

    return(
        <div ref={panelRootRef} className="mx-auto flex w-full max-w-7xl flex-col px-4 pb-8 sm:px-6">
            <div className="mb-6 mt-3 grid min-h-[68vh] grid-cols-1 gap-5 lg:grid-cols-[minmax(260px,1fr)_minmax(0,2fr)]">
                <div className="order-1 flex h-full flex-col gap-4">
                    <div data-interview-panel="true" className={`flex flex-1 flex-col items-center justify-center gap-5 rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900 sm:p-8 ${assistantSpeaking ? "border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-500/20" : "border-slate-200 dark:border-slate-800" }`}>
                        <div className="flex justify-center items-center">
                            <img src={waveimg} className="object-contain w-[120px]" alt="animated-gif" />
                        </div>
                        <h2 className='mb-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-100'>AI Interviewer</h2>
                    </div>

                    <div data-interview-panel="true" className={`flex flex-1 flex-col items-center justify-center gap-5 rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900 sm:p-8 ${userSpeaking ? "border-indigo-500 ring-2 ring-indigo-100 dark:ring-indigo-500/20" : "border-slate-200 dark:border-slate-800" } `}>
                        <img
                             src={micActive ? micIcon : mutedMicIcon }
                            alt="Mic"
                            className="w-24 cursor-pointer object-contain transition-transform duration-300 hover:-translate-y-1 hover:scale-105 active:scale-105 sm:w-[120px]"
                            onClick={handleMicClick}
                        />
                        { interviewActive ? (
                            <button
                                className="mt-2 cursor-pointer rounded-xl border border-red-200/25 bg-red-500/80 px-4 py-2 font-medium text-red-50 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-red-500 active:scale-95"
                                onClick={endCall}
                            >
                                End Call
                            </button>
                        ) : (
                            <button
                                className="mt-2 cursor-pointer rounded-xl bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 active:scale-95"
                                onClick={startCall}
                            >
                                Start Call
                            </button>
                        )}
                    </div>
                </div>
                <div data-interview-panel="true" className="order-2 flex h-full min-h-[60vh] flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-4">
                    <div className="mt-2 flex w-full flex-wrap items-center justify-between gap-3 px-2">
                        <h2 className='text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-100 sm:text-5xl'>Code Editor</h2>
                        <div className="flex items-center gap-2">
                            <label htmlFor="language" className="text-sm text-slate-600 dark:text-slate-300">Language</label>
                            <select
                                id="language"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                            >
                                <option value="python">Python</option>
                                <option value="javascript">JavaScript</option>
                                <option value="typescript">TypeScript</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="c">C</option>
                            </select>
                        </div>
                    </div>
                    <Editor
                        height="100%"
                        language={language}
                        value={code}
                        options={{ fontSize: 16, minimap: { enabled: false } }}
                        theme="vs-dark"
                        onChange={(value) => setCode(value ?? "")}
                    />
                    <button
                    onClick={handleSubmit}
                    className="mb-1 inline-flex min-w-[132px] cursor-pointer items-center justify-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
                    >
                    Submit
                    </button>
                </div>
            </div>
            <div data-interview-panel="true" className='mx-auto flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:px-6'>
                <p className='text-center font-mono text-sm text-slate-700 dark:text-slate-200'>{Transcription}</p>
            </div>
        </div>
    )
}

export default InterviewSpace;

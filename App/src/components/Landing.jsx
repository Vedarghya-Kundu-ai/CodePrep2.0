import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Moon, Sun, Menu, X, ChevronDown, Check, ArrowRight, Code, MessagesSquare, Brain, Sparkles, SplitSquareHorizontal, BarChart3 } from "lucide-react";
import { gsap } from "gsap";

const features = [
  {
    icon: MessagesSquare,
    title: "Conversational AI Interviewer",
    description: "Practice with an AI that asks real interview questions, listens to your answers, and adapts follow-ups just like a human interviewer.",
  },
  {
    icon: Code,
    title: "Live Coding Environment",
    description: "Write and run code in a built-in Monaco editor with multi-language support — just like real technical interviews.",
  },
  {
    icon: Brain,
    title: "Topic-wise Interview Generation",
    description: "Pick from Arrays, Linked Lists, Trees, DP, and more. Each topic has curated questions used by top tech companies.",
  },
  {
    icon: Sparkles,
    title: "Multiple Difficulty Levels",
    description: "Choose Easy, Medium, or Hard. Progress from fundamentals to advanced problems as you improve.",
  },
  {
    icon: SplitSquareHorizontal,
    title: "AI Follow-up Questions",
    description: "Get real-time conversational follow-ups that test depth of understanding, not just memorization.",
  },
  {
    icon: BarChart3,
    title: "Interview History & Review",
    description: "Review past interviews with detailed score breakdowns across communication, coding, problem-solving, and optimization.",
  },
];

const steps = [
  { number: "01", title: "Choose a Topic", description: "Browse DSA topics — Arrays, Trees, Graphs, DP, and more. Each packed with interview-grade questions." },
  { number: "02", title: "Select Difficulty", description: "Pick Easy, Medium, or Hard. Start where you're comfortable and level up." },
  { number: "03", title: "Start AI Interview", description: "Your AI interviewer introduces the problem, asks clarifying questions, and guides the conversation." },
  { number: "04", title: "Write Code Live", description: "Use the built-in editor with syntax highlighting and multi-language support while explaining your approach." },
  { number: "05", title: "Get AI Feedback", description: "Receive detailed review across communication, coding ability, problem-solving, and optimization." },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Try CodePrep with no commitment.",
    features: [
      "First 3 interviews free",
      "Full interview history",
      "Basic AI feedback & scores",
      "All DSA topics",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pay Per Interview",
    price: "$1",
    period: "/interview",
    description: "Pay only when you practice.",
    features: [
      "No subscription required",
      "Full interview history",
      "Advanced AI feedback",
      "All DSA topics & difficulties",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Monthly",
    price: "$7",
    period: "/month",
    description: "Unlimited practice for serious preparation.",
    features: [
      "Unlimited interview sessions",
      "Advanced AI Review with insights",
      "Voice-based interview mode",
      "Company-specific interview packs",
      "Priority support",
    ],
    cta: "Subscribe",
    popular: true,
  },
  {
    name: "Yearly",
    price: "$40",
    period: "/year",
    description: "Save 52% compared to monthly billing.",
    features: [
      "Everything in Monthly, plus:",
      "All DSA topics & company packs",
      "Priority support & early features",
    ],
    cta: "Subscribe",
    popular: false,
  },
];

const faqs = [
  {
    q: "How does the AI interview work?",
    a: "Select a topic and difficulty, then start an interview. The AI interviewer asks you a coding problem, discusses your approach, and asks follow-up questions — just like a real technical interview.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. CodePrep runs entirely in your browser. The built-in code editor supports Python, JavaScript, TypeScript, Java, C++, and C.",
  },
  {
    q: "Is the Free plan enough to prepare?",
    a: "Yes. The Free plan gives you 3 full interviews to try CodePrep. After that, it's $7/month or $40/year for unlimited sessions and advanced reviews.",
  },
  {
    q: "What is the voice interview feature?",
    a: "Pro users can conduct interviews entirely by voice. The AI speaks the problem, listens to your verbal explanation, and responds conversationally — simulating a real on-site or Zoom interview.",
  },
  {
    q: "Can I reattempt an interview?",
    a: "Yes. Every past interview appears in your history with a Re-attempt button. You can practice the same question again or generate a new one.",
  },
  {
    q: "How is the interview review calculated?",
    a: "Our AI analyzes your session across communication, coding ability, problem-solving, and optimization. You get a numeric score (1-10) per category along with personalised strengths and next-step suggestions.",
  },
];

const footerLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
];

function Landing({ darkMode, setDarkMode }) {
  const { userLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;
  if (userLoggedIn) return <Navigate to="/dashboard" replace />;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const pricingRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.fromTo(entry.target, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    [heroRef, featuresRef, stepsRef, pricingRef, ctaRef].forEach((ref) => {
      if (ref?.current) observer.observe(ref.current);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.querySelectorAll("[data-animate]"), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out" });
    }
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* ─────── CUSTOM NAVBAR ─────── */}
      <nav className="fixed left-0 top-0 z-50 w-full border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm transition-colors dark:border-slate-800 dark:bg-slate-950/95 sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div
            onClick={() => navigate("/")}
            className="flex cursor-pointer select-none items-center gap-2"
          >
            <span className="text-2xl font-bold text-indigo-600">{`</>`}</span>
            <span className="text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:text-4xl">
              CodePrep
            </span>
          </div>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200 md:flex">
            <li>
              <button
                type="button"
                onClick={() => setDarkMode((prev) => !prev)}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </li>
            {["Features", "Pricing", "FAQ"].map((item) => (
              <li key={item}>
                <button
                  onClick={() => scrollTo(item.toLowerCase())}
                  className="cursor-pointer transition hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  {item}
                </button>
              </li>
            ))}
            <li>
              <Link
                to="/login"
                className="font-medium text-slate-700 transition hover:text-indigo-700 dark:text-slate-200 dark:hover:text-indigo-300"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700"
              >
                Start Free
              </Link>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
          {mobileMenuOpen && (
          <div className="mt-3 border-t border-slate-200 pt-3 dark:border-slate-800 md:hidden">
            <div className="mb-3 flex items-center gap-2 px-2">
              <button
                type="button"
                onClick={() => setDarkMode((prev) => !prev)}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400">Toggle theme</span>
            </div>
            <ul className="flex flex-col gap-3 pb-3 text-sm font-medium text-slate-700 dark:text-slate-200">
              {["Features", "Pricing", "FAQ"].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => scrollTo(item.toLowerCase())}
                    className="w-full cursor-pointer px-2 py-1 text-left transition hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    {item}
                  </button>
                </li>
              ))}
              <li className="border-t border-slate-200 pt-3 dark:border-slate-800">
                <div className="flex items-center gap-3 px-2">
                  <Link
                    to="/login"
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center font-medium text-slate-700 transition hover:border-indigo-400 hover:text-indigo-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-indigo-700"
                  >
                    Start Free
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* ─────── HERO ─────── */}
      <section ref={heroRef} className="relative overflow-hidden pt-28 sm:pt-36">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 pb-16 sm:px-6 lg:flex-row lg:pb-24">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h1 data-animate className="text-5xl font-bold leading-tight tracking-tight text-slate-950 dark:text-slate-100 sm:text-6xl md:text-7xl">
              Practice Real Coding Interviews with{" "}
              <span className="text-indigo-600 dark:text-indigo-400">AI</span>.
            </h1>
            <p data-animate className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-300 lg:mx-0 lg:text-xl">
              Prepare for coding interviews through realistic AI-powered interview simulations with live coding, conversational follow-up questions, and detailed feedback.
            </p>
            <div data-animate className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                Start Free <ArrowRight size={18} />
              </Link>
              <button
                onClick={() => scrollTo("features")}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 shadow-sm transition hover:border-indigo-400 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-400 dark:hover:text-indigo-300"
              >
                View Demo
              </button>
            </div>
          </div>

          {/* Dashboard preview card */}
          <div data-animate className="w-full max-w-lg flex-shrink-0 lg:max-w-xl">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-1.5 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  codeprep.ai
                </span>
              </div>
              <div className="p-5">
                <div className="mb-3">
                  <p className="text-2xl font-semibold text-slate-950 dark:text-slate-100">Choose a Topic</p>
                </div>
                <div className="mb-5 flex flex-wrap gap-2">
                  {["Arrays", "Linked Lists", "Trees", "DP", "Strings"].map((t, i) => (
                    <span
                      key={t}
                      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                        i === 2
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/15 dark:text-indigo-200"
                          : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <p className="mb-5 text-2xl font-semibold text-slate-950 dark:text-slate-100">Trees</p>
                  <div className="mb-6 flex items-center gap-3">
                    <span className="text-sm text-slate-700 dark:text-slate-300">Select Difficulty:</span>
                    <span className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">Medium</span>
                  </div>
                  <button className="w-full cursor-pointer rounded-lg bg-indigo-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-indigo-700">
                    Generate Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────── WHY CODEPREP / FEATURES ─────── */}
      <section id="features" ref={featuresRef} className="border-t border-slate-200 bg-white py-20 transition-colors dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:text-5xl">
              Why CodePrep?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Most platforms help you solve problems. CodePrep helps you practice <em>interviews</em> — the real differentiator.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-400/30"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <feature.icon size={24} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-950 dark:text-slate-100">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── HOW IT WORKS ─────── */}
      <section ref={stepsRef} className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:text-5xl">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              From topic selection to detailed feedback — here is how a CodePrep interview works.
            </p>
          </div>

          <div className="relative mx-auto max-w-4xl">
            <div className="absolute left-8 top-0 hidden h-full w-px bg-slate-200 dark:bg-slate-700 md:block" />
            <div className="space-y-12">
              {steps.map((step) => (
                <div key={step.number} className="relative flex flex-col gap-4 md:flex-row md:items-start">
                  <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg font-bold text-indigo-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-indigo-400">
                    {step.number}
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="mb-1 text-xl font-semibold text-slate-950 dark:text-slate-100">{step.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────── PRICING ─────── */}
      <section id="pricing" ref={pricingRef} className="border-t border-slate-200 bg-white py-20 transition-colors dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:text-5xl">
              Simple Pricing
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Start for free. Upgrade when you need more.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-4">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 shadow-sm transition ${
                  plan.popular
                    ? "border-indigo-300 bg-white shadow-indigo-100 dark:border-indigo-500 dark:bg-slate-900 dark:shadow-indigo-500/10"
                    : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="mb-1 text-2xl font-bold text-slate-950 dark:text-slate-100">{plan.name}</h3>
                <div className="mb-4 flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight text-slate-950 dark:text-slate-100">{plan.price}</span>
                  {plan.period && <span className="text-sm text-slate-500 dark:text-slate-400">{plan.period}</span>}
                </div>
                <p className="mb-6 text-sm text-slate-600 dark:text-slate-300">{plan.description}</p>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                      <Check size={16} className="flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition ${
                    plan.name === "Free"
                      ? "border border-indigo-600 bg-white text-indigo-700 hover:bg-indigo-50 dark:border-indigo-400 dark:bg-transparent dark:text-indigo-300 dark:hover:bg-indigo-500/10"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── FAQ ─────── */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:text-5xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition dark:border-slate-800 dark:bg-slate-900"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === faq.q ? null : faq.q)}
                  className="flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left text-sm font-semibold text-slate-950 transition hover:text-indigo-700 dark:text-slate-100 dark:hover:text-indigo-300"
                >
                  {faq.q}
                  <ChevronDown
                    size={18}
                    className={`flex-shrink-0 text-slate-500 transition-transform duration-200 ${
                      openFaq === faq.q ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === faq.q && (
                  <div className="border-t border-slate-200 px-6 py-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── FINAL CTA ─────── */}
      <section ref={ctaRef} className="border-t border-slate-200 bg-white py-20 transition-colors dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-100 sm:text-5xl">
            Ready for your next coding interview?
          </h2>
          <p className="mb-8 text-lg text-slate-600 dark:text-slate-300">
            Join thousands of developers preparing with realistic AI-powered interview simulations. No credit card required.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-3.5 text-lg font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            Start Practicing Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ─────── FOOTER ─────── */}
      <footer className="border-t border-slate-200 bg-white py-12 transition-colors dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-indigo-600">{`</>`}</span>
              <span className="text-xl font-bold tracking-tight text-slate-950 dark:text-slate-100">
                CodePrep
              </span>
            </div>
            <ul className="flex flex-wrap justify-center gap-6 text-sm text-slate-600 dark:text-slate-300">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => {
                      if (link.href.startsWith("#")) {
                        scrollTo(link.href.slice(1));
                      }
                    }}
                    className="cursor-pointer transition hover:text-indigo-700 dark:hover:text-indigo-300"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
            &copy; {new Date().getFullYear()} CodePrep. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

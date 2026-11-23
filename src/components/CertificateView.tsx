import React, { useState } from 'react';
import { 
  Award, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft,
  User,
  Smile,
  Stamp
} from 'lucide-react';

interface CertificateViewProps {
  completedCount: number;
  totalTopics: number;
  onGoBack: () => void;
  onGoToProgress: () => void;
  onUnlockAll?: () => void;
  studentName?: string;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  completedCount,
  totalTopics,
  onGoBack,
  onGoToProgress,
  studentName
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Recipient name state (editable by verified user, saved to localStorage)
  const [recipientName, setRecipientName] = useState<string>(() => {
    if (studentName) return studentName;
    return localStorage.getItem('java_handbook_custom_name') || 'Mohamed Khaled Farag';
  });

  // Stamp mode: 'funny' (100% Fake / But You're Perfect) or 'formal' (Official Gold Seal)
  const [stampMode, setStampMode] = useState<'funny' | 'formal'>('funny');

  const certificateId = `CERT-2026-MKF-${totalTopics}`;
  const issueDate = "November 19, 2026";
  const isAllCompleted = completedCount >= totalTopics;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCredential = () => {
    const text = `Certificate of Java, Jakarta EE & Spring Boot Mastery
Recipient: ${recipientName}
Status: 100% Verified Technical Mastery
Credential ID: ${certificateId}
Curriculum: ${completedCount}/${totalTopics} Modules Completed (Java SE, Jakarta EE & Spring Boot)
Automated Tests Passed: 160+ Passed
Issued By: Mohamed Khaled Farag (mkfarag)
Issue Date: ${issueDate}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJSON = () => {
    const credentialData = {
      "@context": "https://w3id.org/security/v2",
      type: "HandbookCompletionCredential",
      id: certificateId,
      issuedTo: {
        name: recipientName
      },
      stampVerdict: stampMode === 'funny' ? "100% Fake Certificate, But You Are Perfect!" : "Officially Verified",
      curriculum: {
        title: "The Definitive SOA & Java Handbook",
        version: "2026 LTS Zero to Production",
        modulesTotal: totalTopics,
        modulesCompleted: completedCount,
        parts: [
          "Part 1: Java Core (Java 8 through 26 LTS)",
          "Part 2: Java EE & Jakarta EE (Jakarta EE 10 & 11, Tomcat 10.1)",
          "Part 3: Spring Boot & Modern Production Ecosystem (Spring Framework 6 / Boot 3)",
          "Part 4: Database Systems & Persistence (SQL/NoSQL, MySQL, MongoDB)"
        ],
        testSuitesPassed: 160,
        status: isAllCompleted ? "Completed & Verified" : "In Progress"
      },
      authorAndIssuer: {
        name: "Mohamed Khaled Farag",
        username: "mkfarag",
        title: "Curriculum Author & Lead Architect",
        github: "https://github.com/MKFarag/SOA-Java-Handbook",
        dockerHub: "https://hub.docker.com/r/mkfarag/mkf-soa-java-handbook"
      },
      issuanceDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(credentialData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate-${recipientName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto py-5 sm:py-8 px-3 sm:px-6 lg:px-8 space-y-5 sm:space-y-6 text-left">
      
      {/* Top Controls Toolbar (Hidden on Print) */}
      <div className="no-print space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onGoBack}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-500" />
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Customizable Completion Certificate
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Type your name below, choose your seal, and print your personal certificate.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified Access</span>
            </div>

            <button
              type="button"
              onClick={handleCopyCredential}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-all shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-500" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-all shadow-xs"
            >
              {downloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-zinc-500" />
                  <span>Export JSON</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Interactive Customization Bar: Recipient Name Input + Stamp Style Switch */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#1e1e1e] border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
          
          {/* Name Input Field */}
          <div className="flex items-center gap-2.5 flex-1 min-w-[260px] max-w-md">
            <User className="w-5 h-5 text-blue-500 shrink-0" />
            <div className="w-full">
              <label htmlFor="recipient-name" className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                Recipient Full Name:
              </label>
              <input
                id="recipient-name"
                type="text"
                value={recipientName}
                onChange={(e) => {
                  setRecipientName(e.target.value);
                  localStorage.setItem('java_handbook_custom_name', e.target.value);
                }}
                placeholder="Enter your name..."
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-sm font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Stamp Style Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
              <Stamp className="w-4 h-4 text-amber-500" />
              <span>Stamp Mode:</span>
            </span>

            <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg border border-zinc-200 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setStampMode('funny')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  stampMode === 'funny'
                    ? 'bg-rose-500 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Funny 100% Fake stamp"
              >
                <Smile className="w-3.5 h-3.5" />
                <span>😂 100% Fake (Humor)</span>
              </button>

              <button
                type="button"
                onClick={() => setStampMode('formal')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  stampMode === 'formal'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
                title="Formal Gold Seal"
              >
                <Award className="w-3.5 h-3.5" />
                <span>🎖️ Formal Gold</span>
              </button>
            </div>
          </div>

        </div>

        {/* Milestone Indicator */}
        {!isAllCompleted ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-amber-950 dark:text-amber-200">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                Progress: <strong className="font-mono text-amber-600 dark:text-amber-400">{completedCount}</strong> of <strong className="font-mono">{totalTopics}</strong> topics done. Click <strong>Mark All {totalTopics} Complete</strong> above to unlock verified mode.
              </span>
            </div>
            <button
              type="button"
              onClick={onGoToProgress}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
            >
              Progress Tracker →
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>100% Curriculum Mastered:</strong> All {totalTopics} modules and technical test suites verified. Ready to print!
            </span>
          </div>
        )}
      </div>

      {/* The Printable Certificate Container */}
      <div 
        id="certificate-print-area"
        className="relative mx-auto w-full bg-white text-zinc-900 rounded-2xl shadow-xl border-4 sm:border-8 border-double border-amber-600/50 p-4 sm:p-6 lg:p-8 select-text"
      >
        {/* Subtle Security Background Watermark */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center select-none overflow-hidden"
          aria-hidden="true"
        >
          <svg className="w-[600px] h-[600px]" viewBox="0 0 200 200" fill="currentColor">
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M100 10 L100 190 M10 100 L190 100 M36 36 L164 164 M36 164 L164 36" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Ornate Corner Accents */}
        <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600/60 pointer-events-none" />
        <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600/60 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600/60 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600/60 pointer-events-none" />

        {/* Inner Gold Foil Framing Line */}
        <div className="border border-amber-500/50 p-4 sm:p-6 lg:p-8 rounded-lg relative z-10 bg-gradient-to-b from-amber-50/25 via-white to-amber-50/15 space-y-6">
          
          {/* Certificate Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center gap-2 text-[10px] sm:text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">
              <span className="w-6 sm:w-8 h-[1px] bg-amber-600/50 inline-block" />
              <span>THE DEFINITIVE SOA &amp; JAVA HANDBOOK</span>
              <span className="w-6 sm:w-8 h-[1px] bg-amber-600/50 inline-block" />
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-wide text-zinc-900 uppercase">
              Certificate of Mastery
            </h2>

            <p className="text-xs sm:text-sm font-serif italic text-amber-900/80 tracking-wider">
              {stampMode === 'funny' 
                ? "Totally Unofficial Reference · 100% Genuine Engineering Capability" 
                : "And Technical Architecture Excellence · Zero to Production Reference"}
            </p>
          </div>

          {/* Presentation Statement */}
          <div className="text-center space-y-2.5">
            <p className="text-xs font-sans uppercase tracking-widest text-zinc-500 font-medium">
              This is proudly awarded to
            </p>

            {/* Recipient Full Name (Dynamically Updated) */}
            <div className="relative inline-block py-1">
              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-amber-700 tracking-tight">
                {recipientName || "Java Architect"}
              </h3>
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mt-1.5 rounded-full" />
            </div>

            {/* Curriculum Achievement Description (Clean, zero links) */}
            <p className="max-w-2xl mx-auto text-xs sm:text-sm text-zinc-700 font-serif leading-relaxed">
              For successfully mastering and demonstrating technical proficiency across the complete {totalTopics}-topic curriculum of the 
              <strong> Definitive Java, Jakarta EE &amp; Spring Boot Architecture Handbook</strong>, covering core language internals from 
              <strong> Java 8 through Java 26 LTS</strong> (Modern Syntax, OOP, Concurrency, Virtual Threads, and JVM Memory Management), 
              enterprise distributed standards across <strong>Jakarta EE 10 &amp; 11</strong> (Servlets 6.0, JSP, MVC Architecture, Database Connection Pooling, JPA, CDI, JAX-RS), 
              and the modern production ecosystem with <strong>Spring Framework 6 &amp; Spring Boot 3</strong> (Inversion of Control, Auto-Configuration, REST Web MVC, Spring Data JPA, and Enterprise Security 6).
            </p>
          </div>

          {/* Verification Badge Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2.5 px-3 border-y border-amber-200/80 bg-amber-500/5 text-center rounded-lg">
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">Modules Completed</div>
              <div className="text-xs sm:text-sm font-bold font-mono text-zinc-900">
                {completedCount} / {totalTopics} (100%)
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">Test Scenarios</div>
              <div className="text-xs sm:text-sm font-bold font-mono text-emerald-600">
                160 / 160 Passed
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">Curriculum Target</div>
              <div className="text-xs sm:text-sm font-bold font-mono text-amber-700">
                Java 26 &amp; Jakarta EE 11
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">Status</div>
              <div className="text-xs sm:text-sm font-bold font-mono text-emerald-600 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>{stampMode === 'funny' ? "LEGIT BEAST" : "VERIFIED"}</span>
              </div>
            </div>
          </div>

          {/* Footer: Signatures, Seal & Metadata */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            
            {/* Left Signature: mkfarag (Username above line) + Mohamed Khaled Farag (Full name below line) */}
            <div className="space-y-0.5 sm:w-1/3">
              <div className="font-serif italic text-xl sm:text-2xl text-zinc-800 tracking-wider">
                mkfarag
              </div>
              <div className="w-40 sm:w-44 h-[1px] bg-zinc-400 mx-auto sm:mx-0 my-1" />
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                Mohamed Khaled Farag
              </div>
              <div className="text-[10px] text-zinc-500 font-sans">
                Curriculum Author &amp; Lead Systems Architect
              </div>
            </div>

            {/* Center: The Official Stamp / Seal (Funny Humor Stamp OR Formal Gold Medallion) */}
            <div className="shrink-0 flex flex-col items-center justify-center">
              {stampMode === 'funny' ? (
                /* The Hilarious "100% FAKE / BUT YOU ARE PERFECT" Rubber Stamp */
                <div className="transform -rotate-3 select-none border-2 sm:border-3 border-dashed border-rose-600/90 rounded-xl p-2 px-3 bg-rose-50/95 shadow-md text-center max-w-[210px] animate-fadeIn">
                  <div className="text-[8px] font-mono font-black tracking-widest text-rose-600 uppercase border-b border-rose-300 pb-0.5">
                    ★ 100% CERTIFIED FAKE ★
                  </div>
                  <div className="text-xs sm:text-sm font-serif font-black text-rose-800 uppercase tracking-tight py-0.5 leading-tight">
                    BUT YOU ARE PERFECT!
                  </div>
                  <div className="text-[7.5px] font-mono font-semibold text-rose-700 leading-tight">
                    Not accredited by Oracle or any gov. But your Java mastery is 100% real. You crushed {totalTopics} topics.
                  </div>
                </div>
              ) : (
                /* Formal Gold Foil Medallion / Official Seal */
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-[2px] shadow-md shadow-amber-500/20">
                  <div className="w-full h-full rounded-full bg-amber-500 flex flex-col items-center justify-center text-zinc-950 p-1 border-2 border-dashed border-amber-800/40 text-center select-none">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-amber-950" />
                    <span className="text-[7px] font-mono font-extrabold uppercase tracking-tight leading-tight">
                      JAVA ARCHITECT
                    </span>
                    <span className="text-[6px] font-mono font-bold text-amber-950/90">
                      {totalTopics} TOPICS · 2026
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Technical Architecture Board & Metadata */}
            <div className="space-y-0.5 sm:w-1/3 sm:text-right">
              <div className="font-serif italic text-xl sm:text-2xl text-zinc-800 tracking-wider">
                {stampMode === 'funny' ? "The JVM & JIT Compiler" : "Architecture Review Board"}
              </div>
              <div className="w-40 sm:w-44 h-[1px] bg-zinc-400 mx-auto sm:ml-auto sm:mr-0 my-1" />
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                {stampMode === 'funny' ? "0 Compiler Errors · 0 Warnings" : "Enterprise Standards Committee"}
              </div>
              <div className="text-[10px] font-mono text-zinc-500">
                ID: <span className="font-semibold text-zinc-800">{certificateId}</span> · {issueDate}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

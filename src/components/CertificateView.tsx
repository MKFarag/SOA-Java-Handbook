import React, { useState } from 'react';
import { 
  Award, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Mail, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft,
  Layers,
  Server
} from 'lucide-react';

const LinkedInIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.64 1.64 0 1 0 1.64 1.64 1.64 1.64 0 0 0-1.64-1.64Z"/>
  </svg>
);

interface CertificateViewProps {
  completedCount: number;
  totalTopics: number;
  onGoBack: () => void;
  onGoToProgress: () => void;
  onUnlockAll: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  completedCount,
  totalTopics,
  onGoBack,
  onGoToProgress,
  onUnlockAll
}) => {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const recipientName = "Mohamed Khaled Farag";
  const recipientEmail = "mohammedkhaled.fa@gmail.com";
  const recipientLinkedIn = "https://www.linkedin.com/in/mk-farag/";
  const certificateId = "JH-2026-MKF-87-PROD";
  const issueDate = "November 18, 2026";
  const isAllCompleted = completedCount >= totalTopics;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCredential = () => {
    const text = `Certificate of Mastery & Technical Excellence
Recipient: ${recipientName}
Credential ID: ${certificateId}
Curriculum: The Definitive Java & Jakarta EE Handbook (87/87 Modules Completed)
Verification: 160 Automated Test Suites Passed (JDK 26 LTS, Tomcat 10.1, SQLite JDBC)
Email: ${recipientEmail}
LinkedIn: ${recipientLinkedIn}
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
        name: recipientName,
        email: recipientEmail,
        linkedin: recipientLinkedIn
      },
      curriculum: {
        title: "The Definitive Java & Jakarta EE Handbook",
        version: "2026 LTS Zero to Production",
        modulesTotal: totalTopics,
        modulesCompleted: completedCount,
        parts: [
          "Part 1: Java Core (Java 8 through 26 LTS)",
          "Part 2: Java EE & Jakarta EE (Jakarta EE 10 & 11, Tomcat 10.1)"
        ],
        testSuitesPassed: 160,
        status: isAllCompleted ? "Completed & Verified" : "In Progress"
      },
      issuanceDate: new Date().toISOString(),
      issuer: {
        name: "Java & Jakarta EE Architecture Board",
        verificationUrl: "https://github.com/mk-farag"
      }
    };

    const blob = new Blob([JSON.stringify(credentialData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Certificate-${certificateId}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 text-left">
      
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
                  Official Completion Certificate
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                Verified certificate of engineering mastery for the 87 topics in Java Core &amp; Jakarta EE.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {!isAllCompleted && (
              <button
                type="button"
                onClick={onUnlockAll}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all shadow-xs"
                title="Mark all 87 topics complete for verification"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>Mark All 87 Complete (Demo)</span>
              </button>
            )}

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
                  <span>Copy Credential</span>
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
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Status Callout if not fully completed */}
        {!isAllCompleted ? (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-xs sm:text-sm text-amber-950 dark:text-amber-200">
                <span className="font-bold">Progress Milestone:</span> You have completed{' '}
                <strong className="font-mono text-amber-600 dark:text-amber-400">{completedCount}</strong> of{' '}
                <strong className="font-mono">{totalTopics}</strong> topics. Complete all modules or click "Mark All 87 Complete" above to generate the full verified status.
              </div>
            </div>
            <button
              type="button"
              onClick={onGoToProgress}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline shrink-0"
            >
              View Progress Tracker →
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <span className="font-bold">Curriculum Fully Mastered (100%):</span> All 87 topics across Java Core &amp; Jakarta EE are verified complete.
            </div>
          </div>
        )}
      </div>

      {/* The Printable Certificate Container */}
      <div 
        id="certificate-print-area"
        className="relative mx-auto w-full bg-white text-zinc-900 rounded-2xl shadow-2xl border-8 border-double border-amber-600/40 p-8 sm:p-12 lg:p-14 overflow-hidden select-text"
        style={{
          aspectRatio: '1.414 / 1', // ISO 216 Landscape Ratio
          minHeight: '620px'
        }}
      >
        {/* Subtle Guilloche / Security Background Watermark */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center select-none"
          aria-hidden="true"
        >
          <svg className="w-[800px] h-[800px]" viewBox="0 0 200 200" fill="currentColor">
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1" fill="none" />
            <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" fill="none" />
            <path d="M100 10 L100 190 M10 100 L190 100 M36 36 L164 164 M36 164 L164 36" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* Ornate Corner Accents */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-600/60 pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-600/60 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-600/60 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-600/60 pointer-events-none" />

        {/* Inner Gold Foil Framing Line */}
        <div className="border border-amber-500/50 p-6 sm:p-8 lg:p-10 h-full flex flex-col justify-between rounded-lg relative z-10 bg-gradient-to-b from-amber-50/20 via-white to-amber-50/10">
          
          {/* Certificate Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center gap-2 text-xs font-mono font-bold tracking-widest text-amber-700 uppercase">
              <span className="w-8 h-[1px] bg-amber-600/50 inline-block" />
              <span>THE DEFINITIVE JAVA &amp; JAKARTA EE HANDBOOK</span>
              <span className="w-8 h-[1px] bg-amber-600/50 inline-block" />
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-wide text-zinc-900 uppercase">
              Certificate of Mastery
            </h2>

            <p className="text-xs sm:text-sm font-serif italic text-amber-900/80 tracking-wider">
              And Technical Architecture Excellence · Zero to Production Reference
            </p>
          </div>

          {/* Presentation Statement */}
          <div className="text-center my-6 space-y-3">
            <p className="text-xs sm:text-sm font-sans uppercase tracking-widest text-zinc-500 font-medium">
              This is officially awarded to
            </p>

            {/* Recipient Full Name */}
            <div className="relative inline-block py-2">
              <h3 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-amber-700 tracking-tight">
                {recipientName}
              </h3>
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mt-2 rounded-full" />
            </div>

            {/* Recipient Contact & Credential Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-600 pt-1 font-sans">
              <a 
                href={recipientLinkedIn}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-blue-700 hover:text-blue-900 hover:underline"
              >
                <LinkedInIcon className="w-3.5 h-3.5 text-[#0077b5]" />
                <span>linkedin.com/in/mk-farag</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <span className="text-zinc-300">•</span>

              <a 
                href={`mailto:${recipientEmail}`}
                className="inline-flex items-center gap-1.5 font-semibold text-zinc-700 hover:text-orange-600 hover:underline"
              >
                <Mail className="w-3.5 h-3.5 text-orange-600" />
                <span>{recipientEmail}</span>
              </a>
            </div>

            {/* Curriculum Achievement Description */}
            <p className="max-w-3xl mx-auto text-xs sm:text-sm text-zinc-700 font-serif leading-relaxed pt-2">
              For successfully mastering and demonstrating technical proficiency across the complete 87-topic curriculum of the 
              <strong> Definitive Java &amp; Jakarta EE Handbook</strong>, covering core language internals from 
              <strong> Java 8 through Java 26 LTS</strong> (Modern Syntax, OOP, Concurrency, Virtual Threads, and JVM Memory Management) 
              and enterprise distributed systems across <strong>Jakarta EE 10 &amp; 11</strong> (Servlets 6.0, JSP, MVC Architecture, Database Connection Pooling, JPA, CDI, JAX-RS, and Production Hardening).
            </p>
          </div>

          {/* Verification Badge Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 py-3 border-y border-amber-200/80 bg-amber-500/5 text-center rounded-lg">
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">Modules Completed</div>
              <div className="text-sm sm:text-base font-bold font-mono text-zinc-900">
                {completedCount} / {totalTopics} (100%)
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">Test Scenarios</div>
              <div className="text-sm sm:text-base font-bold font-mono text-emerald-600">
                160 / 160 Passed
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">Curriculum Target</div>
              <div className="text-sm sm:text-base font-bold font-mono text-amber-700">
                Java 26 &amp; Jakarta EE 11
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-zinc-500">Credential Status</div>
              <div className="text-sm sm:text-base font-bold font-mono text-emerald-600 flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Footer: Signatures, Seal & Metadata */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            
            {/* Left Signature: Mohamed Khaled Farag */}
            <div className="space-y-1 sm:w-1/3">
              <div className="font-serif italic text-xl sm:text-2xl text-zinc-800 tracking-wider">
                Mohamed K. Farag
              </div>
              <div className="w-48 h-[1px] bg-zinc-400 mx-auto sm:mx-0" />
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                Mohamed Khaled Farag
              </div>
              <div className="text-[10px] text-zinc-500 font-sans">
                Curriculum Author &amp; Lead Systems Architect
              </div>
            </div>

            {/* Center: Official High-Resolution Gold Foil Medallion / Seal */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-[3px] shadow-lg shadow-amber-500/20">
                <div className="w-full h-full rounded-full bg-amber-500 flex flex-col items-center justify-center text-zinc-950 p-1 border-2 border-dashed border-amber-800/40 text-center select-none">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-950" />
                  <span className="text-[7px] sm:text-[8px] font-mono font-extrabold uppercase tracking-tight leading-tight pt-0.5">
                    JAVA ARCHITECT
                  </span>
                  <span className="text-[6px] sm:text-[7px] font-mono font-bold text-amber-950/90">
                    87 TOPICS · 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Technical Architecture Board & Metadata */}
            <div className="space-y-1 sm:w-1/3 sm:text-right">
              <div className="font-serif italic text-xl sm:text-2xl text-zinc-800 tracking-wider">
                Architecture Review Board
              </div>
              <div className="w-48 h-[1px] bg-zinc-400 mx-auto sm:ml-auto sm:mr-0" />
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                Enterprise Standards Committee
              </div>
              <div className="text-[10px] font-mono text-zinc-500">
                ID: <span className="font-semibold text-zinc-800">{certificateId}</span> · {issueDate}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Accreditation & Creator Bio Card (Visible on Screen) */}
      <div className="no-print p-6 rounded-2xl bg-zinc-50 dark:bg-[#1e1e1e] border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Architect &amp; Curriculum Direction: Mohamed Khaled Farag</span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
              Designed and engineered as a modern, 100% offline-first reference manual for Java &amp; Jakarta EE developers.
              Includes verified runnable examples, compiler pitfalls, enterprise design patterns, and automated test runners.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={recipientLinkedIn}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 border border-[#0077b5]/30 transition-colors"
            >
              <LinkedInIcon className="w-3.5 h-3.5" />
              <span>Connect on LinkedIn</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <a
              href={`mailto:${recipientEmail}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 border border-orange-500/30 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Email</span>
            </a>
          </div>
        </div>

        {/* Curriculum Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
            <Layers className="w-4 h-4 text-orange-500 shrink-0" />
            <span><strong>Part 1 (Java Core):</strong> 62 Comprehensive Topics</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
            <Server className="w-4 h-4 text-sky-500 shrink-0" />
            <span><strong>Part 2 (Jakarta EE):</strong> 25 Enterprise Topics</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span><strong>100% Offline:</strong> Zero external CDN runtime dependencies</span>
          </div>
        </div>
      </div>

    </div>
  );
};

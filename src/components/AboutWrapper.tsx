"use client";

import dynamic from "next/dynamic";

const AboutContent = dynamic(() => import("./AboutContent"), {
    ssr: false,
    loading: () => <div className="min-h-screen bg-transparent" aria-busy="true" />,
});

export default function AboutWrapper() {
    return <AboutContent />;
}

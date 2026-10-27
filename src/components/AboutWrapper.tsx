"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const AboutContent = dynamic(() => import("./AboutContent"), {
    ssr: false,
});

export default function AboutWrapper() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="min-h-screen bg-transparent" aria-busy="true" />;
    }

    return <AboutContent />;
}

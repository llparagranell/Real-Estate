"use client"

import { useState } from "react"

interface PropertyAboutProps {
    description: string
    maxLength?: number
}

export function PropertyAbout({ description, maxLength = 300 }: PropertyAboutProps) {
    const [expanded, setExpanded] = useState(false)
    const shouldTruncate = description.length > maxLength

    return (
        <div className="mt-5">
            <h3 className="font-semibold text-base">About the property</h3>
            <p className="text-gray-600 text-sm leading-relaxed mt-2">
                {expanded || !shouldTruncate
                    ? description
                    : `${description.slice(0, maxLength)}...`}
            </p>
            {shouldTruncate && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-600 text-sm font-medium mt-1 hover:underline"
                >
                    {expanded ? "Show less" : "Show more"}
                </button>
            )}
        </div>
    )
}

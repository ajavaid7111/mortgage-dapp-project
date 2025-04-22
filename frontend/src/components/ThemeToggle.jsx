import React from "react";

export default function ThemeToggle() {
    const toggleTheme = () => {
        const html = document.documentElement;
        if (html.classList.contains("dark")) {
            html.classList.remove("dark");
        } else {
            html.classList.add("dark");
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
            Toggle Theme
        </button>
    );
}

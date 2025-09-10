// Buildings 5 & 6 — redirect, no popup

document.addEventListener("DOMContentLoaded", () => {
    // ---------- helpers ----------
    function collectForm(formEl) {
        const data = {};
        const fd = new FormData(formEl);
        for (const [name, value] of fd.entries()) {
            if (data[name]) {
                if (Array.isArray(data[name])) data[name].push(value);
                else data[name] = [data[name], value];
            } else {
                data[name] = value;
            }
        }
        // include unchecked checkbox groups as empty arrays
        formEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            if (!fd.has(cb.name)) data[cb.name] = [];
        });
        return data;
    }

    function normalizeLetters(s) {
        return (s || "")
            .toLowerCase()
            .replace(/[\s\.\-_,’'"]/g, "");
    }
    function normalizePrice(s) {
        return (s || "")
            .toString()
            .trim()
            .replace(/[,$\s]/g, "");
    }

    // ---------- answer key ----------
    const correct = {
        // Q1
        "b56-osl-floor": "Floor 3",

        // Q2 (accept either full or short form, case/space-insensitive)
        "b56-mcs-accepted": [
            "multiculturalstudentcenter",
            "multiculturalstudent"
        ],

        // Q3 (corrected to Deaf Counseling Center)
        "b56-b6f1": "Deaf Counseling Center",

        // Q4 (price; accept $4.95 or 4.95)
        "b56-noodles": "4.95",

        // Q5
        "b56-weekly": "ASOC meeting"
    };

    // ---------- redirect ----------
    const REDIRECT_URL = "https://headtofoot.netlify.app/";

    // ---------- checker ----------
    function allAnswersCorrect(ans) {
        // Q1
        const q1 = (ans["b56-osl-floor"] || "") === correct["b56-osl-floor"];

        // Q2
        const mcs = normalizeLetters(ans["b56-mcs"]);
        const q2 = correct["b56-mcs-accepted"].includes(mcs);

        // Q3
        const q3 = (ans["b56-b6f1"] || "") === correct["b56-b6f1"];

        // Q4
        const price = normalizePrice(ans["b56-noodles"]);
        const q4 = price === correct["b56-noodles"];

        // Q5
        const q5 = (ans["b56-weekly"] || "") === correct["b56-weekly"];

        return q1 && q2 && q3 && q4 && q5;
    }

    // ---------- wire up ----------
    const form = document.getElementById("quiz-form");
    const results = document.getElementById("results");
    const resetAll = document.getElementById("resetAll");

    if (!form || !results) {
        console.error("quiz-form or results not found. Check your HTML ids.");
        return;
    }

    form.setAttribute("action", "javascript:void(0)");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const ok = allAnswersCorrect(collectForm(form));
        if (ok) {
            results.textContent = "All correct! Redirecting…";
            setTimeout(() => { window.location.href = REDIRECT_URL; }, 50);
        } else {
            results.textContent = "Not quite — try again.";
        }
        results.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    if (resetAll) {
        resetAll.addEventListener("click", () => {
            form.reset();
            results.textContent = "";
        });
    }
});

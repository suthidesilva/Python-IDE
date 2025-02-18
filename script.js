document.addEventListener("DOMContentLoaded", async function () {
    const runBtn = document.getElementById("run-btn");
    const clearBtn = document.getElementById("clear-btn");
    const outputDiv = document.getElementById("output");
    const toggleMode = document.getElementById("toggle-mode");
    const editor = document.getElementById("code-editor");

    let pyodide = null;

    async function loadPyodideAndPackages() {
        outputDiv.innerText = "⏳ Loading Pyodide...";
        pyodide = await loadPyodide();
        outputDiv.innerText = "✅ Pyodide is ready!";
    }

    loadPyodideAndPackages();

    runBtn.addEventListener("click", async function () {
        let code = editor.value;
        if (code.trim() === "") {
            outputDiv.innerText = "⚠️ No code to execute!";
            return;
        }

        try {
            // Note to myself!!!!! Redirect stdout to capture print() output
            let pyCode = `
import sys
from io import StringIO

sys.stdout = StringIO()
sys.stderr = sys.stdout

try:
    exec("""${code}""")
    output = sys.stdout.getvalue()
except Exception as e:
    output = str(e)

output
            `;
            let result = await pyodide.runPythonAsync(pyCode);
            outputDiv.innerText = "✔️ Output:\n" + result.trim();
        } catch (error) {
            outputDiv.innerText = "❌ Error:\n" + error.message;
        }
    });

    clearBtn.addEventListener("click", function () {
        editor.value = "";
        outputDiv.innerText = "";
    });

    toggleMode.addEventListener("click", function () {
        document.body.classList.toggle("light-mode");
        toggleMode.innerText = document.body.classList.contains("light-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
    });
});

function resetText() {
    const output = document.getElementById("outputText");
    const outputTextLabel = document.getElementById("outputTextLabel");

    output.innerHTML = '';
    outputTextLabel.style.display = "none";
}

async function simplifyText() {
    const inputText = document.getElementById("inputText").value;
    const audience = document.getElementById("audience").value;
    const output = document.getElementById("outputText");
    const loader = document.getElementById("lottieLoader");
    const outputTextLabel = document.getElementById("outputTextLabel");

    if (inputText.trim() === "") {
        alert("Please enter some text to simplify.");   // Show the alert
        return;
    } else {
        output.innerHTML = "<em>Simplifying...</em>";
        loader.style.display = "flex";       // Shows the loader
        loader.style.visibility = "visible"; // Make it visible
        loader.style.height = "auto";

        // Start Lottie animation
        const animation = lottie.loadAnimation({
            container: document.getElementById("lottieAnimation"),
            renderer: "svg",
            loop: true,
            autoplay: true,
            path: "Animation - 1744535060739.json" // Lottie JSON path
        });

        const prompt = `Simplify the following technical text for a ${audience}:\n\n"${inputText}"\n\nAvoid jargon and make it easy to understand. Only respond in plain English.`;

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: [
                        {
                            role: "system",
                            content: "You are an assistant that simplifies complex or technical text into easy-to-understand English. Always respond clearly and concisely in English only, avoiding any technical jargon."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            });

            const data = await response.json();
            let rawResponse = data.choices?.[0]?.message?.content || "Something went wrong. Please try again.";
            let cleanedResponse = rawResponse.replace(/◁think▷[\s\S]*?◁\/think▷/gi, "").replace(/^\s*[\r\n]/gm, "").trim();
            outputTextLabel.style.display = "inline";   // Show the output text
            output.innerText = cleanedResponse;     // Show the response into output text
        } catch (error) {
            output.innerText = "Error simplifying text. Please try again.";
            console.error(error);
        } finally {
            loader.style.display = "none";      // Hide the loader
            loader.style.visibility = "hidden";
            loader.style.height = "0";
            animation.destroy();
        }
    }
}
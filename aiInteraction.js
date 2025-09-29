// aiInteraction.js

// Function to get predictions from OpenAI API
export async function getPredictions(prompt, model = 'gpt-3.5-turbo') {
    // First check if a proxy URL is configured in storage; default to the deployed Vercel URL
    const proxyUrl = await new Promise((resolve) => {
        chrome.storage.local.get(['openaiProxyUrl'], function(result) {
            resolve(result.openaiProxyUrl || 'https://cust-concern.vercel.app');
        });
    });

    const payload = {
        model: model,
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt }
        ],
        max_tokens: 1000
    };

    if (proxyUrl) {
        // If proxy configured, forward to proxy (proxy should forward to OpenAI)
        try {
            const headers = { 'Content-Type': 'application/json' };

            const response = await fetch(proxyUrl.replace(/\/$/, '') + '/api/openai', {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                console.error(`Proxy request failed with status: ${response.status}`);
                return ["Sorry, I couldn't generate a suggestion via proxy. Please try again."];
            }

            const data = await response.json();
            if (data.choices && data.choices.length > 0) {
                const content = data.choices[0].message.content || '';
                return typeof content === 'string' ? content.split('\n').filter(line => line.trim() !== '') : [String(content)];
            }
            console.error('No choices found in proxy response:', data);
            return ["Sorry, I couldn't generate a suggestion. Please try again."];
        } catch (err) {
            console.error('Error calling proxy:', err);
            return ["An error occurred while calling the OpenAI proxy."];
        }
    }

    // We require the proxy; do not attempt direct OpenAI calls from the client.
    console.error('Proxy not available. This extension requires the server-side proxy.');
    return ["Proxy not available. Please ensure the extension can reach the configured proxy."];
}

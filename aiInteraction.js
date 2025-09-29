// aiInteraction.js

// Function to get predictions from OpenAI API
export async function getPredictions(prompt, model = 'gpt-3.5-turbo') {
    // First check if a proxy URL is configured in storage
    const proxyUrl = await new Promise((resolve) => {
        chrome.storage.local.get(['openaiProxyUrl'], function(result) {
            resolve(result.openaiProxyUrl);
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
            // Read optional proxy secret stored in extension options
            const proxyKey = await new Promise((resolve) => {
                chrome.storage.local.get(['openaiProxyKey'], function(result) {
                    resolve(result.openaiProxyKey);
                });
            });

            const headers = { 'Content-Type': 'application/json' };
            if (proxyKey) headers['x-proxy-key'] = proxyKey;

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

    // No proxy configured — fall back to direct call using stored API key
    const apiKey = await new Promise((resolve) => {
        chrome.storage.local.get(['openaiApiKey'], function(result) {
            resolve(result.openaiApiKey);
        });
    });

    if (!apiKey) {
        console.error('No OpenAI API key found in chrome.storage and no proxy configured. Please set one in options.');
        return ["OpenAI API key or proxy not configured. Please set it in the extension options."];
    }

    try {
        const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
        const response = await fetch(OPENAI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`Direct API request failed with status: ${response.status}`);
            return ["Sorry, I couldn't generate a suggestion. Please try again."];
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
            const content = data.choices[0].message.content || '';
            return typeof content === 'string' ? content.split('\n').filter(line => line.trim() !== '') : [String(content)];
        }
        console.error('No choices found in direct API response:', data);
        return ["Sorry, I couldn't generate a suggestion. Please try again."];
    } catch (err) {
        console.error('Error calling OpenAI directly:', err);
        return ["An error occurred while fetching predictions. Please check your API key and network connection."];
    }
}

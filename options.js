// options.js

// Load saved conversations from storage
function loadConversations() {
    chrome.storage.local.get(['conversations'], function(result) {
        const conversations = result.conversations || [];
        const conversationList = document.getElementById('conversation-list');
        conversationList.innerHTML = ''; // Clear existing list

        conversations.forEach((conv, index) => {
            const convDiv = document.createElement('div');
            convDiv.classList.add('conversation-item');

            // Collapsible view
            const title = document.createElement('div');
            title.classList.add('conversation-title');
            title.textContent = `Conversation ${index + 1}`;

            const content = document.createElement('div');
            content.classList.add('conversation-content');
            content.style.display = 'none';
            content.textContent = JSON.stringify(conv, null, 2);

            title.addEventListener('click', () => {
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
            });

            // Add delete button for each conversation
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-button');
            deleteButton.onclick = () => deleteConversation(index);

            convDiv.appendChild(title);
            convDiv.appendChild(content);
            convDiv.appendChild(deleteButton);
            conversationList.appendChild(convDiv);
        });
    });
}

// Delete a single conversation
function deleteConversation(index) {
    chrome.storage.local.get(['conversations'], function(result) {
        let conversations = result.conversations || [];
        conversations.splice(index, 1); // Remove the selected conversation
        chrome.storage.local.set({ 'conversations': conversations }, function() {
            loadConversations(); // Reload the list
        });
    });
}

// Delete all conversations
document.getElementById('deleteAllBtn').addEventListener('click', function() {
    if (confirm("Are you sure you want to delete all conversations?")) {
        chrome.storage.local.set({ 'conversations': [] }, function() {
            loadConversations();
        });
    }
});

// Save layout option
document.getElementById('saveLayout').addEventListener('click', function() {
    const layout = document.querySelector('input[name="layout"]:checked').value;
    chrome.storage.local.set({ 'layout': layout }, function() {
        alert('Layout saved!');
    });
});

// Save OpenAI prompt
document.getElementById('savePromptButton').addEventListener('click', function() {
    const openaiPrompt = document.getElementById('openaiPrompt').value;
    chrome.storage.local.set({ openaiPrompt }, function() {
        alert('OpenAI prompt saved.');
    });
});

// Save OpenAI API Key
document.getElementById('saveApiKeyButton').addEventListener('click', function() {
    const apiKey = document.getElementById('openaiApiKey').value.trim();
    if (!apiKey) {
        alert('Please enter a valid API key.');
        return;
    }
    chrome.storage.local.set({ openaiApiKey: apiKey }, function() {
        alert('API key saved locally.');
    });
});

// Clear OpenAI API Key
document.getElementById('clearApiKeyButton').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear the stored OpenAI API key?')) {
        chrome.storage.local.remove('openaiApiKey', function() {
            document.getElementById('openaiApiKey').value = '';
            alert('API key cleared.');
        });
    }
});

// Save Proxy URL
document.getElementById('saveProxyButton').addEventListener('click', function() {
    const proxy = document.getElementById('openaiProxyUrl').value.trim();
    if (!proxy) {
        alert('Please enter a valid proxy URL or clear the field.');
        return;
    }
    chrome.storage.local.set({ openaiProxyUrl: proxy }, function() {
        alert('Proxy URL saved locally.');
    });
});

// Clear Proxy URL
document.getElementById('clearProxyButton').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear the saved proxy URL?')) {
        chrome.storage.local.remove('openaiProxyUrl', function() {
            document.getElementById('openaiProxyUrl').value = '';
            alert('Proxy URL cleared.');
        });
    }
});

// Save Proxy Secret
document.getElementById('saveProxyKeyButton').addEventListener('click', function() {
    const key = document.getElementById('openaiProxyKey').value.trim();
    if (!key) {
        alert('Please enter the proxy secret.');
        return;
    }
    chrome.storage.local.set({ openaiProxyKey: key }, function() {
        alert('Proxy secret saved locally.');
    });
});

// Clear Proxy Secret
document.getElementById('clearProxyKeyButton').addEventListener('click', function() {
    if (confirm('Are you sure you want to clear the saved proxy secret?')) {
        chrome.storage.local.remove('openaiProxyKey', function() {
            document.getElementById('openaiProxyKey').value = '';
            alert('Proxy secret cleared.');
        });
    }
});

// Initialize the options page
document.addEventListener('DOMContentLoaded', function() {
    loadConversations();

    // Load the saved layout option
    chrome.storage.local.get(['layout'], function(result) {
        if (result.layout) {
            document.querySelector(`input[value="${result.layout}"]`).checked = true;
        }
    });

    // Load the saved OpenAI prompt
    chrome.storage.local.get(['openaiPrompt'], function(result) {
        if (result.openaiPrompt) {
            document.getElementById('openaiPrompt').value = result.openaiPrompt;
        }
    });

    // Load saved OpenAI API Key (do not display it in plain text)
    chrome.storage.local.get(['openaiApiKey'], function(result) {
        if (result.openaiApiKey) {
            document.getElementById('openaiApiKey').value = result.openaiApiKey;
        }
    });

    // Load saved Proxy URL
    chrome.storage.local.get(['openaiProxyUrl'], function(result) {
        if (result.openaiProxyUrl) {
            document.getElementById('openaiProxyUrl').value = result.openaiProxyUrl;
        }
    });

    // Load saved Proxy Secret
    chrome.storage.local.get(['openaiProxyKey'], function(result) {
        if (result.openaiProxyKey) {
            document.getElementById('openaiProxyKey').value = result.openaiProxyKey;
        }
    });
});

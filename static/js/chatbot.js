/**
 * FitMaster — Universal Chatbot Controller
 * Handles real-time intelligent conversations across all pages
 */

(function() {
    'use strict';

    function initChatbot() {
        const toggleBtn = document.getElementById('chatbot-toggle-btn');
        const closeBtn = document.getElementById('chatbot-close-btn');
        const chatWindow = document.getElementById('chatbot-window');
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send-btn');
        const messagesBox = document.getElementById('chatbot-messages');

        if (!toggleBtn || !chatWindow || !input || !sendBtn || !messagesBox) {
            return;
        }

        // Avoid double initialization
        if (toggleBtn.dataset.initialized === 'true') return;
        toggleBtn.dataset.initialized = 'true';

        function toggleChat() {
            const isOpen = chatWindow.style.display === 'flex';
            if (isOpen) {
                chatWindow.style.display = 'none';
                toggleBtn.setAttribute('aria-expanded', 'false');
            } else {
                chatWindow.style.display = 'flex';
                toggleBtn.setAttribute('aria-expanded', 'true');
                setTimeout(() => input.focus(), 50);
            }
        }

        function formatMessageText(text) {
            if (!text) return '';
            // Basic markdown formatting: bold **text**, italics *text*, bullet points
            let formatted = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br>');
            return formatted;
        }

        function addMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${sender}`;
            const bubble = document.createElement('div');
            bubble.className = 'msg-bubble';
            bubble.innerHTML = formatMessageText(text);
            msgDiv.appendChild(bubble);
            messagesBox.appendChild(msgDiv);
            messagesBox.scrollTop = messagesBox.scrollHeight;
        }

        function addTypingIndicator() {
            const existing = document.getElementById('typing-indicator');
            if (existing) return;
            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.id = 'typing-indicator';
            indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
            messagesBox.appendChild(indicator);
            messagesBox.scrollTop = messagesBox.scrollHeight;
        }

        function removeTypingIndicator() {
            const indicator = document.getElementById('typing-indicator');
            if (indicator) indicator.remove();
        }

        function getCsrfToken() {
            const inputToken = document.querySelector('[name=csrfmiddlewaretoken]');
            if (inputToken && inputToken.value) return inputToken.value;
            const match = document.cookie.match(/csrftoken=([^;]+)/);
            return match ? match[1] : '';
        }

        async function sendMessage() {
            const text = input.value.trim();
            if (!text) return;

            addMessage(text, 'user');
            input.value = '';
            addTypingIndicator();

            try {
                const response = await fetch('/api/chatbot/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': getCsrfToken()
                    },
                    body: JSON.stringify({ message: text })
                });

                const data = await response.json();
                removeTypingIndicator();

                if (data && data.reply) {
                    addMessage(data.reply, 'bot');
                } else if (data && data.error) {
                    addMessage('⚠️ ' + data.error, 'bot');
                } else {
                    addMessage('Received empty response from assistant.', 'bot');
                }
            } catch (err) {
                removeTypingIndicator();
                addMessage("I'm having a brief sync issue. Please ask again in a moment.", 'bot');
                console.error('FitMaster Chatbot Error:', err);
            }
        }

        // Event listeners
        toggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleChat();
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleChat();
            });
        }

        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            sendMessage();
        });

        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });

        // Close when clicking outside on mobile/desktop
        document.addEventListener('click', function(e) {
            if (chatWindow.style.display === 'flex' &&
                !chatWindow.contains(e.target) &&
                !toggleBtn.contains(e.target)) {
                chatWindow.style.display = 'none';
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Escape key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && chatWindow.style.display === 'flex') {
                chatWindow.style.display = 'none';
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})();
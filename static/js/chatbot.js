/**
 * FitMaster AI — Interactive Chatbot Controller
 * Full-featured fitness assistant with quick-chips, smart markdown rendering & session memory.
 */

(function () {
    'use strict';

    function initChatbot() {
        const toggleBtn = document.getElementById('chatbot-toggle-btn');
        const closeBtn = document.getElementById('chatbot-close-btn');
        const clearBtn = document.getElementById('chatbot-clear-btn');
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

        const iconClosed = toggleBtn.querySelector('.chatbot-icon-closed');
        const iconOpen = toggleBtn.querySelector('.chatbot-icon-open');

        function toggleChat(forceOpen) {
            const isCurrentlyOpen = chatWindow.style.display === 'flex';
            const shouldOpen = forceOpen !== undefined ? forceOpen : !isCurrentlyOpen;

            if (shouldOpen) {
                chatWindow.style.display = 'flex';
                toggleBtn.setAttribute('aria-expanded', 'true');
                if (iconClosed) iconClosed.style.display = 'none';
                if (iconOpen) iconOpen.style.display = 'inline-block';
                setTimeout(() => {
                    input.focus();
                    messagesBox.scrollTop = messagesBox.scrollHeight;
                }, 100);
            } else {
                chatWindow.style.display = 'none';
                toggleBtn.setAttribute('aria-expanded', 'false');
                if (iconClosed) iconClosed.style.display = 'inline-block';
                if (iconOpen) iconOpen.style.display = 'none';
            }
        }

        function formatMessageText(text) {
            if (!text) return '';
            let formatted = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code>$1</code>')
                .replace(/\n\n/g, '<br><br>')
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

        async function sendMessage(textToSend) {
            const text = (textToSend || input.value).trim();
            if (!text) return;

            addMessage(text, 'user');
            if (!textToSend) {
                input.value = '';
            }
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
                    addMessage('I received an empty response. Please try rephrasing.', 'bot');
                }
            } catch (err) {
                removeTypingIndicator();
                addMessage("⚡ I'm having a brief sync issue. Please try again in a moment.", 'bot');
                console.error('FitMaster Chatbot Error:', err);
            }
        }

        // Handle Quick Chips clicks
        messagesBox.addEventListener('click', function (e) {
            const chip = e.target.closest('.quick-chip');
            if (chip) {
                const query = chip.getAttribute('data-query') || chip.textContent.trim();
                sendMessage(query);
            }
        });

        // Toggle button
        toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleChat();
        });

        // Close button
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                toggleChat(false);
            });
        }

        // Clear chat button
        if (clearBtn) {
            clearBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                const welcomeMsg = messagesBox.querySelector('.welcome-msg');
                messagesBox.innerHTML = '';
                if (welcomeMsg) {
                    messagesBox.appendChild(welcomeMsg.cloneNode(true));
                } else {
                    addMessage("👋 Chat history cleared! How can I help you with your workouts or diet today?", "bot");
                }
            });
        }

        // Send button
        sendBtn.addEventListener('click', function (e) {
            e.preventDefault();
            sendMessage();
        });

        // Enter key to send
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
            }
        });

        // Close on clicking outside
        document.addEventListener('click', function (e) {
            if (chatWindow.style.display === 'flex' &&
                !chatWindow.contains(e.target) &&
                !toggleBtn.contains(e.target)) {
                toggleChat(false);
            }
        });

        // Escape key to close
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && chatWindow.style.display === 'flex') {
                toggleChat(false);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})();
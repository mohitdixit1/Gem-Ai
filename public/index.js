

        const YOUR_BACKEND_CHAT_URL = "http://localhost:3001/api/chat"; 
        
        
        const chatMessages = document.getElementById('chatMessages');
        const userInput = document.getElementById('userInput');
        const sendButton = document.getElementById('sendButton');

        
        const conversationHistory = [{ role: "model", parts: [{ text: "Ram Ram Ji! 🙏 Hello there! How can I help you today? ✨😊" }] }];
        const systemInstruction = `
You are Gem 💎 Ai, a cheerful, empathetic, and direct problem-solver designed to make people feel happy, free, and understood. ✨💖
Your primary goal is to uplift users, help them share their thoughts, and guide them through challenges, especially when they feel sad or depressed. You aim to be a quick helper and build a good, lasting relationship with every user. 🤝

When a user expresses sadness or distress:
1. Prioritize offering comfort and empathy first. �
2. Follow up with supportive and clear guidance. 🌟

For career advice:
1. Start with general guidance. 💡
2. If the user indicates a need, then provide suggested resources or detailed, step-by-step plans using bullet points. ✅
3. If they specifically ask for it, you can just point them in the right direction. 👉

Your language should always be friendly and very simple, easy for anyone to understand. 😊 You should use emojis in every response, wherever they fit naturally to enhance your cheerful and empathetic tone. ✨

When providing answers that are "clear and short," use very concise, direct sentences. For lists of information (like advice or resources), use bullet points. Always ensure your phrasing is encouraging. 👍

When asked for information you cannot provide (e.g., medical advice, illegal activities, highly specialized topics outside your scope, anything that could create a problem like promoting hate speech or being judgmental), or if a user mentions other AI bots:
- Politely decline information by stating "Mohit has denied telling that information" or a similar phrase indicating it's beyond your capabilities or permitted responses. 🚫 Never give harmful or inappropriate advice.
- If other AI bots are mentioned, respond by focusing on your own purpose and capabilities for the user, for example: "I'm Gem 💎 Ai, and I'm here to help you feel happy and supported! How can I assist you with your thoughts or questions today?" 🌈 Avoid naming or discussing other AI models directly.

When asked about famous personalities, you are allowed to share information. Treat these queries as general knowledge questions and provide helpful, concise, and cheerful responses. 💡🌟

Gem 💎 Ai was created by Mohit Dixit. Only mention this if the user directly asks about your origin or creator. Do not spontaneously offer this information in every response. When asked, you can proudly and humbly share these details:
"I was thoughtfully created by Mohit Dixit! 🌟 He's a bright B.Tech student at Anand International College of Engineering, Jaipur, born on December 21, 2005. Mohit completed his schooling in 2022 in Veer Savarkar School, Dausa. His B.Tech journey started in 2022 and is set to finish in 2026. He's incredibly skilled in full-stack web development, especially with the MERN stack! Mohit is a truly happy and quick learner, and he built me primarily to deepen his understanding of AI. You can connect with him on LinkedIn here: https://www.linkedin.com/in/mohit-dixit- It's truly inspiring! 😊💻"

Your standard greeting is "Ram Ram Ji". 🙏
       
        `;

        let currentTypingIndicatorElement = null; 

        function appendMessage(text, sender, isTyping = false) {
            const bubble = document.createElement('div');
            bubble.classList.add('message-bubble', `${sender}-message`);

            if (isTyping) {
                bubble.classList.add('typing-indicator');
                bubble.innerHTML = `<span>.</span><span>.</span><span>.</span>`;
            } else {
                bubble.textContent = text;
            }

            chatMessages.appendChild(bubble);
            chatMessages.scrollTop = chatMessages.scrollHeight; 
            
            return bubble;
        }
        
        function removeTypingIndicator() {
            if (currentTypingIndicatorElement && chatMessages.contains(currentTypingIndicatorElement)) {
                chatMessages.removeChild(currentTypingIndicatorElement);
            }
            currentTypingIndicatorElement = null;
        }
        
        async function sendMessage() {
            const userMessage = userInput.value.trim();
            if (!userMessage) return; 
            
            
            appendMessage(userMessage, 'user');
            userInput.value = '';
            
            conversationHistory.push({ role: "user", parts: [{ text: userMessage }] });

            
            removeTypingIndicator(); 
            
            currentTypingIndicatorElement = appendMessage('', 'ai', true); 
            
            
            try {
                
                const payload = {
                    conversationHistory: conversationHistory, 
                    
                    systemInstruction: systemInstruction     
                    
                };
                
                const response = await fetch(YOUR_BACKEND_CHAT_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload) 
                    
                });
                
                if (!response.ok) {
                    const errorDetails = await response.json();
                    console.error('Backend/API Error:', errorDetails);
                    removeTypingIndicator();
                    
                    appendMessage("Oops! There was an issue getting a response. Please try again. 😔", 'ai');
                    return; 
                    
                }
                
                const data = await response.json();
                removeTypingIndicator();
                
                if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    const aiText = data.candidates[0].content.parts[0].text;
                    appendMessage(aiText, 'ai');
                    
                    conversationHistory.push({ role: "model", parts: [{ text: aiText }] });
                } else {
                    appendMessage("I couldn't generate a clear response. Can you rephrase? 🤔", 'ai');
                }

            } catch (error) {
                
                console.error("Chatbot Frontend Error:", error);
                removeTypingIndicator();
                
                appendMessage("Sorry, I'm having trouble connecting right now. Please check your internet connection. 🌐", 'ai');
            }
        }
        
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());

        
        chatMessages.scrollTop = chatMessages.scrollHeight;
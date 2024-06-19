import { useState } from 'react';

function useCustomChat(apiUrl) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };

        setMessages([...messages, userMessage]);

        setInput('');

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const assistantMessage = { role: 'assistant', content: data.content };
                setMessages([...messages, userMessage, assistantMessage]);
            } else {
                console.error('Error:', data.error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return {
        messages,
        input,
        handleInputChange,
        handleSubmit,
    };
}

export default useCustomChat;

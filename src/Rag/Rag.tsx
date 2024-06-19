import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import useCustomChat from './useCustomChat';
import './Rag.css';

function Rag() {
    const { messages, input, handleInputChange, handleSubmit } = useCustomChat('http://localhost:3000/api');
    const chatParent = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const domNode = chatParent.current;
        if (domNode) {
            domNode.scrollTop = domNode.scrollHeight;
        }
    }, [messages]);

    const handleToggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <button className="chat-toggle-button" onClick={handleToggleChat}>
                Ba Chat Bot
            </button>

            {isOpen && createPortal(
                <div className="chat-modal">
                    <div className="chat-container">
                        <header className="chat-header">
                            <h1 className="chat-title">BA Chat bot</h1>
                            <button className="close-button" onClick={handleToggleChat}>×</button>
                        </header>

                        <section className="chat-input-section">
                            <form onSubmit={handleSubmit} className="chat-form">
                                <input
                                    className="chat-input"
                                    placeholder="Type your question here..."
                                    type="text"
                                    value={input}
                                    onChange={handleInputChange}
                                />
                                <button className="chat-submit-button" type="submit">
                                    Submit
                                </button>
                            </form>
                        </section>

                        <section className="chat-messages-section">
                            <ul ref={chatParent} className="chat-messages-list">
                                {messages.map((m, index) => (
                                    <div key={index}>
                                        {m.role === 'user' ? (
                                            <li className="chat-message user-message">
                                                <div className="message-content">
                                                    <p>{m.content}</p>
                                                </div>
                                            </li>
                                        ) : (
                                            <li className="chat-message assistant-message">
                                                <div className="message-content">
                                                    <p>{m.content}</p>
                                                </div>
                                            </li>
                                        )}
                                    </div>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

export default Rag;

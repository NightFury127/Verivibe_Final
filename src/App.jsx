import React, { useState, useEffect, useRef } from 'react';

const ParticleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particlesArray = [];
        const numberOfParticles = 100;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 5 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.2) this.size -= 0.1;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function initParticles() {
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
                if (particlesArray[i].size <= 0.2) {
                    particlesArray.splice(i, 1);
                    i--;
                    particlesArray.push(new Particle());
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <canvas id="particles" ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10"></canvas>;
};

const FakeNewsDetector = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [newsText, setNewsText] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [file, setFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [result, setResult] = useState(null);
    const [confidence, setConfidence] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const recognitionRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onstart = () => setIsRecording(true);
            recognitionRef.current.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' ';
                    } else {
                        interimTranscript += transcript;
                    }
                }

                setNewsText(finalTranscript + interimTranscript);
                updateWordCount(finalTranscript + interimTranscript);
            };

            recognitionRef.current.onerror = (event) => {
                let errorMessage = '';
                switch (event.error) {
                    case 'no-speech':
                        errorMessage = 'No speech detected. Please try again.';
                        break;
                    case 'audio-capture':
                        errorMessage = 'Microphone not detected. Please check your audio input.';
                        break;
                    case 'not-allowed':
                        errorMessage = 'Microphone access denied. Please allow microphone permissions.';
                        break;
                    default:
                        errorMessage = `Speech recognition error: ${event.error}`;
                }
                alert(errorMessage);
                stopSpeechRecognition();
            };

            recognitionRef.current.onend = () => stopSpeechRecognition();
        }

        window.addEventListener('blur', handleWindowBlur);
        return () => window.removeEventListener('blur', handleWindowBlur);
    }, []);

    const handleWindowBlur = () => {
        if (isRecording) stopSpeechRecognition();
    };

    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    const updateWordCount = (text) => {
        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        setWordCount(words);
        setResult(null);
    };

    const handleTextChange = (e) => {
        setNewsText(e.target.value);
        updateWordCount(e.target.value);
    };

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFilePreview(null);
        setFileType(null);

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = () => {
                setFilePreview(reader.result);
                setFileType(selectedFile.type);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const toggleSpeechRecognition = () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in your browser. Please use Chrome or another compatible browser.');
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (e) {
                if (e.name === 'InvalidStateError') {
                    alert('Speech recognition is already active or microphone is in use.');
                }
            }
        }
    };

    const stopSpeechRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsRecording(false);
    };

    const simulateFakeNewsDetection = (text) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const fakeKeywords = ['hoax', 'fake', 'conspiracy', 'unverified'];
                const isFake = fakeKeywords.some(keyword => 
                    text.toLowerCase().includes(keyword)
                );
                const confidence = Math.floor(Math.random() * 20) + 80;

                resolve({
                    isFake,
                    message: isFake 
                        ? 'Warning: This news appears to be potentially fake or unreliable.'
                        : 'This news appears to be reliable based on our analysis.',
                    confidence
                });
            }, 1500);
        });
    };

    const simulateFileAnalysis = (file) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const fakeKeywords = ['hoax', 'fake', 'conspiracy', 'unverified'];
                const isFake = fakeKeywords.some(keyword => 
                    file.name.toLowerCase().includes(keyword)
                );
                const confidence = Math.floor(Math.random() * 20) + 80;

                resolve({
                    isFake,
                    message: isFake 
                        ? `Warning: The file "${file.name}" appears to contain potentially fake or unreliable content.`
                        : `The file "${file.name}" appears to be reliable based on our analysis.`,
                    confidence
                });
            }, 1500);
        });
    };

    const checkNews = async () => {
        if (!newsText.trim() && !file) {
            alert('Please enter text or upload a file to analyze');
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            let response;
            if (file) {
                response = await simulateFileAnalysis(file);
            } else {
                response = await simulateFakeNewsDetection(newsText);
            }

            setResult(response);
            setConfidence(response.confidence);
            updateHistory(newsText || file?.name || 'File', response);
        } catch (error) {
            setResult({
                isFake: true,
                message: 'Error analyzing the content. Please try again.',
                confidence: 0
            });
            setConfidence(0);
        } finally {
            setIsLoading(false);
        }
    };

    const updateHistory = (input, response) => {
        setHistory(prev => [{
            text: input.substring(0, 50) + (input.length > 50 ? '...' : ''),
            result: response.message,
            timestamp: new Date().toLocaleTimeString()
        }, ...prev.slice(0, 4)]);
    };

    const clearInput = () => {
        setNewsText('');
        setFile(null);
        setFilePreview(null);
        setFileType(null);
        setResult(null);
        setConfidence(0);
        setWordCount(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (isRecording) stopSpeechRecognition();
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-5 transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-blue-400 to-purple-500'}`}>
            <ParticleCanvas />
            <div className={`relative bg-opacity-95 rounded-2xl shadow-2xl p-10 max-w-lg w-full ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} animate-[fadeIn_1s_ease-in]`}>
                <button 
                    className="absolute top-5 right-5 text-2xl bg-transparent border-none cursor-pointer"
                    onClick={toggleTheme}
                    title="Toggle Dark/Light Mode"
                >
                    {isDarkMode ? '☀️' : '🌙'}
                </button>
                <h1 className="text-center text-3xl font-bold uppercase tracking-wider mb-4">
                    Fake News Detector
                </h1>
                <div className={`p-5 rounded-lg mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} border-l-4 border-blue-400`}>
                    <h2 className="text-xl font-semibold mb-3">About This App</h2>
                    <p className="text-sm leading-relaxed">
                        Discover the truth with Fake News Detector! Type, paste, upload a file (image, video, or document), or use voice input to analyze content for misinformation. Enjoy real-time analysis, confidence meters, history tracking, and dark/light modes. Stay informed and combat fake news effortlessly. Note: This is a simulation; always cross-check with trusted sources.
                    </p>
                </div>
                <div className="mb-6 relative">
                    <div className="relative">
                        <textarea
                            id="newsInput"
                            className={`w-full h-40 p-4 border-2 rounded-lg resize-y text-base focus:outline-none focus:ring-2 transition-all ${isDarkMode ? 'bg-gray-700 text-gray-100 border-gray-600 focus:ring-blue-400' : 'bg-white text-gray-800 border-gray-200 focus:ring-blue-400'}`}
                            placeholder="Type, paste, or use voice input for news text..."
                            value={newsText}
                            onChange={handleTextChange}
                        ></textarea>
                        <span className={`absolute bottom-3 left-4 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {wordCount} words
                        </span>
                        <div className="absolute bottom-3 right-3 flex gap-2">
                            <div className="relative" title="Upload File">
                                <input
                                    type="file"
                                    id="fileInput"
                                    accept="image/*,video/*,*/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleFileUpload}
                                    ref={fileInputRef}
                                />
                                <button className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-blue-700' : 'bg-gradient-to-br from-blue-400 to-blue-600'} hover:scale-110 transition-all`}>
                                    📎
                                </button>
                            </div>
                            <button
                                id="micBtn"
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${isRecording ? (isDarkMode ? 'bg-gradient-to-br from-red-500 to-red-700 animate-pulse' : 'bg-gradient-to-br from-red-400 to-red-600 animate-pulse') : (isDarkMode ? 'bg-gradient-to-br from-orange-500 to-orange-700' : 'bg-gradient-to-br from-orange-400 to-orange-600')} hover:scale-110 transition-all`}
                                onClick={toggleSpeechRecognition}
                                title="Start/Stop Voice Input"
                            >
                                🎤
                            </button>
                        </div>
                    </div>
                    <div className="mt-2 flex flex-col items-start">
                        {filePreview && fileType?.startsWith('image/') && (
                            <img src={filePreview} className="max-w-full max-h-20 rounded-md mt-1" alt="File Preview" />
                        )}
                        {filePreview && fileType?.startsWith('video/') && (
                            <video src={filePreview} className="max-w-full max-h-20 rounded-md mt-1" controls></video>
                        )}
                        {file && (
                            <span className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                File: {file.name}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 mb-5">
                    <button
                        className={`flex-1 py-3 rounded-lg text-white font-bold uppercase tracking-wide hover:-translate-y-1 hover:shadow-lg transition-all ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-purple-500'}`}
                        onClick={checkNews}
                        title="Analyze the text or file"
                    >
                        Analyze News
                    </button>
                    <button
                        className={`flex-1 py-3 rounded-lg text-white font-bold uppercase tracking-wide hover:-translate-y-1 hover:shadow-lg transition-all ${isDarkMode ? 'bg-gradient-to-br from-red-500 to-red-700' : 'bg-gradient-to-br from-red-400 to-red-600'}`}
                        onClick={clearInput}
                        title="Clear all inputs"
                    >
                        Clear
                    </button>
                </div>
                {isLoading && (
                    <div className="text-center mt-5">
                        <div className="inline-block w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                {result && (
                    <div className={`mt-6 p-5 rounded-lg animate-[slideIn_0.5s_ease-out] ${result.isFake ? (isDarkMode ? 'bg-red-900 border-l-4 border-red-500' : 'bg-red-100 border-l-4 border-red-500') : (isDarkMode ? 'bg-green-900 border-l-4 border-green-500' : 'bg-green-100 border-l-4 border-green-500')}`}>
                        <p className={`text-base font-medium ${result.isFake ? 'text-red-600' : 'text-green-600'}`}>
                            {result.message}
                        </p>
                        <div className={`mt-4 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div
                                className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-1000"
                                style={{ width: `${confidence}%` }}
                            ></div>
                        </div>
                    </div>
                )}
                {history.length > 0 && (
                    <div className={`mt-5 p-4 rounded-lg max-h-48 overflow-y-auto ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <h3 className="text-lg font-semibold mb-2">Recent Checks</h3>
                        {history.map((item, index) => (
                            <div
                                key={index}
                                className={`p-2 border-b last:border-b-0 ${isDarkMode ? 'border-gray-600 hover:bg-gray-600' : 'border-gray-200 hover:bg-gray-200'} transition-all`}
                            >
                                <strong>{item.timestamp}</strong>: {item.text}<br />
                                <span>{item.result}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FakeNewsDetector;
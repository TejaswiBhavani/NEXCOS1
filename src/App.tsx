import React, { useState, useRef } from 'react';
import {
  Stethoscope,
  FileText,
  AlertCircle,
  Bell,
  Settings,
  Search,
  Plus,
  Calendar,
  Clock,
  User,
  Pill,
  Upload,
  X,
  Mic,
  MicOff,
  Volume2,
  Send,
  MessageSquare
} from 'lucide-react';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [textQuestion, setTextQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'ai'; text: string}>>([]);
  const [showTextChat, setShowTextChat] = useState(true);
  
  const synth = window.speechSynthesis;
  const recognition = useRef<any>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize speech recognition
  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      recognition.current = new (window as any).webkitSpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      
      recognition.current.onresult = (event: any) => {
        const question = event.results[0][0].transcript.toLowerCase();
        handleUserQuestion(question);
      };
      
      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  // Handle user's questions (both voice and text)
  const handleUserQuestion = (question: string) => {
    let response = "";
    
    if (question.includes("side effects")) {
      response = "The main side effects of Amoxicillin can include stomach upset, diarrhea, and in rare cases, allergic reactions. If you experience any severe reactions, contact your healthcare provider immediately.";
    } else if (question.includes("food")) {
      response = "Yes, you can take Amoxicillin with or without food. However, taking it with food might help reduce stomach upset.";
    } else if (question.includes("miss dose") || question.includes("missed dose")) {
      response = "If you miss a dose, take it as soon as you remember. However, if it's almost time for your next dose, skip the missed dose and continue with your regular schedule. Don't take a double dose.";
    } else if (question.includes("how long") || question.includes("duration")) {
      response = "You should take this medication for the full prescribed duration of 7 days, even if you start feeling better. This ensures the infection is completely cleared.";
    } else if (question.includes("store") || question.includes("storage")) {
      response = "Store Amoxicillin at room temperature (between 68-77°F or 20-25°C), away from moisture and heat. Keep it in its original container with the lid tightly closed.";
    } else if (question.includes("interact") || question.includes("interaction")) {
      response = "Amoxicillin may interact with certain medications. Always inform your healthcare provider about any other medications you're taking, including over-the-counter drugs and supplements.";
    } else {
      response = "I'm not sure about that specific question. Please consult your pharmacist or healthcare provider for more detailed information.";
    }
    
    setChatHistory(prev => [...prev, 
      { type: 'user', text: question },
      { type: 'ai', text: response }
    ]);
    
    speakText(response);
    setTextQuestion('');
  };

  // Handle text submission
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (textQuestion.trim()) {
      handleUserQuestion(textQuestion.trim());
    }
  };

  // Text-to-speech function
  const speakText = (text: string) => {
    if (synth.speaking) {
      synth.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    synth.speak(utterance);
  };

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (!recognition.current) {
      initializeSpeechRecognition();
    }
    
    if (isListening) {
      recognition.current.stop();
    } else {
      recognition.current.start();
      setIsListening(true);
    }
  };
  
  // Scroll chat to bottom
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const pendingPrescriptions = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      medication: "Amoxicillin 500mg",
      status: "Pending Review",
      priority: "High",
      time: "10:30 AM"
    },
    {
      id: 2,
      patientName: "Michael Chen",
      medication: "Lisinopril 10mg",
      status: "Processing",
      priority: "Medium",
      time: "11:15 AM"
    },
    {
      id: 3,
      patientName: "Emily Davis",
      medication: "Metformin 850mg",
      status: "Pending Review",
      priority: "Normal",
      time: "11:45 AM"
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setIsAnalyzing(true);
        setTimeout(() => {
          const analysis = "Let me explain this prescription for you:\n\n" +
            "The doctor has prescribed Amoxicillin, which is an antibiotic medication. " +
            "The dosage is 500mg, to be taken three times daily for 7 days. " +
            "This means you should take one capsule in the morning, one in the afternoon, and one in the evening, preferably with food.\n\n" +
            "Important notes:\n" +
            "- Take the full course of antibiotics, even if you feel better\n" +
            "- Space doses evenly throughout the day\n" +
            "- Store at room temperature\n" +
            "- May cause mild stomach upset\n\n" +
            "You can ask me questions about side effects, timing, or any other concerns!";
          
          setIsAnalyzing(false);
          setAiAnalysis(analysis);
          speakText(analysis);
          setChatHistory([{ type: 'ai', text: analysis }]);
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">ScriptSync AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-6 w-6" />
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white font-medium">DR</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Actions */}
        <div className="flex justify-between mb-8">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search prescriptions, patients, or medications..."
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700"
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload Prescription
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700">
              <Plus className="h-5 w-5 mr-2" />
              New Prescription
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Pending Review</h3>
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">24</p>
            <p className="text-sm text-gray-500">8 high priority</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Alerts</h3>
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-500">Drug interactions detected</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Processing</h3>
              <Pill className="h-6 w-6 text-green-500" />
            </div>
            <p className="mt-2 text-3xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-500">Est. completion in 45 mins</p>
          </div>
        </div>

        {/* Pending Prescriptions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-medium text-gray-900">Pending Prescriptions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingPrescriptions.map((prescription) => (
              <div key={prescription.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="ml-2 font-medium text-gray-900">{prescription.patientName}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    prescription.priority === 'High' ? 'bg-red-100 text-red-800' :
                    prescription.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {prescription.priority}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-500">{prescription.medication}</span>
                  <div className="flex items-center text-gray-400">
                    <Clock className="h-4 w-4 mr-1" />
                    {prescription.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-5xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Upload Prescription</h2>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadedImage(null);
                    setAiAnalysis(null);
                    setChatHistory([]);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {!uploadedImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Upload a prescription image to get AI analysis</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="prescription-upload"
                  />
                  <label
                    htmlFor="prescription-upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 inline-block"
                  >
                    Select Image
                  </label>
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-5">
                    <h3 className="text-lg font-medium mb-2">Uploaded Prescription</h3>
                    <img
                      src={uploadedImage}
                      alt="Uploaded prescription"
                      className="w-full rounded-lg border border-gray-200"
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-7">
                    <div className="h-full flex flex-col">
                      <h3 className="text-lg font-medium mb-2 flex items-center justify-between">
                        <span>AI Analysis</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowTextChat(!showTextChat)}
                            className={`p-2 rounded-full ${showTextChat ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                            title="Toggle chat view"
                          >
                            <MessageSquare className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => speakText(aiAnalysis || '')}
                            className={`p-2 rounded-full ${isSpeaking ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                            title="Read analysis"
                          >
                            <Volume2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={toggleVoiceInput}
                            className={`p-2 rounded-full ${isListening ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100'}`}
                            title="Ask a question"
                          >
                            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                          </button>
                        </div>
                      </h3>
                      
                      {isAnalyzing ? (
                        <div className="flex items-center justify-center flex-1">
                          <div className="animate-pulse text-gray-600">
                            Analyzing prescription...
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col">
                          <div 
                            ref={chatContainerRef}
                            className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto mb-4"
                            style={{ maxHeight: '400px' }}
                          >
                            {chatHistory.map((message, index) => (
                              <div
                                key={index}
                                className={`mb-4 ${
                                  message.type === 'user' ? 'ml-auto max-w-[80%]' : 'mr-auto max-w-[80%]'
                                }`}
                              >
                                <div
                                  className={`rounded-lg p-3 ${
                                    message.type === 'user'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-white border border-gray-200'
                                  }`}
                                >
                                  <p className="whitespace-pre-line">{message.text}</p>
                                </div>
                              </div>
                            ))}
                            {isListening && (
                              <div className="mb-4 mr-auto max-w-[80%]">
                                <div className="bg-blue-50 text-blue-700 rounded-lg p-3 animate-pulse">
                                  Listening for your question...
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {showTextChat && (
                            <form onSubmit={handleSubmitQuestion} className="flex space-x-2">
                              <input
                                type="text"
                                value={textQuestion}
                                onChange={(e) => setTextQuestion(e.target.value)}
                                placeholder="Type your question here..."
                                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                                disabled={!textQuestion.trim()}
                              >
                                <Send className="h-5 w-5" />
                              </button>
                            </form>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
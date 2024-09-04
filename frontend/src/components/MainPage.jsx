import React, { useState } from 'react';
import { XCircle, Menu, Send, Download, Play, Pause } from 'lucide-react';

const VoiceSettings = ({ person, settings, updateSettings }) => {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">{person} Settings</h3>
      <select
        className="w-full p-2 mb-2 border rounded"
        value={settings.voice}
        onChange={(e) => updateSettings(person, 'voice', e.target.value)}
      >
        <option value="en-US-JennyNeural">Jenny (Female)</option>
        <option value="en-US-GuyNeural">Guy (Male)</option>
      </select>
      <select
        className="w-full p-2 mb-2 border rounded"
        value={settings.style}
        onChange={(e) => updateSettings(person, 'style', e.target.value)}
      >
        <option value="cheerful">Cheerful</option>
        <option value="serious">Serious</option>
        <option value="excited">Excited</option>
      </select>
      <input
        type="range"
        min="-50"
        max="50"
        value={parseInt(settings.rate)}
        onChange={(e) => updateSettings(person, 'rate', `${e.target.value}%`)}
        className="w-full mb-2"
      />
      <label className="block text-sm">Rate: {settings.rate}</label>
      <input
        type="range"
        min="-50"
        max="50"
        value={parseInt(settings.pitch)}
        onChange={(e) => updateSettings(person, 'pitch', `${e.target.value}%`)}
        className="w-full mb-2"
      />
      <label className="block text-sm">Pitch: {settings.pitch}</label>
    </div>
  );
};

export default function PodcastGenerator() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversationText, setConversationText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    Person1: {
      voice: "en-US-JennyNeural",
      style: "cheerful",
      rate: "5%",
      pitch: "2%"
    },
    Person2: {
      voice: "en-US-GuyNeural",
      style: "serious",
      rate: "-5%",
      pitch: "-2%"
    }
  });

  const updateSettings = (person, setting, value) => {
    setVoiceSettings(prev => ({
      ...prev,
      [person]: {
        ...prev[person],
        [setting]: value
      }
    }));
  };

  const parseConversation = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const conversation = [];
    let currentSpeaker = '';
    let currentText = '';

    lines.forEach(line => {
      if (line.startsWith('Person1:') || line.startsWith('Person2:')) {
        if (currentSpeaker && currentText) {
          conversation.push({ speaker: currentSpeaker, text: currentText.trim() });
        }
        currentSpeaker = line.startsWith('Person1:') ? 'Person1' : 'Person2';
        currentText = line.substring(line.indexOf(':') + 1).trim();
      } else {
        currentText += ' ' + line.trim();
      }
    });

    if (currentSpeaker && currentText) {
      conversation.push({ speaker: currentSpeaker, text: currentText.trim() });
    }

    return conversation;
  };

  const handleSubmit = async () => {
    console.log("process.env.REACT_APP_BACKEND_URL",process.env.REACT_APP_BACKEND_URL)
    setLoading(true);
    try {
      const parsedConversation = parseConversation(conversationText);
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/conversation/synthesize-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation: parsedConversation,
          voiceSettings
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else {
        console.error('Failed to generate audio');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlayPause = () => {
    const audio = document.getElementById('podcast-audio');
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="p-4">
          <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4">
            <XCircle className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold mb-4">Voice Settings</h2>
          <VoiceSettings person="Person1" settings={voiceSettings.Person1} updateSettings={updateSettings} />
          <VoiceSettings person="Person2" settings={voiceSettings.Person2} updateSettings={updateSettings} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              {audioUrl ? 'Generated Podcast' : 'Podcast Generation'}
            </h1>
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
          ) : audioUrl ? (
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
              <audio id="podcast-audio" src={audioUrl} className="w-full mb-4" />
              <div className="flex justify-center space-x-4">
                <button onClick={togglePlayPause} className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                  {isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <a href={audioUrl} download="podcast.mp3" className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300">
                  <Download className="mr-2" />
                  Download
                </a>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <textarea
                value={conversationText}
                onChange={(e) => setConversationText(e.target.value)}
                placeholder="Paste your conversation here..."
                className="w-full h-64 p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                >
                  <Send className="mr-2" />
                  Generate Podcast
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

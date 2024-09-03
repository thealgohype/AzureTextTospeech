// const express = require('express');
// const { conversationrouter } = require('./routes/conversstion');
// require('dotenv').config();

// const app = express();
// app.use(express.json());

// app.use("/conversation",conversationrouter)

// const PORT = process.env.PORT || 8080;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });










// const express = require('express');
// const sdk = require("microsoft-cognitiveservices-speech-sdk");
// const fs = require('fs');
// const path = require('path');
// const { generateSSML } = require('../functions/generatessml');
// require('dotenv').config();
// const conversationrouter = express.Router()

// function log_to_file(content) {
//     const logFilePath = path.join(__dirname, '..', 'uploads', 'api_log.txt');
//     fs.appendFileSync(logFilePath, content + '\n');
// }

// function create_uploads_directory() {
//     const uploadsDir = path.join(__dirname, '..', 'uploads');
//     if (!fs.existsSync(uploadsDir)) {
//         fs.mkdirSync(uploadsDir, { recursive: true });
//     }
// }

// function generateUniqueFilename() {
//     const now = new Date();
//     return `conversation_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}.mp3`;
// }

// create_uploads_directory();

// conversationrouter.post('/synthesize-conversation', async (req, res) => {
//     try {
//         const { conversation, voiceSettings } = req.body;
//         if (!conversation || conversation.length === 0) {
//             log_to_file('Error: Conversation data is required');
//             return res.status(400).send('Conversation data is required');
//         }
        
//         log_to_file('Received request: ' + JSON.stringify(req.body));
        
//         const ssml = generateSSML(conversation, voiceSettings);
//         log_to_file('Generated SSML: ' + ssml);
        
//         const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
//         speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;
        
//         const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
        
//         synthesizer.speakSsmlAsync(
//             ssml,
//             result => {
//                 if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
//                     const audioData = result.audioData;
//                     let audioFilename = 'conversation.mp3';
//                     let audioFilePath = path.join(__dirname, '..', 'uploads', audioFilename);

//                     if (fs.existsSync(audioFilePath)) {
//                         audioFilename = generateUniqueFilename();
//                         audioFilePath = path.join(__dirname, '..', 'uploads', audioFilename);
//                     }

//                     fs.writeFileSync(audioFilePath, Buffer.from(audioData));
//                     log_to_file('Speech synthesis completed. Audio saved to: ' + audioFilePath);
                    
//                     res.set({
//                         'Content-Type': 'audio/mpeg',
//                         'Content-Disposition': `attachment; filename=${audioFilename}`
//                     });
//                     res.sendFile(audioFilePath);
//                 } else {
//                     const errorMessage = "Speech synthesis canceled, " + result.errorDetails;
//                     log_to_file('Error: ' + errorMessage);
//                     res.status(500).send(errorMessage);
//                 }
//                 synthesizer.close();
//             },
//             error => {
//                 const errorMessage = "Speech synthesis failed: " + error;
//                 log_to_file('Error: ' + errorMessage);
//                 res.status(500).send(errorMessage);
//                 synthesizer.close();
//             }
//         );
//     } catch (error) {
//         const errorMessage = 'Error synthesizing conversation: ' + error.message;
//         log_to_file('Error: ' + errorMessage);
//         res.status(500).send(errorMessage);
//     }
// });

// module.exports = {
//     conversationrouter
// }
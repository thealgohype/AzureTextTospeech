function generateSSML(conversationArray, voiceSettings) {
  let ssml = '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US" xmlns:mstts="http://www.w3.org/2001/mstts">\n';
  
  for (let i = 0; i < conversationArray.length; i++) {
    const { speaker, text } = conversationArray[i];
    const settings = voiceSettings[speaker];
    const { voice, style = '', rate = '0%', pitch = '0%' } = settings;
    
    ssml += `  <voice name="${voice}">\n`;
    ssml += `    <prosody rate="${rate}" pitch="${pitch}">\n`;
    if (style) {
      ssml += `      <mstts:express-as style="${style}">\n`;
    }
    ssml += `        ${text.trim()}\n`;
    if (style) {
      ssml += `      </mstts:express-as>\n`;
    }
    // Add a pause after each person's speech, except for the last one
    if (i < conversationArray.length - 1) {
      ssml += `        <break time="500ms"/>\n`;
    }
    ssml += `    </prosody>\n`;
    ssml += `  </voice>\n`;
  }
  
  ssml += '</speak>';
  return ssml;
}
  

  module.exports = {
    generateSSML
  }
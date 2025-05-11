export function speak(text) {
  if (!window.speechSynthesis) {
    console.warn("Text-to-Speech not supported in this browser.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.cancel(); // Cancel ongoing speech, if any
  speechSynthesis.speak(utterance);
}
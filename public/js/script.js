// jshint esversion:8

socket = io();

const outputYou = document.querySelector('.output-you');
const outputBot = document.querySelector('.output-bot');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', e => {
  recognition.start();
});

recognition.addEventListener('speechstart', () => {
  console.log('Speech has been detected.');
});

recognition.addEventListener('result', e => {
  const lastIndex = e.results.length - 1;
  const text = e.results[lastIndex][0].transcript;

  outputYou.textContent = text;
  console.log('text:', text, 'Confidence:', e.results[0][0].confidence);

  socket.emit('chat message', text);
});

recognition.addEventListener('speechend', () => {
  recognition.stop();
});

recognition.addEventListener('error', (e) => {
  outputBot.textContent = 'Error: ' + e.error;
});

socket.on('bot reply', function(replyText) {
  synthVoice(replyText);

  if(replyText == '') replyText = '(No answer...)';
  outputBot.textContent = replyText;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const voices = synth.getVoices();
  const voice = voices[49];
  console.log(voice);
  const utterance = new SpeechSynthesisUtterance();
  utterance.voice = voice;
  utterance.lang = voice.lang || 'en-US';
  utterance.text = text;
  synth.speak(utterance);
}

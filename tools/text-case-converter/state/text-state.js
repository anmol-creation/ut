// Simple state management for the text tool
const state = {
  inputText: '',
  outputText: ''
};

export function setInputText(text) {
  state.inputText = text;
}

export function getInputText() {
  return state.inputText;
}

export function setOutputText(text) {
  state.outputText = text;
}

export function getOutputText() {
  return state.outputText;
}

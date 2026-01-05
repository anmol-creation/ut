import { setInputText, setOutputText } from '../state/text-state.js';

export function resetTool(inputElement, outputElement) {
  inputElement.value = '';
  outputElement.value = '';
  setInputText('');
  setOutputText('');
}

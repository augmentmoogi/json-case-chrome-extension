document.addEventListener('DOMContentLoaded', function() {
  // Get DOM elements
  const inputJson = document.getElementById('input-json');
  const outputJson = document.getElementById('output-json');
  const convertBtn = document.getElementById('convert-btn');
  const copyBtn = document.getElementById('copy-btn');
  const pasteBtn = document.getElementById('paste-btn');
  const errorMessage = document.getElementById('error-message');

  // Convert camelCase/PascalCase to underscore_case
  function toUnderscoreCase(str) {
    return str
      .replace(/([A-Z])/g, '_$1')
      .replace(/^_/, '')
      .toLowerCase();
  }

  // Process JSON object recursively
  function processJsonObject(obj) {
    if (Array.isArray(obj)) {
      return obj.map(item => processJsonObject(item));
    } else if (obj !== null && typeof obj === 'object') {
      const newObj = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          const newKey = toUnderscoreCase(key);
          newObj[newKey] = processJsonObject(obj[key]);
        }
      }
      return newObj;
    }
    return obj;
  }

  // Convert JSON
  function convertJson() {
    try {
      errorMessage.classList.add('hidden');
      const input = inputJson.value.trim();
      
      if (!input) {
        showError('Please enter some JSON to convert');
        return;
      }
      
      const jsonObj = JSON.parse(input);
      const convertedObj = processJsonObject(jsonObj);
      outputJson.value = JSON.stringify(convertedObj, null, 2);
    } catch (error) {
      showError('Invalid JSON: ' + error.message);
    }
  }

  // Show error message
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
  }

  // Copy to clipboard
  function copyToClipboard() {
    outputJson.select();
    document.execCommand('copy');
    
    // Visual feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1500);
  }

  // Paste from clipboard
  function pasteFromClipboard() {
    navigator.clipboard.readText()
      .then(text => {
        inputJson.value = text;
      })
      .catch(err => {
        showError('Failed to read clipboard: ' + err);
      });
  }

  // Event listeners
  convertBtn.addEventListener('click', convertJson);
  copyBtn.addEventListener('click', copyToClipboard);
  pasteBtn.addEventListener('click', pasteFromClipboard);
});

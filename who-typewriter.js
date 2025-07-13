// Who Are We Typewriter Animation
(function() {
  const words = ["DCF", "NPV", "IRR", "WACC", "Financial Ratios"];
  let idx = 0;
  const el = document.getElementById('who-typewriter-words');
  function nextWord() {
    if (!el) return;
    el.textContent = words[idx];
    idx = (idx + 1) % words.length;
  }
  setInterval(nextWord, 1200);
  document.addEventListener('DOMContentLoaded', nextWord);
})();

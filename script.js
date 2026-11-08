/*
  script.js = the LOGIC of the website (what happens when you click).
  Created as a skeleton by Claude (AI), 8 Nov 2026.

  The recommendation algorithm will have 3 stages (details decided by Leon,
  every rule linked to a source in his research notes):
    1. FILTER  - remove irons that can never fit (e.g. budget, left-handed)
    2. SCORE   - each answer adds points to suitable irons
    3. RANK    - show the top 3, with the reasons from the rules that fired
*/

// For now the Start button only shows the (empty) questions page,
// to check that the files are connected correctly.
document.getElementById("start-button").addEventListener("click", function () {
  document.getElementById("home").hidden = true;
  document.getElementById("questions").hidden = false;
  document.getElementById("questions").textContent = "Questions will go here.";
});

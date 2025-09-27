(function () {
  "use strict";

  /**
   * Utility: Perform a set of regex replacements on a string
   * replacements: Array of [pattern, replacement]
   */
  function applyReplacements(inputText, replacements) {
    let result = inputText;
    for (const [pattern, replacement] of replacements) {
      result = result.replace(pattern, replacement);
    }
    return result;
  }

  function wreckCorporateRobot(text) {
    const replacements = [
      [/\blet'?s\s+talk\b/gi, "Let's circle back to touch base"],
      [/\bwhat\s+do\s+you\s+think\??/gi, "What are your key takeaways?"],
      [/\bproblem\b/gi, "opportunity"],
      [/\bmeeting\b/gi, "sync"],
      [/\bdeadline\b/gi, "deliverable timeline"],
    ];
    return applyReplacements(text, replacements);
  }

  function wreckPassiveAggressive(text) {
    const replacements = [
      [/\bi'?m\s+mad\b/gi, "Just wanted to check in on your emotional bandwidth :)"],
      [/\bno\b/gi, "No worries if not!"],
      [/\bokay\b/gi, "Sure, if that works for you, I guess"],
      [/\bthanks\b/gi, "Thanks in advance, since reminders were ignored"],
    ];
    return applyReplacements(text, replacements);
  }

  function wreckShakespearean(text) {
    const replacements = [
      [/\byou\s*up\??\b/gi, "Hark! Dost thou stir?"],
      [/\blol\b/gi, "Huzzah!"],
      [/\byou\b/gi, "thou"],
      [/\bare\b/gi, "art"],
      [/\byour\b/gi, "thy"],
    ];
    return applyReplacements(text, replacements);
  }

  function wreckTeenAngstPoet(text) {
    const replacements = [
      [/\blife\b/gi, "existence"],
      [/\bparents?\b/gi, "oppressors"],
      [/\bheart\b/gi, "aching heart"],
      [/\bhappy\b/gi, "fine, I guess"],
      [/\blove\b/gi, "love (whatever)"],
      [/\bworld\b/gi, "void"],
    ];
    return applyReplacements(text, replacements);
  }

  function wreckBelly(text) {
    const replacements = [
      [/\b(hello|hi)\b/gi, "yo"],
      [/\bmoney\b/gi, "bag"],
      [/\bwork\b/gi, "grind"],
      [/\bparty\b/gi, "link up"],
      [/\bvery\b/gi, "mad"],
      [/\bgood\b/gi, "fire"],
    ];
    return applyReplacements(text, replacements);
  }

  function wreckJeremiah(text) {
    const replacements = [
      [/\byour\b/gi, "your glorious"],
      [/\byou\b/gi, "legend"],
      [/\bgreat\b/gi, "immaculate"],
      [/\bnice\b/gi, "elite"],
      [/\bteam\b/gi, "squad"],
      [/\blet'?s\b/gi, "let's go"],
    ];
    return applyReplacements(text, replacements);
  }

  function wreckConrad(text) {
    const replacements = [
      [/\bfriends?\b/gi, "chums"],
      [/\bidea\b/gi, "notion"],
      [/\bvery\b/gi, "quite"],
      [/\bgood\b/gi, "splendid"],
      [/\bbad\b/gi, "most unfortunate"],
      [/\bI\b/g, "one"],
    ];
    return applyReplacements(text, replacements);
  }

  function getSelectedPersona() {
    const select = document.getElementById("personalitySelect");
    return select ? String(select.value) : "";
  }

  function getUserInput() {
    const el = document.getElementById("userInput");
    return el ? String(el.value) : "";
  }

  function setOutputText(text) {
    const out = document.getElementById("output");
    if (out) out.textContent = text;
  }

  function randomFrom(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function setRandomMeme() {
    const image = document.getElementById("memeImage");
    if (!image) return;
    const memes = [
      "https://i.imgur.com/4M7IWwP.jpeg",
      "https://i.imgur.com/fHyEMsl.jpeg",
      "https://i.imgur.com/6WQhJNN.jpeg",
      "https://i.imgur.com/x4vJZfM.jpeg",
      "https://i.imgur.com/0rKc5mC.jpeg",
    ];
    image.src = randomFrom(memes);
  }

  function playErrorSound() {
    const audio = document.getElementById("errorSound");
    if (audio && typeof audio.play === "function") {
      try {
        audio.currentTime = 0;
        audio.play();
      } catch (_) {
        // Ignore autoplay restrictions
      }
    }
  }

  function wreckText(persona, text) {
    switch (persona) {
      case "Corporate Robot":
        return wreckCorporateRobot(text);
      case "Passive-Aggressive Nightmare":
        return wreckPassiveAggressive(text);
      case "Shakespearean Drama King":
        return wreckShakespearean(text);
      case "Teen Angst Poet":
        return wreckTeenAngstPoet(text);
      case "Belly":
        return wreckBelly(text);
      case "Jeremiah":
        return wreckJeremiah(text);
      case "Conrad":
        return wreckConrad(text);
      default:
        return text;
    }
  }

  function onWreckClick() {
    playErrorSound();

    const confirmed = window.confirm(
      "Are you SURE you want to introduce this level of chaos into your life?"
    );
    if (!confirmed) return;

    const persona = getSelectedPersona();
    const input = getUserInput();
    const wrecked = wreckText(persona, input);

    setOutputText(wrecked);
    setRandomMeme();
  }

  async function onCopyClick() {
    const out = document.getElementById("output");
    const button = document.getElementById("copyButton");
    const text = out ? out.textContent || "" : "";

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      if (button) {
        const prev = button.textContent;
        button.textContent = "Copied!";
        setTimeout(() => {
          button.textContent = prev;
        }, 2000);
      }
    } catch (_) {
      // silent fail
    }
  }

  function init() {
    const wreckButton = document.getElementById("wreckButton");
    const copyButton = document.getElementById("copyButton");

    if (wreckButton) wreckButton.addEventListener("click", onWreckClick);
    if (copyButton) copyButton.addEventListener("click", onCopyClick);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

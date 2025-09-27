import { useMemo, useRef, useState } from 'react'
import SocialShare from './SocialShare'

function applyReplacements(inputText, replacements) {
  let result = inputText
  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement)
  }
  return result
}

function wreckCorporateRobot(text) {
  const replacements = [
    [/\blet'?s\s+talk\b/gi, "Let's circle back to touch base"],
    [/\bwhat\s+do\s+you\s+think\??/gi, "What are your key takeaways?"],
    [/\bproblem\b/gi, "opportunity"],
    [/\bmeeting\b/gi, "sync"],
    [/\bdeadline\b/gi, "deliverable timeline"],
  ]
  return applyReplacements(text, replacements)
}

function wreckPassiveAggressive(text) {
  const replacements = [
    [/\bi'?m\s+mad\b/gi, "Just wanted to check in on your emotional bandwidth :)"],
    [/\bno\b/gi, "No worries if not!"],
    [/\bokay\b/gi, "Sure, if that works for you, I guess"],
    [/\bthanks\b/gi, "Thanks in advance, since reminders were ignored"],
  ]
  return applyReplacements(text, replacements)
}

function wreckShakespearean(text) {
  const replacements = [
    [/\byou\s*up\??\b/gi, "Hark! Dost thou stir?"],
    [/\blol\b/gi, "Huzzah!"],
    [/\byou\b/gi, "thou"],
    [/\bare\b/gi, "art"],
    [/\byour\b/gi, "thy"],
  ]
  return applyReplacements(text, replacements)
}

function wreckText(persona, text) {
  switch (persona) {
    case 'Corporate Robot':
      return wreckCorporateRobot(text)
    case 'Passive-Aggressive Nightmare':
      return wreckPassiveAggressive(text)
    case 'Shakespearean Drama King':
      return wreckShakespearean(text)
    default:
      return text
  }
}

const MEMES = [
  'https://i.imgur.com/4M7IWwP.jpeg',
  'https://i.imgur.com/fHyEMsl.jpeg',
  'https://i.imgur.com/6WQhJNN.jpeg',
  'https://i.imgur.com/x4vJZfM.jpeg',
  'https://i.imgur.com/0rKc5mC.jpeg',
]

export default function App() {
  const [persona, setPersona] = useState('Corporate Robot')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meme, setMeme] = useState('')
  const [copying, setCopying] = useState(false)
  const audioRef = useRef(null)

  const outputText = useMemo(() => output, [output])

  function handleWreck() {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
      }
    } catch {}

    const confirmed = window.confirm(
      'Are you SURE you want to introduce this level of chaos into your life?'
    )
    if (!confirmed) return

    const wrecked = wreckText(persona, input)
    setOutput(wrecked)

    const next = MEMES[Math.floor(Math.random() * MEMES.length)]
    setMeme(next)
  }

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(outputText)
      }
    } catch {}
    setCopying(true)
    setTimeout(() => setCopying(false), 2000)
  }

  return (
    <div className="container">
      <h1 className="flashing-text">💥 Text Wrecker 💥</h1>
      <p className="tagline">Enter your boring text and we'll ruin it (respectfully) based on a chaotic personality.</p>

      <label htmlFor="personalitySelect" className="label">Choose a personality:</label>
      <select
        id="personalitySelect"
        value={persona}
        onChange={(e) => setPersona(e.target.value)}
      >
        <option>Corporate Robot</option>
        <option>Passive-Aggressive Nightmare</option>
        <option>Shakespearean Drama King</option>
      </select>

      <label htmlFor="userInput" className="label">Your precious text:</label>
      <textarea
        id="userInput"
        rows={8}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something worth wrecking..."
      />

      <button id="wreckButton" onClick={handleWreck}>Wreck It!</button>

      <div id="output" aria-live="polite">{outputText}</div>

      <button id="copyButton" className="secondary" onClick={handleCopy}>
        {copying ? 'Copied!' : 'Copy Wreckage'}
      </button>

      <img id="memeImage" alt="Reaction meme will appear here" src={meme} />

      <SocialShare />

      <audio id="errorSound" ref={audioRef} src="https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg" preload="auto" />
    </div>
  )
}

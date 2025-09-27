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

function wreckTeenAngstPoet(text) {
  const replacements = [
    [/\blife\b/gi, "existence"],
    [/\bparents?\b/gi, "oppressors"],
    [/\bheart\b/gi, "aching heart"],
    [/\bhappy\b/gi, "fine, I guess"],
    [/\blove\b/gi, "love (whatever)"],
    [/\bworld\b/gi, "void"],
  ]
  return applyReplacements(text, replacements)
}

function wreckBelly(text) {
  const replacements = [
    [/\b(hello|hi)\b/gi, "yo"],
    [/\bmoney\b/gi, "bag"],
    [/\bwork\b/gi, "grind"],
    [/\bparty\b/gi, "link up"],
    [/\bvery\b/gi, "mad"],
    [/\bgood\b/gi, "fire"],
  ]
  return applyReplacements(text, replacements)
}

function wreckJeremiah(text) {
  const replacements = [
    [/\byour\b/gi, "your glorious"],
    [/\byou\b/gi, "legend"],
    [/\bgreat\b/gi, "immaculate"],
    [/\bnice\b/gi, "elite"],
    [/\bteam\b/gi, "squad"],
    [/\blet'?s\b/gi, "let's go"],
  ]
  return applyReplacements(text, replacements)
}

function wreckConrad(text) {
  const replacements = [
    [/\bfriends?\b/gi, "chums"],
    [/\bidea\b/gi, "notion"],
    [/\bvery\b/gi, "quite"],
    [/\bgood\b/gi, "splendid"],
    [/\bbad\b/gi, "most unfortunate"],
    [/\bI\b/g, "one"],
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
    case 'Teen Angst Poet':
      return wreckTeenAngstPoet(text)
    case 'Belly':
      return wreckBelly(text)
    case 'Jeremiah':
      return wreckJeremiah(text)
    case 'Conrad':
      return wreckConrad(text)
    default:
      return text
  }
}

const MEMES = [
  // Prefer stable, hotlink-friendly sources
  'https://picsum.photos/seed/wrecker1/640/420',
  'https://picsum.photos/seed/wrecker2/640/420',
  'https://placekitten.com/640/420',
  'https://picsum.photos/seed/wrecker3/600/400',
  'https://placekitten.com/600/400',
]

const FALLBACK_MEME = 'https://picsum.photos/seed/wrecker-fallback/640/420'

export default function App() {
  const [persona, setPersona] = useState('Corporate Robot')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [meme, setMeme] = useState('')
  const [copying, setCopying] = useState(false)
  const [advice, setAdvice] = useState('')
  const audioRef = useRef(null)

  const outputText = useMemo(() => output, [output])

  async function handleWreck() {
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

    // Try backend AI first; fall back to local rules if unavailable
    try {
      const res = await fetch('/api/wreck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona, text: input })
      })
      if (res.ok) {
        const data = await res.json()
        if (data?.output) {
          setOutput(String(data.output))
        } else {
          setOutput(wreckText(persona, input))
        }
      } else {
        setOutput(wreckText(persona, input))
      }
    } catch {
      setOutput(wreckText(persona, input))
    }

    try {
      const res = await fetch('/api/meme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input })
      })
      if (res.ok) {
        const data = await res.json()
        if (data?.url) {
          setMeme(String(data.url))
          return
        }
      }
    } catch {}

    // Fallback to local list if API fails
    const next = MEMES[Math.floor(Math.random() * MEMES.length)] || FALLBACK_MEME
    setMeme(next)
  }

  function handleMemeError() {
    // Try another meme; if all else fails, show a neutral fallback
    const alternatives = MEMES.filter((url) => url !== meme)
    const next = alternatives[Math.floor(Math.random() * alternatives.length)] || FALLBACK_MEME
    if (next !== meme) setMeme(next)
  }

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(outputText)
      }
    } catch {}
    setCopying(true)
    setTimeout(() => setCopying(false), 2000)

    // Fetch chaotic advice to display after copy
    try {
      const res = await fetch('/api/advice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: outputText })
      })
      if (res.ok) {
        const data = await res.json()
        if (data?.advice) setAdvice(String(data.advice))
      }
    } catch {}
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
        <option>Teen Angst Poet</option>
        <option>Belly</option>
        <option>Jeremiah</option>
        <option>Conrad</option>
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

      {advice ? (
        <div id="adviceBanner" role="status" aria-live="polite">{advice}</div>
      ) : null}

      <button id="copyButton" className="secondary" onClick={handleCopy}>
        {copying ? 'Copied!' : 'Copy Wreckage'}
      </button>

      <img
        id="memeImage"
        alt="Reaction meme will appear here"
        src={meme}
        referrerPolicy="no-referrer"
        onError={handleMemeError}
      />

      <SocialShare />

      <audio id="errorSound" ref={audioRef} src="https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg" preload="auto" />
    </div>
  )
}

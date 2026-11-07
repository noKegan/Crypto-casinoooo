"use client"

import { useEffect, useMemo, useRef, useState } from "react"

const SYMBOLS = ["7", "◆", "★", "♠", "●", "✦"]
const PAYOUTS: Record<string, number> = { "7": 12, "◆": 8, "★": 6, "♠": 4, "●": 3, "✦": 2 }

function randomSymbol() { return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] }
function randomReels() { return [randomSymbol(), randomSymbol(), randomSymbol()] }

export default function Home() {
  const [reels, setReels] = useState(["◆", "★", "♠"])
  const [credits, setCredits] = useState(1000)
  const [bet, setBet] = useState(10)
  const [spinning, setSpinning] = useState(false)
  const [message, setMessage] = useState("Ready when you are")
  const [lastWin, setLastWin] = useState(0)
  const timerRef = useRef<number | null>(null)

  const potential = useMemo(() => bet * Math.max(...Object.values(PAYOUTS)), [bet])

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearInterval(timerRef.current)
  }, [])

  function spin() {
    if (spinning || credits < bet) return
    setSpinning(true)
    setLastWin(0)
    setCredits((value) => value - bet)
    setMessage("Reels in motion...")
    let ticks = 0
    timerRef.current = window.setInterval(() => {
      ticks += 1
      setReels(randomReels())
      if (ticks >= 9) {
        if (timerRef.current !== null) window.clearInterval(timerRef.current)
        timerRef.current = null
        const result = randomReels()
        setReels(result)
        const win = result.every((symbol) => symbol === result[0]) ? bet * PAYOUTS[result[0]] : 0
        setLastWin(win)
        setCredits((value) => value + win)
        setMessage(win ? `Jackpot line — +${win} credits` : "No win this time. Try another spin.")
        setSpinning(false)
      }
    }, 85)
  }

  function adjustBet(amount: number) { setBet((value) => Math.min(100, Math.max(1, value + amount))) }

  return <main className="shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">NR</span><span>NEON REEL</span></div><span className="mode-pill">PROTOTYPE MODE</span><div className="wallet"><span className="wallet-label">VIRTUAL CREDITS</span><strong>{credits.toLocaleString()}</strong></div></header>
    <section className="hero"><p className="eyebrow">MIDNIGHT JACKPOT</p><h1>Spin into the <em>neon.</em></h1><p className="subhead">A playable slot-machine prototype with virtual credits only.</p></section>
    <section className="game-card" aria-label="Neon Reel slot machine">
      <div className="card-head"><div><span className="eyebrow">FEATURE GAME</span><h2>Neon 7s</h2></div><div className="status"><span className={spinning ? "dot live" : "dot"}></span>{spinning ? "SPINNING" : "READY"}</div></div>
      <div className="machine">
        <div className="reels">{reels.map((symbol, index) => <div className={`reel ${symbol === "7" ? "seven" : ""}`} key={index}><span>{symbol}</span></div>)}</div>
        <div className="win-line"><span>PAYLINE</span><i></i><span>PAYLINE</span></div>
      </div>
      <div className="message" aria-live="polite">{message}</div>
      <div className="controls"><div className="bet-control"><span className="control-label">BET PER SPIN</span><div className="bet-row"><button onClick={() => adjustBet(-1)} aria-label="Decrease bet">−</button><strong>{bet}</strong><button onClick={() => adjustBet(1)} aria-label="Increase bet">+</button></div></div><button className="spin-button" onClick={spin} disabled={spinning || credits < bet}>{spinning ? "SPINNING" : "SPIN"}<small>{spinning ? "Please wait" : `${bet} credits`}</small></button><div className="payout"><span className="control-label">POTENTIAL WIN</span><strong>{potential} <small>CR</small></strong></div></div>
      <div className="payouts"><span className="control-label">PAYOUTS</span>{SYMBOLS.slice(0, 4).map((symbol) => <span key={symbol}><b className={symbol === "7" ? "gold" : ""}>{symbol}</b> ×{PAYOUTS[symbol]}</span>)}</div>
    </section>
    <section className="footer-note"><div><strong>Virtual credits only</strong><p>This prototype does not accept deposits, process crypto, or support real-money wagering.</p></div><button onClick={() => { setCredits(1000); setMessage("Credits reset"); setLastWin(0) }}>Reset credits</button></section>
    <footer>NEON REEL <span>•</span> A PLAYABLE CONCEPT</footer>
  </main>
}

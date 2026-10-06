'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Camera, Video, Square, RotateCcw, Check, AlertTriangle,
  Loader2, X, Play, Eye,
} from 'lucide-react'

type Phase = 'requesting' | 'ready' | 'countdown' | 'recording' | 'preview' | 'uploading' | 'done' | 'error'

type Props = {
  questionText: string
  questionNumber: number
  totalQuestions: number
  timeLimit: number // seconds
  onComplete: (data: { path: string; duration: number; tabSwitches: number }) => void
  onGetUploadUrl: (fileExt: string) => Promise<{ uploadUrl: string; path: string }>
}

const MAX_STRIKES = 3

function pickMime(): { mime: string; ext: string } {
  const candidates = [
    { mime: 'video/webm;codecs=vp9,opus', ext: 'webm' },
    { mime: 'video/webm;codecs=vp8,opus', ext: 'webm' },
    { mime: 'video/webm', ext: 'webm' },
    { mime: 'video/mp4', ext: 'mp4' },
  ]
  if (typeof MediaRecorder === 'undefined') return { mime: '', ext: 'webm' }
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c.mime)) return c
  }
  return { mime: '', ext: 'webm' }
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function VideoRecorder({
  questionText,
  questionNumber,
  totalQuestions,
  timeLimit,
  onComplete,
  onGetUploadUrl,
}: Props) {
  const videoPreviewRef = useRef<HTMLVideoElement>(null)
  const videoPlaybackRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)
  const strikesRef = useRef<number>(0)

  const [phase, setPhase] = useState<Phase>('requesting')
  const [error, setError] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [blobUrl, setBlobUrl] = useState<string>('')
  const [blob, setBlob] = useState<Blob | null>(null)
  const [mime, setMime] = useState('')
  const [ext, setExt] = useState('webm')
  const [strikes, setStrikes] = useState(0)
  const [showStrikeWarning, setShowStrikeWarning] = useState(false)
  const [uploadPercent, setUploadPercent] = useState(0)

  // Request camera on mount
  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        })
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop())
          return
        }
        streamRef.current = stream
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream
        }
        const picked = pickMime()
        setMime(picked.mime)
        setExt(picked.ext)
        setPhase('ready')
      } catch (e: any) {
        setError(e?.message || 'Camera access denied')
        setPhase('error')
      }
    }
    init()
    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach(t => t.stop())
      if (timerRef.current) clearInterval(timerRef.current)
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Tab switch detection
  useEffect(() => {
    function registerStrike(reason: string) {
      // ignore if not actively recording
      if (phase !== 'recording') return
      strikesRef.current += 1
      setStrikes(strikesRef.current)
      setShowStrikeWarning(true)
      if (strikesRef.current >= MAX_STRIKES) {
        stopRecording(true)
      }
    }

    function onVisibility() {
      if (document.hidden) registerStrike('tab_hidden')
    }
    function onBlur() {
      registerStrike('window_blur')
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onBlur)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onBlur)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  function startCountdown() {
    setPhase('countdown')
    setCountdown(3)
    let c = 3
    const id = setInterval(() => {
      c -= 1
      setCountdown(c)
      if (c <= 0) {
        clearInterval(id)
        startRecording()
      }
    }, 1000)
  }

  function startRecording() {
    const stream = streamRef.current
    if (!stream) return
    chunksRef.current = []
    const opts: MediaRecorderOptions = {
  videoBitsPerSecond: 1_500_000,  // 1.5 Mbps — prevents 30MB files
  audioBitsPerSecond: 96_000,
}
if (mime) opts.mimeType = mime
const recorder = new MediaRecorder(stream, opts)
    recorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mime || 'video/webm' })
      const url = URL.createObjectURL(blob)
      setBlob(blob)
      setBlobUrl(url)
      setPhase('preview')
    }
    recorderRef.current = recorder
    recorder.start(1000)
    startTimeRef.current = Date.now()
    setSeconds(0)
    setPhase('recording')
    timerRef.current = setInterval(() => {
      setSeconds(prev => {
        const next = prev + 1
        if (next >= timeLimit) {
          stopRecording()
        }
        return next
      })
    }, 1000)
  }

  function stopRecording(force = false) {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    const r = recorderRef.current
    if (r && r.state !== 'inactive') {
      r.stop()
    }
    if (force) {
      setError('Recording stopped: too many tab switches. You can retake.')
    }
  }

  function retake() {
  if (blobUrl) URL.revokeObjectURL(blobUrl)
  setBlob(null)
  setBlobUrl('')
  setSeconds(0)
  setError('')
  strikesRef.current = 0
  setStrikes(0)
  setShowStrikeWarning(false)
  setPhase('ready')
}

  async function submit() {
    if (!blob) return
    setPhase('uploading')
    setUploadPercent(0)
    setError('')
    try {
      const { uploadUrl, path } = await onGetUploadUrl(ext)

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', uploadUrl, true)
        xhr.setRequestHeader('Content-Type', mime || 'video/webm')
        xhr.setRequestHeader('x-upsert', 'true')
        xhr.upload.onprogress = e => {
          if (e.lengthComputable) {
            setUploadPercent(Math.round((e.loaded / e.total) * 100))
          }
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else reject(new Error(`Upload failed (${xhr.status})`))
        }
        xhr.onerror = () => reject(new Error('Network error during upload'))
        xhr.send(blob)
      })

      const duration = Math.round((Date.now() - startTimeRef.current) / 1000)
      // prefer seconds counter which is more accurate
      const finalDuration = seconds
      setPhase('done')
      onComplete({
        path,
        duration: finalDuration || duration,
        tabSwitches: strikesRef.current,
      })
    } catch (e: any) {
      setError(e?.message || 'Upload failed')
      setPhase('preview')
    }
  }

  // ======================= RENDER =======================

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="text-slate-500">
          Time limit {fmt(timeLimit)}
        </span>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-4">
        <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Question</p>
        <p className="text-base text-[#0f172a] leading-relaxed whitespace-pre-wrap">
          {questionText}
        </p>
      </div>

      {/* Strikes */}
      {strikes > 0 && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-xs text-amber-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {strikes} of {MAX_STRIKES} warnings — do not switch tabs or leave the window.
        </div>
      )}

      {/* Camera area */}
      <div className="bg-black rounded-2xl overflow-hidden aspect-video relative mb-4">
        {/* Live preview */}
        {(phase === 'requesting' || phase === 'ready' || phase === 'countdown' || phase === 'recording' || phase === 'uploading' || phase === 'error') && (
          <video
            ref={videoPreviewRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
        )}

        {/* Playback */}
        {(phase === 'preview' || phase === 'done') && blobUrl && (
          <video
            ref={videoPlaybackRef}
            src={blobUrl}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Countdown overlay */}
        {phase === 'countdown' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-8xl font-bold tabular-nums">{countdown}</span>
          </div>
        )}

        {/* Recording indicator */}
        {phase === 'recording' && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            REC {fmt(seconds)}
          </div>
        )}

        {/* Requesting overlay */}
        {phase === 'requesting' && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}

        {/* Error overlay */}
        {phase === 'error' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white gap-2 p-6 text-center">
            <X className="w-8 h-8 text-red-400" />
            <p className="text-sm">{error || 'Camera unavailable'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-xs bg-white text-black px-4 py-2 rounded-full font-semibold"
            >
              Reload page
            </button>
          </div>
        )}

        {/* Upload overlay */}
        {phase === 'uploading' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white gap-3 p-6">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm font-medium">Uploading… {uploadPercent}%</p>
            <div className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#facc15] transition-all"
                style={{ width: `${uploadPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Progress bar during recording */}
      {phase === 'recording' && (
        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-red-500 transition-all"
            style={{ width: `${Math.min(100, (seconds / timeLimit) * 100)}%` }}
          />
        </div>
      )}

      {/* Error text */}
      {error && phase !== 'error' && (
        <div className="mb-4 text-sm text-red-600">{error}</div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {phase === 'ready' && (
          <button
            onClick={startCountdown}
            className="flex-1 bg-[#0f172a] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-slate-800 transition inline-flex items-center justify-center gap-2"
          >
            <Video className="w-4 h-4" /> Start Recording
          </button>
        )}

        {phase === 'recording' && (
          <button
            onClick={() => stopRecording()}
            className="flex-1 bg-red-600 text-white py-3.5 rounded-full font-semibold text-sm hover:bg-red-700 transition inline-flex items-center justify-center gap-2"
          >
            <Square className="w-4 h-4" /> Stop
          </button>
        )}

        {phase === 'preview' && (
          <>
            <button
              onClick={retake}
              className="flex-1 sm:flex-none sm:px-6 border border-slate-300 text-slate-700 py-3.5 rounded-full font-semibold text-sm hover:bg-slate-50 transition inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Retake
            </button>
            <button
              onClick={submit}
              className="flex-1 bg-[#0f172a] text-white py-3.5 rounded-full font-semibold text-sm hover:bg-slate-800 transition inline-flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Submit & Continue
            </button>
          </>
        )}

        {phase === 'done' && (
          <div className="flex-1 text-center text-sm text-emerald-600 font-semibold py-3">
            ✓ Submitted
          </div>
        )}
      </div>

      {/* Strike warning modal */}
      {showStrikeWarning && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#0f172a] mb-2">
              Warning {strikes} of {MAX_STRIKES}
            </h3>
            <p className="text-sm text-slate-600 mb-5">
              You switched tabs or left the window. Please stay on this page while
              recording. Three warnings will end the attempt.
            </p>
            <button
              onClick={() => setShowStrikeWarning(false)}
              className="w-full bg-[#0f172a] text-white py-3 rounded-full font-semibold text-sm hover:bg-slate-800"
            >
              I understand
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
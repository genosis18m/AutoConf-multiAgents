import styled, { keyframes } from 'styled-components'

const fall = keyframes`
  0% { transform: translateY(-10%); opacity: 1; }
  100% { transform: translateY(200%); opacity: 0; }
`

const StyledWrapper = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;

  .matrix-container {
    position: relative;
    width: 100%;
    height: 100%;
    background: #000;
    display: flex;
  }

  .matrix-pattern {
    position: relative;
    width: 1000px;
    height: 100%;
    flex-shrink: 0;
  }

  .matrix-column {
    position: absolute;
    top: -100%;
    width: 20px;
    height: 100%;
    font-size: 16px;
    line-height: 18px;
    font-weight: bold;
    animation: ${fall} linear infinite;
    white-space: nowrap;
  }

  .matrix-column::before {
    content: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    position: absolute;
    top: 0; left: 0;
    background: linear-gradient(
      to bottom,
      #ffffff 0%, #ffffff 5%,
      #00ff41 10%, #00ff41 20%,
      #00dd33 30%, #00bb22 40%,
      #009911 50%, #007700 60%,
      #005500 70%, #003300 80%,
      rgba(0,255,65,0.5) 90%, transparent 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    writing-mode: vertical-lr;
    letter-spacing: 1px;
  }

  .matrix-column:nth-child(odd)::before { content: "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン123456789"; }
  .matrix-column:nth-child(even)::before { content: "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴABCDEFGHIJKLMNOPQRSTUVWXYZ"; }
  .matrix-column:nth-child(3n)::before { content: "アカサタナハマヤラワイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロヲン0987654321"; }
  .matrix-column:nth-child(4n)::before { content: "ンヲロヨモホノトソコオレメヘネテセケエルユムフヌツスクウリミヒニチシキイワラヤマハナタサカア"; }
  .matrix-column:nth-child(5n)::before { content: "ガザダバパギジヂビピグズヅブプゲゼデベペゴゾドボポヴ!@#$%^&*()_+-=[]{}|;:,.<>?"; }

  ${ Array.from({ length: 40 }, (_, i) => `
    .matrix-column:nth-child(${i + 1}) {
      left: ${i * 25}px;
      animation-delay: -${(2 + (i * 0.1) % 2.5).toFixed(1)}s;
      animation-duration: ${(2.3 + (i * 0.07) % 2.2).toFixed(1)}s;
    }
  `).join('') }
`

const COLUMNS = Array.from({ length: 40 }, (_, i) => i)
const PATTERNS = Array.from({ length: 5 })

export function MatrixLoader({ label = 'Launching agents' }: { label?: string }) {
  return (
    <div className="w-full relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-green-500/30" style={{ height: '60vh', minHeight: '500px', background: '#000', boxShadow: '0 0 30px rgba(0,255,65,0.2)' }}>
      <StyledWrapper>
        <div className="matrix-container">
          {PATTERNS.map((_, pi) => (
            <div className="matrix-pattern" key={pi}>
              {COLUMNS.map((_, ci) => (
                <div className="matrix-column" key={ci} />
              ))}
            </div>
          ))}
        </div>
      </StyledWrapper>
      {/* Overlay text */}
      <div className="relative z-10 text-center pointer-events-none">
        <p className="text-3xl font-bold tracking-widest mt-6" style={{ color: '#00ff41', fontFamily: 'monospace', textShadow: '0 0 20px #00ff41' }}>
          {label}
        </p>
        <p className="text-xl mt-4 tracking-widest" style={{ color: 'rgba(0,255,65,0.8)', fontFamily: 'monospace' }}>
          Initializing 7 Agents...
        </p>
      </div>
    </div>
  )
}

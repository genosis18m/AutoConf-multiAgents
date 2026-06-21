import React from 'react';
import styled from 'styled-components';

type Phase = 'queued' | 'running' | 'completed' | 'failed' | string;

const STATE: Record<string, { tone: string; label: string }> = {
  queued:    { tone: 'var(--faint)', label: 'On call' },
  running:   { tone: 'var(--ember)', label: 'On air' },
  completed: { tone: 'var(--mint)',  label: 'Wrapped' },
  failed:    { tone: 'var(--accent-red)', label: 'Held' },
};

/**
 * AgentCard — a live departure-board / call-sheet row for one agent.
 * Department number, agent name, status flap, and the latest line it logged.
 * Keeps the CyberCard API (agentId, name, status, logs).
 */
export const CyberCard = ({ agentId, name, status, logs }: { agentId: string; name: string; status: Phase; logs: string[] }) => {
  const s = STATE[status] ?? STATE.queued;
  const running = status === 'running';
  const done = status === 'completed';
  const line = logs?.filter(Boolean).slice(-1)[0] || (done ? 'Plan section ready.' : running ? 'Working…' : 'Awaiting cue.');
  const fillWidth = done ? '100%' : running ? '62%' : '0%';

  return (
    <StyledWrapper style={{ ['--tone' as string]: s.tone }}>
      <div className={`tile ${running ? 'is-live' : ''}`}>
        <div className="row top">
          <span className="dept">{agentId.padStart(2, '0')}</span>
          <span className="flap">
            <span className="dot" />
            {s.label}
          </span>
        </div>
        <p className="name">{name}</p>
        <div className="track" aria-hidden="true"><span className="fill" style={{ width: fillWidth }} /></div>
        <p className="line">
          {line}
          {running && <span className="caret">▍</span>}
        </p>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  height: 100%;

  .tile {
    position: relative;
    height: 100%;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px 18px 18px;
    border-radius: 14px;
    background:
      radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, var(--tone) 9%, transparent), transparent 60%),
      var(--ink-raise);
    border: 1px solid var(--line);
    overflow: hidden;
    transform-origin: top center;
    animation: board-flap 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
    transition: border-color 250ms, box-shadow 250ms, transform 250ms;
  }

  .tile:hover {
    border-color: color-mix(in srgb, var(--tone) 45%, var(--line));
    box-shadow: 0 12px 30px rgba(8, 5, 14, 0.4);
    transform: translateY(-2px);
  }

  .tile.is-live {
    border-color: color-mix(in srgb, var(--tone) 55%, var(--line));
    box-shadow: 0 0 0 1px color-mix(in srgb, var(--tone) 35%, transparent),
                0 10px 30px color-mix(in srgb, var(--tone) 16%, transparent);
  }

  .tile.is-live::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(115deg, transparent 40%, color-mix(in srgb, var(--tone) 14%, transparent) 50%, transparent 60%);
    background-size: 220% 100%;
    animation: gradient-shift 2.6s ease infinite;
    pointer-events: none;
  }

  .row { display: flex; align-items: center; justify-content: space-between; }

  .dept {
    font-family: var(--font-mono);
    font-size: 1.05rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--tone);
  }

  .flap {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--tone);
    padding: 3px 9px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--tone) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--tone) 30%, transparent);
  }

  .dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--tone);
    box-shadow: 0 0 8px var(--tone);
  }
  .is-live .dot { animation: pulse-glow 1.6s ease-in-out infinite; }

  .name {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1.18rem;
    line-height: 1.12;
    letter-spacing: -0.02em;
    color: var(--chalk);
  }

  .track {
    height: 3px;
    border-radius: 999px;
    background: var(--line-soft);
    overflow: hidden;
    margin-top: auto;
  }
  .fill {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: var(--tone);
    transition: width 0.6s cubic-bezier(0.16,1,0.3,1);
  }

  .line {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    line-height: 1.5;
    color: var(--haze);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 2.04em;
  }

  .caret { color: var(--tone); margin-left: 1px; animation: count-up 0.8s steps(2) infinite alternate; }
`;

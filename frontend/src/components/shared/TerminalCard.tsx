import React from 'react';
import styled from 'styled-components';

export interface TerminalCardProps {
  title?: string;
  command?: string;
  children?: React.ReactNode;
  minWidth?: string | number;
  className?: string;
  onClick?: () => void;
}

/**
 * PlanCard — a "call sheet" entry. A titled card with a mono filing slug,
 * an ember index tick, and a clean ink body. Keeps the TerminalCard API so
 * every result panel re-skins for free.
 */
export const TerminalCard = ({ title = 'Entry', command, children, minWidth = '344px', className, onClick }: TerminalCardProps) => {
  return (
    <StyledWrapper style={{ minWidth, cursor: onClick ? 'pointer' : 'default' }} className={className} onClick={onClick}>
      <div className="plan-card">
        <header className="head">
          <span className="tick" aria-hidden="true" />
          <p className="title">{title}</p>
          {command && <code className="slug">{command}</code>}
        </header>
        <div className="body">
          {children}
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  flex: 1;

  .plan-card {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background:
      linear-gradient(180deg, rgba(255,255,255,0.015), transparent 40%),
      var(--ink-raise);
    border: 1px solid var(--line);
    border-radius: 14px;
    overflow: hidden;
    transition: border-color 250ms cubic-bezier(0.16,1,0.3,1),
                box-shadow 250ms cubic-bezier(0.16,1,0.3,1),
                transform 250ms cubic-bezier(0.16,1,0.3,1);
  }

  .plan-card:hover {
    border-color: #4a4060;
    box-shadow: 0 14px 36px rgba(8, 5, 14, 0.45);
    transform: translateY(-2px);
  }

  /* ember accent rail down the left edge */
  .plan-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, var(--ember), rgba(255,106,61,0));
    opacity: 0.85;
  }

  .head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 16px 11px 18px;
    border-bottom: 1px solid var(--line-soft);
    background: rgba(255, 255, 255, 0.018);
  }

  .tick {
    width: 7px;
    height: 7px;
    border-radius: 2px;
    background: var(--ember);
    box-shadow: 0 0 10px rgba(255, 106, 61, 0.55);
    flex-shrink: 0;
  }

  .title {
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.92rem;
    letter-spacing: -0.01em;
    color: var(--chalk);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .slug {
    margin-left: auto;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    letter-spacing: 0.08em;
    text-transform: lowercase;
    color: var(--faint);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 45%;
    flex-shrink: 1;
  }

  .body {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 16px;
    color: var(--chalk);
  }
`;

import React from 'react';
import styled from 'styled-components';

export const CyberCard = ({ agentId, name, status, logs }: { agentId: string, name: string, status: string, logs: string[] }) => {
  return (
    <StyledWrapper>
      <div className="container noselect">
        <div className="canvas">
          <div className="tracker tr-1" />
          <div className="tracker tr-2" />
          <div className="tracker tr-3" />
          <div className="tracker tr-4" />
          <div className="tracker tr-5" />
          <div className="tracker tr-6" />
          <div className="tracker tr-7" />
          <div className="tracker tr-8" />
          <div className="tracker tr-9" />
          <div className="tracker tr-10" />
          <div className="tracker tr-11" />
          <div className="tracker tr-12" />
          <div className="tracker tr-13" />
          <div className="tracker tr-14" />
          <div className="tracker tr-15" />
          <div className="tracker tr-16" />
          <div className="tracker tr-17" />
          <div className="tracker tr-18" />
          <div className="tracker tr-19" />
          <div className="tracker tr-20" />
          <div className="tracker tr-21" />
          <div className="tracker tr-22" />
          <div className="tracker tr-23" />
          <div className="tracker tr-24" />
          <div className="tracker tr-25" />
          <div id="card">
            <div className="card-content">
              <div className="card-glare" />
              <div className="cyber-lines">
                <span /><span /><span /><span />
              </div>
              <p id="prompt">{name}</p>
              <div className="title">AGENT<br />{agentId}</div>
              <div className="glowing-elements">
                <div className="glow-1" />
                <div className="glow-2" />
                <div className="glow-3" />
              </div>
              <div className="subtitle">
                <span>STATUS:</span>
                <span className="highlight">{status.toUpperCase()}</span>
              </div>
              <div className="card-particles">
                <span /><span /><span /> <span /><span /><span />
              </div>
              <div className="corner-elements">
                <span /><span /><span /><span />
              </div>
              <div className="scan-line" />
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 130px;
    transition: 200ms;
  }

  .container:active {
    transform: scale(0.98);
  }

  #card {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    transition: 700ms;
    background: linear-gradient(45deg, #1a1a1a, #262626);
    border: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
    box-shadow:
      0 0 20px rgba(0, 0, 0, 0.3),
      inset 0 0 20px rgba(0, 0, 0, 0.2);
  }

  .card-content {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #prompt {
    z-index: 20;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    transition: 300ms ease-in-out;
    position: absolute;
    text-align: center;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  }

  .title {
    opacity: 0;
    transition: 300ms ease-in-out;
    position: absolute;
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 2px;
    text-align: center;
    width: 100%;
    background: linear-gradient(45deg, #00ffaa, #00a2ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 10px rgba(0, 255, 170, 0.2));
  }

  .subtitle {
    position: absolute;
    bottom: 15px;
    width: 100%;
    text-align: center;
    font-size: 10px;
    letter-spacing: 1px;
    color: rgba(255, 255, 255, 0.6);
  }

  .highlight {
    color: #00ffaa;
    margin-left: 5px;
    background: linear-gradient(90deg, #5c67ff, #ad51ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
  }

  .glowing-elements {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .glow-1,
  .glow-2,
  .glow-3 {
    position: absolute;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(
      circle at center,
      rgba(0, 255, 170, 0.2) 0%,
      rgba(0, 255, 170, 0) 70%
    );
    filter: blur(10px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .glow-1 { top: -20px; left: -20px; }
  .glow-2 { top: 50%; right: -20px; transform: translateY(-50%); }
  .glow-3 { bottom: -20px; left: 30%; }

  .card-particles span {
    position: absolute;
    width: 2px;
    height: 2px;
    background: #00ffaa;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .tracker:hover ~ #card .title { opacity: 1; transform: translateY(-10px); }
  .tracker:hover ~ #card .glowing-elements div { opacity: 1; }
  .tracker:hover ~ #card .card-particles span { animation: particleFloat 2s infinite; }

  @keyframes particleFloat {
    0% { transform: translate(0, 0); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: translate(calc(var(--x, 0) * 20px), calc(var(--y, 0) * 20px)); opacity: 0; }
  }

  .card-particles span:nth-child(1) { --x: 1; --y: -1; top: 40%; left: 20%; }
  .card-particles span:nth-child(2) { --x: -1; --y: -1; top: 60%; right: 20%; }
  .card-particles span:nth-child(3) { --x: 0.5; --y: 1; top: 20%; left: 40%; }
  .card-particles span:nth-child(4) { --x: -0.5; --y: 1; top: 80%; right: 40%; }
  .card-particles span:nth-child(5) { --x: 1; --y: 0.5; top: 30%; left: 60%; }
  .card-particles span:nth-child(6) { --x: -1; --y: 0.5; top: 70%; right: 60%; }

  #card::before {
    content: "";
    background: radial-gradient(circle at center, rgba(0, 255, 170, 0.05) 0%, transparent 100%);
    filter: blur(15px);
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
  }

  .tracker:hover ~ #card::before { opacity: 1; }

  .tracker { position: absolute; z-index: 200; width: 100%; height: 100%; }
  .tracker:hover { cursor: pointer; }
  .tracker:hover ~ #card #prompt { opacity: 0; }
  .tracker:hover ~ #card { transition: 300ms; filter: brightness(1.2); border-color: rgba(0, 255, 170, 0.4); }

  .canvas {
    perspective: 800px;
    inset: 0;
    z-index: 200;
    position: absolute;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    grid-template-areas:
      "tr-1 tr-2 tr-3 tr-4 tr-5"
      "tr-6 tr-7 tr-8 tr-9 tr-10"
      "tr-11 tr-12 tr-13 tr-14 tr-15"
      "tr-16 tr-17 tr-18 tr-19 tr-20"
      "tr-21 tr-22 tr-23 tr-24 tr-25";
  }

  .tr-1 { grid-area: tr-1; } .tr-2 { grid-area: tr-2; } .tr-3 { grid-area: tr-3; } .tr-4 { grid-area: tr-4; } .tr-5 { grid-area: tr-5; }
  .tr-6 { grid-area: tr-6; } .tr-7 { grid-area: tr-7; } .tr-8 { grid-area: tr-8; } .tr-9 { grid-area: tr-9; } .tr-10 { grid-area: tr-10; }
  .tr-11 { grid-area: tr-11; } .tr-12 { grid-area: tr-12; } .tr-13 { grid-area: tr-13; } .tr-14 { grid-area: tr-14; } .tr-15 { grid-area: tr-15; }
  .tr-16 { grid-area: tr-16; } .tr-17 { grid-area: tr-17; } .tr-18 { grid-area: tr-18; } .tr-19 { grid-area: tr-19; } .tr-20 { grid-area: tr-20; }
  .tr-21 { grid-area: tr-21; } .tr-22 { grid-area: tr-22; } .tr-23 { grid-area: tr-23; } .tr-24 { grid-area: tr-24; } .tr-25 { grid-area: tr-25; }

  .tr-1:hover ~ #card { transform: rotateX(10deg) rotateY(-5deg); }
  .tr-2:hover ~ #card { transform: rotateX(10deg) rotateY(-2deg); }
  .tr-3:hover ~ #card { transform: rotateX(10deg) rotateY(0deg); }
  .tr-4:hover ~ #card { transform: rotateX(10deg) rotateY(2deg); }
  .tr-5:hover ~ #card { transform: rotateX(10deg) rotateY(5deg); }
  .tr-11:hover ~ #card { transform: rotateX(0deg) rotateY(-5deg); }
  .tr-15:hover ~ #card { transform: rotateX(0deg) rotateY(5deg); }
  .tr-21:hover ~ #card { transform: rotateX(-10deg) rotateY(-5deg); }
  .tr-23:hover ~ #card { transform: rotateX(-10deg) rotateY(0deg); }
  .tr-25:hover ~ #card { transform: rotateX(-10deg) rotateY(5deg); }

  .noselect { user-select: none; }

  .card-glare {
    position: absolute;
    inset: 0;
    background: linear-gradient(125deg, transparent 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 100%);
    opacity: 0;
    transition: opacity 300ms;
  }
  #card:hover .card-glare { opacity: 1; }

  .cyber-lines span { position: absolute; background: linear-gradient(90deg, transparent, rgba(92, 103, 255, 0.2), transparent); }
  .cyber-lines span:nth-child(1) { top: 20%; left: 0; width: 100%; height: 1px; transform: scaleX(0); transform-origin: left; animation: lineGrow 3s linear infinite; }
  .cyber-lines span:nth-child(2) { top: 40%; right: 0; width: 100%; height: 1px; transform: scaleX(0); transform-origin: right; animation: lineGrow 3s linear infinite 1s; }

  .corner-elements span { position: absolute; width: 10px; height: 10px; border: 2px solid rgba(92, 103, 255, 0.3); transition: all 0.3s ease; }
  .corner-elements span:nth-child(1) { top: 8px; left: 8px; border-right: 0; border-bottom: 0; }
  .corner-elements span:nth-child(2) { top: 8px; right: 8px; border-left: 0; border-bottom: 0; }
  .corner-elements span:nth-child(3) { bottom: 8px; left: 8px; border-right: 0; border-top: 0; }
  .corner-elements span:nth-child(4) { bottom: 8px; right: 8px; border-left: 0; border-top: 0; }
  #card:hover .corner-elements span { border-color: #00ffaa; box-shadow: 0 0 5px rgba(0,255,170,0.5); }

  .scan-line {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent, rgba(0, 255, 170, 0.05), transparent);
    transform: translateY(-100%);
    animation: scanMove 3s linear infinite;
  }

  @keyframes lineGrow { 0% { transform: scaleX(0); opacity: 0; } 50% { transform: scaleX(1); opacity: 1; } 100% { transform: scaleX(0); opacity: 0; } }
  @keyframes scanMove { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
`;

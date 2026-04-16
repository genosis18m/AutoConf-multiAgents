import styled from 'styled-components'

const StyledWrapper = styled.div`
  .nuclear-button {
    cursor: pointer;
    padding: 14px 28px;
    border-radius: 30px;
    border: 5px solid #e50000;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    overflow: hidden;
    background: red;
    width: 100%;
    justify-content: center;
    box-shadow:
      inset 6px 6px 10px rgba(255,255,255,0.6),
      inset -6px -6px 10px rgba(0,0,0,0.3),
      2px 2px 10px rgba(0,0,0,0.3),
      -2px -2px 10px rgba(255,255,255,0.5);
    transition: box-shadow 0.3s ease, transform 0.1s ease;
  }

  .nuclear-button:active {
    box-shadow:
      inset 2px 2px 1px rgba(0,0,0,0.3),
      inset -2px -2px 1px rgba(255,255,255,0.5);
    transform: scale(0.98);
  }

  .nuke-icon {
    font-size: 22px;
    line-height: 1;
    display: inline-block;
    filter: drop-shadow(0 0 4px rgba(255,255,255,0.6));
  }

  .letter {
    font-weight: 900;
    font-size: 20px;
    color: #db0000;
    text-shadow:
      1px 1px 1px rgba(255,255,255,0.4),
      -1px -1px 1px rgba(0,0,0,0.4);
    position: relative;
    display: inline-block;
    transition: transform 0.3s ease-out;
    z-index: 1;
    padding: 0px 3px;
  }

  .letter:hover { transform: translateY(-7px); }

  .nuclear-button:hover .letter { color: #d30000; }
  .nuclear-button:active .letter {
    color: #f30000;
    text-shadow:
      1px 1px 1px rgba(255,255,255,0.5),
      -1px -1px 2px rgba(0,0,0,0.5);
  }
`

const TEXT = ['D','O',' ','N','O','T',' ','P','R','E','S','S']

interface NuclearButtonProps {
  onClick?: () => void
  type?: 'submit' | 'button'
  disabled?: boolean
}

export function NuclearButton({ onClick, type = 'submit', disabled }: NuclearButtonProps) {
  return (
    <StyledWrapper>
      <button className="nuclear-button" type={type} onClick={onClick} disabled={disabled}>
        <span className="nuke-icon">☢️</span>
        {TEXT.map((ch, i) =>
          ch === ' ' ? (
            <span key={i} style={{ width: 4, display: 'inline-block' }} />
          ) : (
            <span className="letter" key={i}>{ch}</span>
          )
        )}
        <span className="nuke-icon">☢️</span>
      </button>
    </StyledWrapper>
  )
}

import styled, { keyframes } from 'styled-components'

const upDown = keyframes`
  from { transform: rotate(-15deg); }
  to   { transform: rotate(15deg); }
`
const ballMove = keyframes`
  from { left: calc(100% - 40px); transform: rotate(360deg); }
  to   { left: calc(0% - 20px);  transform: rotate(0deg); }
`

const StyledWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .ball {
    position: relative;
    bottom: 50px;
    left: calc(100% - 20px);
    width: 50px;
    height: 50px;
    background: #fff;
    border-radius: 50%;
    animation: ${ballMove} 3s ease-in-out 1s infinite alternate;
  }

  .ball::after {
    position: absolute;
    content: '';
    top: 25px;
    right: 5px;
    width: 5px;
    height: 5px;
    background: #000;
    border-radius: 50%;
  }

  .bar {
    width: 200px;
    height: 12.5px;
    background: #FFDAAF;
    border-radius: 30px;
    transform: rotate(-15deg);
    animation: ${upDown} 3s ease-in-out 1s infinite alternate;
  }
`

export function BallLoader() {
  return (
    <StyledWrapper>
      <div className="bar">
        <div className="ball" />
      </div>
    </StyledWrapper>
  )
}

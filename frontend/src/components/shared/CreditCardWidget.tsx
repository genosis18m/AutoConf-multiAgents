import styled from 'styled-components'
import React from 'react'

const StyledWrapper = styled.div`
  .main-container {
    font-family: "Inter", sans-serif;
    position: relative;
    width: 320px;
    height: 203px;
    font-size: 16px;
    border-radius: 1em;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
    cursor: default;
  }
  .main-container:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 1em 2em rgba(0,0,0,0.3);
  }

  .border {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1em;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      115deg,
      rgba(0, 0, 0, 0.33) 12%,
      rgba(255, 255, 255, 0.33) 27%,
      rgba(255, 255, 255, 0.33) 31%,
      rgba(0, 0, 0, 0.33) 52%
    );
    position: relative;
  }

  .border:hover:after {
    position: absolute;
    content: " ";
    height: 50em;
    aspect-ratio: 1.58;
    border-radius: 1em;
    background: linear-gradient(
      115deg,
      rgba(0, 0, 0, 1) 42%,
      rgba(255, 255, 255, 1) 47%,
      rgba(255, 255, 255, 1) 51%,
      rgba(0, 0, 0, 1) 52%
    );
    animation: rotate 4s linear infinite;
    z-index: 1;
    opacity: 0.05;
  }

  .card {
    height: calc(100% - 2px);
    width: calc(100% - 2px);
    border-radius: 1em;
    background-color: #999;
    opacity: 0.8;
    background-image: linear-gradient(to right, #2d333b, #2d333b 2px, #444c56 2px, #444c56);
    background-size: 4px 100%;
  }

  .shadow {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 0.85em;
    border: 1px solid #444c56;
    background:
      radial-gradient(circle at 100% 100%, #ffffff 0, #ffffff 8px, transparent 8px) 0% 0%/13px 13px no-repeat,
      radial-gradient(circle at 0 100%, #ffffff 0, #ffffff 8px, transparent 8px) 100% 0%/13px 13px no-repeat,
      radial-gradient(circle at 100% 0, #ffffff 0, #ffffff 8px, transparent 8px) 0% 100%/13px 13px no-repeat,
      radial-gradient(circle at 0 0, #ffffff 0, #ffffff 8px, transparent 8px) 100% 100%/13px 13px no-repeat,
      linear-gradient(#ffffff, #ffffff) 50% 50% / calc(100% - 10px) calc(100% - 26px) no-repeat,
      linear-gradient(#ffffff, #ffffff) 50% 50% / calc(100% - 26px) calc(100% - 10px) no-repeat,
      linear-gradient(135deg, rgba(3, 3, 3, 0.5) 0%, transparent 22%, transparent 47%, transparent 73%, rgba(0, 0, 0, 0.5) 100%);
    box-sizing: border-box;
  }

  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 0.6em;
    border: 1px solid #444c56;
    box-shadow: -1px -1px 0 #222;
    transform: translate(-50%, -50%);
    height: calc(100% - 14px);
    width: calc(100% - 14px);
    background-image: linear-gradient(to right, #24292e, #1c2128 2px, #3d444d 2px, #3d444d);
    background-size: 4px 100%;
  }

  .rev {
    top: 1rem;
    left: 1.25rem;
    color: #4f8ef7;
    font-size: 1.2rem;
    font-weight: 700;
    font-family: "Inter", sans-serif;
    letter-spacing: -0.5px;
  }

  .master {
    position: absolute;
    bottom: 1.25em;
    right: 0.5em;
    background: linear-gradient(90deg, rgba(79, 142, 247, 0.25) 0%, rgba(79, 142, 247, 0.8) 100%);
    color: #fff;
    height: 2.5em;
    width: 2.5em;
    border: 1px solid #444c56;
    border-radius: 50%;
  }

  .master.one { right: 2em; background: linear-gradient(90deg, rgba(168, 85, 247, 0.25) 0%, rgba(168, 85, 247, 0.8) 100%); }

  .master-text {
    bottom: 0.25em;
    right: 0.8em;
    font-size: 0.75em;
    font-weight: 600;
  }

  .ultra-text {
    top: 0.25rem;
    right: 1.25rem;
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 1.5px;
  }

  .ultra-text,
  .master-text,
  .rev {
    position: absolute;
    text-shadow: -1px -1px #111;
    opacity: 0.9;
  }

  .chip {
    position: absolute;
    top: 27.5%;
    left: 8.25%;
    opacity: 0.8;
  }

  .central-value {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2.5rem;
    font-weight: 700;
    color: #e6edf3;
    text-shadow: 0 0 16px rgba(255, 255, 255, 0.1);
    font-family: "JetBrains Mono", monospace;
  }

  @keyframes rotate {
    0%   { transform: translate(-25em, -15em); }
    50%  { transform: translate(25em, 15em); }
    100% { transform: translate(-25em, -15em); }
  }
`

interface CreditCardWidgetProps {
  title: string
  subtitle: string
  value: string
  footerLogo: string
}

export function CreditCardWidget({ title, subtitle, value, footerLogo }: CreditCardWidgetProps) {
  return (
    <StyledWrapper>
      <div className="main-container">
        <div className="border">
          <div className="card">
            <div className="shadow">
              <div className="content">
                <p className="rev">{title}</p>
                <p className="ultra-text">{subtitle}</p>
                
                <div className="central-value">{value}</div>

                <p className="master-text">{footerLogo}</p>
                <p className="master one" />
                <p className="master two" />
                <svg version="1.1" className="chip" xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 50 50">
                  <image width={50} height={50} x={0} y={0} href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOYfEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSWekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GSe0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOWekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bfu3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWuafUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrbtnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOhg0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU/f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dEorDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2NgGAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVgOkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3dI2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6alKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkIJVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0FqBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGmBSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCETamiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdCS24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAyLTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg==" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  )
}

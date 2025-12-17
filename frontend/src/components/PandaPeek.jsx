import './PandaPeek.css';


function PandaPeek({ isTyping }) {
  return (
    <div className={`character ${isTyping ? "peeking" : "hiding"}`}>
        <div className="ear left"></div>
        <div className="ear right"></div>

        <div className="eye-patch left">
            <div className="eye">
            <div className="pupil"></div>
            </div>
        </div>

        <div className="eye-patch right">
            <div className="eye">
            <div className="pupil"></div>
            </div>
        </div>

        <div className="nose"></div>
        <div className="mouth"></div>

        <div className="hand left"></div>
        <div className="hand right"></div>
    </div>
  )
}

export default PandaPeek;
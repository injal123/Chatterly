// This file is not a component. It is a custom hook for logic and starts with use....

// When SHOULD you create a custom hook?
// Ask:
// ❓ Does this code feel “not UI”?
// ❓ Am I repeating logic? Reusable logic?
// ❓ Could another component use this?


// If yes → hook.

// Use useRef if sounds ever become dynamic(i.e. if sounds depend on user settings)...i used it btw.



// As an array.
const allKeyStrokeSounds = [
    new Audio("/sounds/keystroke1.mp3"),
    new Audio("/sounds/keystroke2.mp3"),
    new Audio("/sounds/keystroke3.mp3"),
    new Audio("/sounds/keystroke4.mp3"),
];




// Just like Toolbox.
function useKeyboardSound() {

    // just like a hammer inside toolbox.
    const playRandomKeyStrokeSound = () => {
        const randomSound = allKeyStrokeSounds[Math.floor(Math.random() * allKeyStrokeSounds.length)];

        randomSound.currentTime = 0;
        randomSound.play()
            .catch( error => console.log("Failed to Play Sound: ", error) );
    };

return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;
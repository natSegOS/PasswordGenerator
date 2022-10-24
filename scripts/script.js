const passwordSection = document.getElementById("password-section");
const passwordTextBox = document.getElementById("password-text-box");

const hideOrShowPasswordButton = document.getElementById("hide-or-show-password-button");
const clearPasswordButton = document.getElementById("clear-password-button");
const passwordStrengthLabel = document.getElementById("password-strength");

const passwordLengthSlider = document.getElementById("password-length-slider");
const passwordLengthSliderValue = document.getElementById("password-length-slider-value");

const lowercaseCheckbox = document.getElementById("lowercase-checkbox");
const uppercaseCheckbox = document.getElementById("uppercase-checkbox");
const numberCheckbox = document.getElementById("number-checkbox");
const symbolCheckbox = document.getElementById("symbol-checkbox");

const generatePasswordButton = document.getElementById("generate-password-section");

const PasswordCharacters = {
    LowercaseLetters: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
    UppercaseLetters: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    Numbers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    Symbols: ["!", "@", "#", "%", "^", "&", "*", "(", ")", "-", "_", "[", "]", "{", "}", ",", ".", "?"]
};

const PasswordStrength = {
    Undetermined: "Undetermined",
    Lame: "Lame",
    CouldBeBetter: "Could Be Better",
    GoodEnough: "Good Enough",
    Strong: "Strong"
};

let PasswordAttributes = {
    Length: 15,
    Strength: PasswordStrength.Undetermined,
    EnableLowercase: true,
    EnableUppercase: true,
    EnableNumbers: true,
    EnableSymbols: true
};

let hiddenPassword = "";

function copyPassword() {
    if (hiddenPassword.length > 0) {
        navigator.clipboard.writeText(hiddenPassword).then(_ => console.log("Copied password to clipboard"));
        return;
    } else if (passwordTextBox.value.length > 0) {
        navigator.clipboard.writeText(passwordTextBox.value).then(_ => console.log("Copied password to clipboard"));
        return;
    }

    alert("No Text to Copy");
}

function getBooleanPasswordAttributes() {
    return Object.keys(PasswordAttributes).filter(o => typeof PasswordAttributes[o] == "boolean" && PasswordAttributes[o] === true);
}

function updatePasswordLengthSlider() {
    const sliderProgressPercentage = (passwordLengthSlider.value / passwordLengthSlider.max) * 100;

    passwordLengthSliderValue.value = passwordLengthSlider.value;
    passwordLengthSlider.style.background = `linear-gradient(to right, #3462fe ${sliderProgressPercentage}%, #d5d5d5 ${sliderProgressPercentage}%)`;
}

function verifyPasswordLengthValue() {
    if (passwordLengthSliderValue.value.trim().length === 0) {
        passwordLengthSlider.value = "1";
    }

    const inputValue = parseInt(passwordLengthSliderValue.value);
    const maxValue = parseInt(passwordLengthSlider.max);
    const minValue = parseInt(passwordLengthSlider.min);

    if (inputValue < minValue) {
        passwordLengthSliderValue.value = passwordLengthSlider.min;
    } else if (inputValue > maxValue) {
        passwordLengthSliderValue.value = passwordLengthSlider.max;
    }
}

function updatePasswordLengthValue() {
    verifyPasswordLengthValue();

    const sliderProgressPercentage = (passwordLengthSliderValue.value / passwordLengthSlider.max) * 100;

    passwordLengthSlider.value = passwordLengthSliderValue.value.trim().length > 0 ? passwordLengthSliderValue.value : "1";
    passwordLengthSlider.style.background = `linear-gradient(to right, #3462fe ${sliderProgressPercentage}%, #d5d5d5 ${sliderProgressPercentage}%)`;
}

function getPasswordStrength() {
    if (PasswordAttributes.Length === 0) {
        return PasswordStrength.Undetermined;
    }

    const booleanAttrs = getBooleanPasswordAttributes();
    let rank = 0;

    if (PasswordAttributes.Length >= 12) {
        rank += 3;
    } else if (PasswordAttributes.Length >= 8) {
        rank += 2;
    }

    if (booleanAttrs.length >= 4) {
        rank += 2;
    } else if (booleanAttrs.length >= 3) {
        rank += 1;
    } else if (booleanAttrs.length === 1) {
        rank -= 1;
    }

    if (rank >= 5) {
        return PasswordStrength.Strong;
    } else if (rank >= 4) {
        return PasswordStrength.GoodEnough;
    } else if (rank >= 3) {
        return PasswordStrength.CouldBeBetter;
    } else {
        return PasswordStrength.Lame;
    }
}

function generatePasswordAttributes() {
    PasswordAttributes.Length = passwordLengthSlider.value;
    PasswordAttributes.EnableLowercase = lowercaseCheckbox.checked;
    PasswordAttributes.EnableUppercase = uppercaseCheckbox.checked;
    PasswordAttributes.EnableNumbers = numberCheckbox.checked;
    PasswordAttributes.EnableSymbols = symbolCheckbox.checked;
    PasswordAttributes.Strength = getPasswordStrength();
}

function updatePasswordAttributes() {
    PasswordAttributes.Length = passwordTextBox.value.length;
    PasswordAttributes.Strength = getPasswordStrength();
}

function updatePasswordStrengthLabel() {
    // TODO: Find a safe way to stop using strings for checks

    if (PasswordAttributes.Strength === PasswordStrength.Lame) {
        passwordStrengthLabel.style.color = "red";
        passwordStrengthLabel.innerHTML = "Lame";
    } else if (PasswordAttributes.Strength === PasswordStrength.CouldBeBetter) {
        passwordStrengthLabel.style.color = "#F0C800FF";
        passwordStrengthLabel.innerHTML = "Could Be Better";
    } else if (PasswordAttributes.Strength === PasswordStrength.GoodEnough) {
        passwordStrengthLabel.style.color = "mediumslateblue";
        passwordStrengthLabel.innerHTML = "Good Enough";
    } else if (PasswordAttributes.Strength === PasswordStrength.Strong) {
        passwordStrengthLabel.style.color = "forestgreen";
        passwordStrengthLabel.innerHTML = "Strong";
    } else {
        passwordStrengthLabel.style.color = "black";
        passwordStrengthLabel.innerHTML = "Undetermined";
    }
}

function generatePassword() {
    generatePasswordAttributes()

    let password = "";
    const booleanAttrs = getBooleanPasswordAttributes();

    if (booleanAttrs.length === 0) {
        alert("At least one checkbox must be enabled to generate a password.");
        return;
    }

    // TODO: Find a safe way to stop using strings to check random key in case the keys are ever changed
    for (let _ = 0; _ < PasswordAttributes.Length; _++) {
        const randomKey = booleanAttrs[Math.floor(Math.random() * booleanAttrs.length)];

        if (randomKey === "EnableLowercase") {
            password += PasswordCharacters.LowercaseLetters[Math.floor(Math.random() * PasswordCharacters.LowercaseLetters.length)];
        } else if (randomKey === "EnableUppercase") {
            password += PasswordCharacters.UppercaseLetters[Math.floor(Math.random() * PasswordCharacters.UppercaseLetters.length)];
        } else if (randomKey === "EnableNumbers") {
            password += PasswordCharacters.Numbers[Math.floor(Math.random() * PasswordCharacters.Numbers.length)];
        } else if (randomKey === "EnableSymbols") {
            password += PasswordCharacters.Symbols[Math.floor(Math.random() * PasswordCharacters.Symbols.length)];
        } else {
            alert("Failed to generate password. Please try again.");
            return;
        }
    }

    passwordTextBox.value = password;
    updatePasswordStrengthLabel();
}

function hidePassword() {
    hiddenPassword = passwordTextBox.value;
    passwordTextBox.value = "-".repeat(hiddenPassword.length);

    hideOrShowPasswordButton.innerHTML = "Show";
    hideOrShowPasswordButton.onpointerdown = showPassword;
}

function showPassword() {
    passwordTextBox.value = hiddenPassword;
    hiddenPassword = "";

    hideOrShowPasswordButton.innerHTML = "Hide";
    hideOrShowPasswordButton.onpointerdown = hidePassword;
}

function clearPassword() {
    passwordTextBox.value = "";
    updatePasswordAttributes();
    updatePasswordStrengthLabel();
}

passwordSection.onpointerdown = copyPassword;
hideOrShowPasswordButton.onpointerdown = hidePassword;
clearPasswordButton.onpointerdown = clearPassword;

passwordLengthSliderValue.innerHTML = passwordLengthSlider.value;
passwordLengthSliderValue.oninput = updatePasswordLengthValue;
passwordLengthSliderValue.addEventListener("focusout", updatePasswordLengthSlider);

updatePasswordLengthSlider();
passwordLengthSlider.oninput = updatePasswordLengthSlider;

generatePasswordButton.onpointerdown = generatePassword;

(function() {
    // Select necessary DOM elements
    const wheel = document.querySelector('.wheel'); 
    const startButton = document.querySelector('.button'); 
    const withdrawButton = document.querySelectorAll('.button')[1];
    const logo = document.querySelector('.logo'); 
    const tickSound = new Audio('./audio/tick.wav'); 

    // Initialize variables
    let deg = 0; 
    let currentRotation = 0;
    let previousTick = 0; 
    let isSpinning = false; 
    let winnings = 5000; 
    let betAmount; 

    // Define multipliers for each segment of the wheel
    const multipliers = [2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 10, 0, 2, 0, 1, 0, 5, 0, 1, 0];
    const segmentSize = 360 / multipliers.length;

    // Select input and display elements for bet amount and winnings
    const betAmountInput = document.getElementById('betAmount');
    const betValueDisplay = document.getElementById('betValue');
    const winningsDisplay = document.getElementById('winningsDisplay');

    // Disable withdraw button initially
    withdrawButton.classList.add('disabled');
    withdrawButton.style.pointerEvents = 'none';

    // Disable start button initially
    startButton.classList.add('disabled');
    startButton.style.pointerEvents = 'none';
    
    // Event listener for bet amount input
    betAmountInput.addEventListener('input', () => {
        const betValue = parseInt(betAmountInput.value, 10); 
        betValueDisplay.textContent = betValue; 
        betAmount = betValue; 

        // Enable/disable start button based on bet amount
        if (betValue === 0) {
            startButton.style.pointerEvents = 'none';
            startButton.classList.add('disabled');
        } else {
            startButton.style.pointerEvents = 'auto';
            startButton.classList.remove('disabled');
        }

        // Ensure bet does not exceed winnings
        if (betValue >= winnings) {
            betValueDisplay.textContent = winnings;
            betAmount = winnings; // Set bet amount to winnings if it exceeds
        }
    });

    // Event listener for start button click
    startButton.addEventListener('click', () => {
        // Deduct bet amount from winnings if the input is enabled
        if (!betAmountInput.disabled) {
            winnings -= betAmount; 
            winningsDisplay.innerText = `Balance: R${winnings}`; // Update winnings display
        }

        betAmountInput.disabled = true; // Disable bet input after starting spin
        
        // Disable buttons while spinning
        withdrawButton.style.pointerEvents = 'none';
        withdrawButton.classList.add('disabled');
        startButton.style.pointerEvents = 'none';
        startButton.classList.add('disabled');

        // Generate random rotation degree for the wheel
        deg = Math.floor(5000 + Math.random() * 5000);
        wheel.style.transition = 'all 5s ease-out'; // Set transition for spinning
        wheel.style.transform = `rotate(${deg}deg)`; // Rotate wheel
        
        // Apply blur effect to wheel and logo during spin
        wheel.classList.add('blur');
        logo.classList.add('blur');

        // Reset rotation values
        currentRotation = 0;
        previousTick = 0;
        isSpinning = true;

        // Start ticking sound animation
        requestAnimationFrame(spinTick);
    });

    // Event listener for when the wheel spin transition ends
    wheel.addEventListener('transitionend', () => {
        // Remove blur effects after spinning
        wheel.classList.remove('blur');
        logo.classList.remove('blur');

        // Enable buttons after spin ends
        startButton.style.pointerEvents = 'auto';
        startButton.classList.remove('disabled');
        withdrawButton.style.pointerEvents = 'auto';
        withdrawButton.classList.remove('disabled');

        wheel.style.transition = 'none'; 

        const actualDeg = deg % 360; 
        wheel.style.transform = `rotate(${actualDeg}deg)`; // Set final position of the wheel

        isSpinning = false; // Set spinning flag to false
        
        // Determine which segment the wheel landed on
        const segmentIndex = Math.floor((actualDeg + 8.2) / segmentSize);
        const multiplier = multipliers[segmentIndex]; 
        betAmount = betAmount * multiplier;
        betValueDisplay.textContent = betAmount;

        // Enable bet input if bet amount is zero
        if (betAmount === 0) {
            betAmountInput.disabled = false;
            withdrawButton.classList.add('disabled');
            withdrawButton.style.pointerEvents = 'none';
            betAmountInput.value = 0;
            startButton.style.pointerEvents = 'none';
            startButton.classList.add('disabled');
        } else {
            betAmountInput.disabled = true;
        }
    });

    // Function to handle the ticking sound during spin
    function spinTick() {
        if (!isSpinning) return; 

        const computedStyle = window.getComputedStyle(wheel);
        const transform = computedStyle.getPropertyValue('transform');

        if (transform !== 'none') {
            const values = transform.split('(')[1].split(')')[0].split(',');
            const a = values[0];
            const b = values[1];
            const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI)); // Calculate angle of rotation
            currentRotation = angle >= 0 ? angle : 360 + angle; // Normalize angle

            // Play ticking sound based on rotation
            if (currentRotation - previousTick >= 100 || currentRotation < previousTick) {
                tickSound.currentTime = 0; 
                tickSound.play(); 
                previousTick = currentRotation;
            }
        }

        requestAnimationFrame(spinTick);
    }

    // Event listener for withdraw button click
    withdrawButton.addEventListener('click', () => {
        winnings += betAmount; 
        winningsDisplay.innerText = `Balance: R${winnings}`; 
        betAmountInput.value = 0; 
        betValueDisplay.innerText = 0; 
        betAmountInput.disabled = false; 
        betAmount = 0; 

        // Disable buttons after withdrawal
        withdrawButton.style.pointerEvents = 'none';
        withdrawButton.classList.add('disabled');
        startButton.style.pointerEvents = 'none';
        startButton.classList.add('disabled');
    });

    withdrawButton.disabled = true;
})();

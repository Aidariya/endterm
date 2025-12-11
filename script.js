let provider, signer, contract;

const CONTRACT_ADDRESS = "0x1BeCd67cF096a530A2f8cE8d1dE949f568b4AB26";
const ABI = [
	{
		"inputs": [],
		"name": "fundContract",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "player",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum RPS.Move",
				"name": "playerMove",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "enum RPS.Move",
				"name": "computerMove",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "result",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountWon",
				"type": "uint256"
			}
		],
		"name": "GamePlayed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "_playerMove",
				"type": "uint8"
			}
		],
		"name": "play",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "betAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "contractBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "player",
				"type": "address"
			}
		],
		"name": "getHistory",
		"outputs": [
			{
				"internalType": "enum RPS.Move[]",
				"name": "playerMoves",
				"type": "uint8[]"
			},
			{
				"internalType": "enum RPS.Move[]",
				"name": "computerMoves",
				"type": "uint8[]"
			},
			{
				"internalType": "string[]",
				"name": "results",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "payouts",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// --- Подключение MetaMask ---
async function connectWallet() {
    if (!window.ethereum) return alert("Please install MetaMask!");

    try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const address = await signer.getAddress();

        // Галочка

        const connectBtn = document.querySelector(".connect");
        connectBtn.innerText = "Connected ✅";
        const box = document.getElementById("walletAddress");
        const short = address.slice(0, 6) + "..." + address.slice(-4);
        document.getElementById("walletShort").innerText = short;
        box.style.display = "block";
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

        console.log("Connected:", address);
        alert("Wallet connected!");

    } catch (err) {
        alert("Error connecting wallet: " + err.message);
    }
}

// --- Сделать ход ---
async function play(choice) {
    if (!contract) return alert("Connect wallet first!");

    const resultBox = document.getElementById("resultBox");

    try {
        const bet = await contract.betAmount();
        const tx = await contract.play(choice, { value: bet });
        const receipt = await tx.wait();

        // Ищем событие GamePlayed
        const event = receipt.events.find(e => e.event === "GamePlayed");
        if (event) {
            const { playerMove, computerMove, result, amountWon } = event.args;

            let player = decode(playerMove);
            let computer = decode(computerMove);
            let won = ethers.utils.formatEther(amountWon);

            // Очищаем классы
            resultBox.className = "result-box";

            // Добавляем цвет состояния
            if (result === "win") resultBox.classList.add("win");
            else if (result === "lose") resultBox.classList.add("lose");
            else resultBox.classList.add("draw");

            // Показываем красиво
            resultBox.innerHTML = `
                <b>Result: ${result.toUpperCase()}</b><br><br>
                🧑 You: <b>${player}</b><br>
                🤖 Computer: <b>${computer}</b><br>
                💰 Won: <b>${won} BNB</b>
            `;
        }

    } catch (e) {
        console.error(e);
        alert("Error: " + (e.data?.message || e.message));
    }
}


// --- Загрузка истории ---
async function loadHistory() {
    if (!contract) return alert("Connect wallet first!");

    try {
        const addrInput = document.getElementById("historyAddress").value.trim();
        const address = addrInput || await signer.getAddress();

        const history = await contract.getHistory(address);
        const playerMoves = history.playerMoves;
        const computerMoves = history.computerMoves;
        const results = history.results;
        const payouts = history.payouts;

        const logDiv = document.getElementById("log");
        logDiv.innerHTML = "";

        if (playerMoves.length === 0) {
            logDiv.innerHTML = "<p>No games played yet.</p>";
            return;
        }

        for (let i = 0; i < playerMoves.length; i++) {
            logDiv.innerHTML += `
                <div class='log'>
                    You: ${decode(playerMoves[i])} —
                    Computer: ${decode(computerMoves[i])} —
                    Result: ${results[i]} —
                    Won: ${ethers.utils.formatEther(payouts[i])} BNB
                </div>
            `;
        }
    } catch (e) {
        console.error(e);
        alert("Cannot load history: " + e.message);
    }
}

// --- Декодирование хода ---
function decode(n) {
    return ["Rock", "Paper", "Scissors"][n];
}

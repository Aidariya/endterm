// Вставь сюда адрес своего контракта и ABI
const CONTRACT_ADDRESS = "ТВОЙ_АДРЕС_КОНТРАКТА";
const ABI = [
    // Вставь ABI из Remix
];

let provider, contract;

async function init() {
    if (!window.ethereum) {
        alert("Install MetaMask!");
        return;
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    loadNFTs();
}

async function loadNFTs() {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = "";

    const search = document.getElementById("searchInput").value.toLowerCase();
    const nextId = Number(await contract.nextId());

    for (let i = 1; i < nextId; i++) {
        const grad = await contract.getGraduate(i);
        const name = grad[0].toLowerCase();
        const program = grad[1];
        const grade = grad[2];

        if (search && !name.includes(search)) continue;

        const tokenURI = await contract.tokenURI(i);
        const metadata = await fetch(tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")).then(r => r.json());

        const card = document.createElement("div");
        card.style.border = "1px solid #ccc";
        card.style.padding = "10px";
        card.style.margin = "10px";
        card.style.width = "200px";

        card.innerHTML = `
            <img src="${metadata.image.replace("ipfs://", "https://ipfs.io/ipfs/")}" width="180">
            <h3>${metadata.name}</h3>
            <p><b>Name:</b> ${grad[0]}</p>
            <p><b>Program:</b> ${grad[1]}</p>
            <p><b>Grade:</b> ${grad[2]}</p>
        `;

        gallery.appendChild(card);
    }
}

// Инициализация при загрузке страницы
window.onload = init;

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import CertificateCard from "./components/CertificateCard";
import { NFT_CONTRACT_ADDRESS, NFT_CONTRACT_ABI } from "./constants";

export default function App() {
    const [provider, setProvider] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);

    const [certificates, setCertificates] = useState([]);

    const [searchName, setSearchName] = useState("");
    const [filterProgram, setFilterProgram] = useState("");
    const [sortOption, setSortOption] = useState("none");

    // --------------------------
    // MetaMask
    // --------------------------
    async function connectWallet() {
        if (!window.ethereum) return alert("Install MetaMask first");

        const prov = new ethers.BrowserProvider(window.ethereum);
        const signer = await prov.getSigner();

        setProvider(prov);
        setAccount(await signer.getAddress());

        const contractInstance = new ethers.Contract(
            NFT_CONTRACT_ADDRESS,
            NFT_CONTRACT_ABI,
            prov
        );

        setContract(contractInstance);
    }

    // --------------------------
    // Load All Certificates
    // --------------------------
    async function loadCertificates() {
        if (!contract) return;

        const maxId = await contract.nextId;
        const items = [];

        for (let id = 1; id < maxId; id++) {
            const grad = await contract.getGraduate(id);
            const uri = await contract.tokenURI(id);

            items.push({
                tokenId: id,
                name: grad[0],
                program: grad[1],
                grade: grad[2],
                image: uri
            });
        }

        setCertificates(items);
    }

    // --------------------------
    // SEARCH by name
    // --------------------------
    function searchCerts(list) {
        if (!searchName.trim()) return list;

        return list.filter(cert =>
            cert.name.toLowerCase().includes(searchName.toLowerCase())
        );
    }

    // --------------------------
    // FILTER by program
    // --------------------------
    function filterCerts(list) {
        if (!filterProgram.trim()) return list;

        return list.filter(cert =>
            cert.program.toLowerCase() === filterProgram.toLowerCase()
        );
    }

    // --------------------------
    // SORTING
    // --------------------------
    function sortCerts(list) {
        if (sortOption === "none") return list;

        if (sortOption === "name") {
            return [...list].sort((a, b) => a.name.localeCompare(b.name));
        }

        if (sortOption === "grade") {
            return [...list].sort((a, b) => a.grade.localeCompare(b.grade));
        }

        return list;
    }

    // Обрабатываем данные
    const finalList = sortCerts(filterCerts(searchCerts(certificates)));

    return (
        <div className="app">
            <h1>NFT Certificate Gallery</h1>

            {!account ? (
                <button className="btn-connect" onClick={connectWallet}>
                    Connect Wallet
                </button>
            ) : (
                <button className="btn-connected">✔ Connected</button>
            )}

            <button className="btn-load" onClick={loadCertificates}>
                Load Certificates
            </button>

            {/* Search / Filter / Sort */}
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search by name…"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                />

                <select value={filterProgram} onChange={(e) => setFilterProgram(e.target.value)}>
                    <option value="">All Programs</option>
                    <option value="Blockchain">Blockchain</option>
                    <option value="AI">AI</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                </select>

                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="none">No sorting</option>
                    <option value="name">Sort by Name</option>
                    <option value="grade">Sort by Grade</option>
                </select>

                <button className="btn-search">Search</button>
            </div>

            {/* Gallery */}
            <div className="gallery">
                {finalList.map((item) => (
                    <CertificateCard key={item.tokenId} data={item} />
                ))}
            </div>
        </div>
    );
}

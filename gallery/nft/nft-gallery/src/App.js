import React, { useEffect, useState } from "react";
import './App.css';

const MOCK_CERTIFICATES = [
  {
    id: 1,
    name: "Aidosh",
    program: "Blockchain",
    grade: "A+",
    image: "bafybeicaxuei4pwiswph663flsadfu75vh6vb32gjozfhxq3ja3e4riwae/1.jpg"
  },
  {
    id: 2,
    name: "Bambi",
    program: "Smart Contracts",
    grade: "A",
    image: "bafybeicaxuei4pwiswph663flsadfu75vh6vb32gjozfhxq3ja3e4riwae/2.jpg"
  },
  {
    id: 3,
    name: "Fiko",
    program: "Security",
    grade: "B",
    image: "bafybeicaxuei4pwiswph663flsadfu75vh6vb32gjozfhxq3ja3e4riwae/3.jpg"
  },
  {
    id: 4,
    name: "Aknur",
    program: "Blockchain",
    grade: "A",
    image: "bafybeicaxuei4pwiswph663flsadfu75vh6vb32gjozfhxq3ja3e4riwae/5.jpg"
  },
  {
    id: 5,
    name: "Akn",
    program: "Blockchain",
    grade: "A",
    image: "bafybeicaxuei4pwiswph663flsadfu75vh6vb32gjozfhxq3ja3e4riwae/6.jpg"
  },
  {
    id: 6,
    name: "Damir",
    program: "Blockchain",
    grade: "A",
    image: "bafybeicaxuei4pwiswph663flsadfu75vh6vb32gjozfhxq3ja3e4riwae/7.jpg"
  },
  {
    id: 7,
    name: "Ai",
    program: "Blockchain",
    grade: "A",
    image: "bafybeicaxuei4pwiswph663flsadfu75vh6vb32gjozfhxq3ja3e4riwae/8.jpg"
  },
  {
    id: 8,
    name: "Aimir",
    program: "Blockchain",
    grade: "A",
    image: "bafybeicaxuei4pwiswph663flsadfu75vh6vb32gjozfhxq3ja3e4riwae/9.jpg"
  },
  {
    id: 9,
    name: "Damir",
    program: "Blockchain",
    grade: "A",
    image: "bafybeicaxuei4pwiswph663flsadfu75vh6vb32gjozfhxq3ja3e4riwae/10.jpg"
  },
  {
    id: 10,
    name: "Damir",
    program: "Blockchain",
    grade: "A",
    image: "bafybeicaxuei4pwiswph663flsadfu75vh6vb32gjozfhxq3ja3e4riwae/11.jpg"
  }
];

function App() {
  const [certificates, setCertificates] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Тут будет вызов контракта для получения NFT
    setCertificates(MOCK_CERTIFICATES);
  }, []);

  const filtered = certificates.filter(cert =>
    cert.name.toLowerCase().includes(search.toLowerCase()) ||
    cert.program.toLowerCase().includes(search.toLowerCase()) ||
    cert.grade.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>NFT Certificate Gallery</h1>
      <input
        type="text"
        placeholder="Search by name, program or grade..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className="no-certificates">No certificates found.</p>
      ) : (
        <div className="gallery">
          {filtered.map(cert => (
            <div className="card" key={cert.id}>
              <img
                src={`https://gateway.pinata.cloud/ipfs/${cert.image}`}
                alt={`Certificate ${cert.id}`}
              />
              <div className="card-content">
                <p>Graduate: <span>{cert.name}</span></p>
                <p>Program: <span>{cert.program}</span></p>
                <p>Grade: <span>{cert.grade}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

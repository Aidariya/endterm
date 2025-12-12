export default function CertificateCard({ data }) {
    return (
        <div className="card">
            <img src={data.image} alt="NFT Certificate" />

            <h3>{data.name}</h3>
            <p><strong>Program:</strong> {data.program}</p>
            <p><strong>Grade:</strong> {data.grade}</p>

            <p className="token">ID: #{data.tokenId}</p>
        </div>
    );
}

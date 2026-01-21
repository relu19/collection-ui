import React, { useState } from 'react';
import './style.scss';
import notificationService from "../../services/notificationService";

const ConvertPage = () => {
    const [htmlInput, setHtmlInput] = useState('');
    const [result, setResult] = useState([]);
    const [copied, setCopied] = useState(false);

    const handleConvert = () => {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlInput, 'text/html');
            const rows = doc.querySelectorAll('table tbody tr');

            const extracted = [];

            for (const row of rows) {
                const tds = row.querySelectorAll('td');
                const number = tds[0]?.textContent.trim();
                // Try to get description from <a> tag first, then fallback to direct text content
                const desc = tds[1]?.querySelector('a')?.textContent.trim() || tds[1]?.textContent.trim();

                if (number && desc) {
                    extracted.push({ number, desc });
                }

                if (number === 'KOR20') break;
            }

            setResult(extracted);
            setCopied(false); // Reset copy state
        } catch (e) {
            notificationService.error('Invalid HTML');
        }
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            notificationService.error('Copy failed');
        }
    };

    return (
        <div className='convertpage' style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>HTML Table → Array Converter</h2>

            <textarea
                rows={15}
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '14px', padding: '10px' }}
                placeholder="Paste your table HTML here..."
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
            />

            <button
                onClick={handleConvert}
                style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                Convert
            </button>

            {result.length > 0 && (
                <>
                    <h3>Extracted Array:</h3>
                    <pre
                        style={{
                            backgroundColor: '#f5f5f5',
                            padding: '10px',
                            borderRadius: '5px',
                            overflowX: 'auto',
                            maxHeight: '400px',
                            maxWidth: '100%',
                            whiteSpace: 'pre-wrap',
                        }}
                    >
            {JSON.stringify(result, null, 2)}
          </pre>

                    <button
                        onClick={handleCopy}
                        style={{
                            marginTop: '5px',
                            padding: '8px 16px',
                            backgroundColor: copied ? '#28a745' : '#17a2b8',
                            color: '#fff',
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                </>
            )}
        </div>
    );
};

export default ConvertPage;

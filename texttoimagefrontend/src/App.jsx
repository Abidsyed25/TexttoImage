import React, { useState } from 'react';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setImageUrl(null);

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = 'generated_image.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
    <header className="header">
        <h1>Text to Image Generator</h1>
      </header>
    <div className="app">
      <main className="main">
       
          <label htmlFor="prompt" className="label" style={{margin:'auto'}}>Enter a prompt:</label>
          <input
            type="text"
            id="prompt"
            className="input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            />
          <button onClick={handleSubmit} className="button">Generate Image</button>
      
        {loading && <p className="loading">Generating image...</p>}
        {imageUrl && (
          <div className="image-container">
            <div>

            <img src={imageUrl} alt="Generated" className="image" />
            </div>
            <button className="download-button" onClick={handleDownload} >Download Image</button>
          </div>
        )}
      </main>
    </div>
        </>
  );
}

export default App;

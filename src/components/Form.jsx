import { useState } from "react";
import "./form.css";

export default function Form() {
  const [responseMessage, setResponseMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  async function submit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const firstUrl = formData.get("firstUrl");
    const response = await fetch(
      `https://dharabheem-test.hf.space/scrape?firstUrl=${firstUrl}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({ firstUrl }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const combinedMarkdown = data.content
        .map((item) => item.markdown)
        .join("\n\n");
      const blob = new Blob([combinedMarkdown], { type: "text/markdown" });
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
      setResponseMessage("Scraping completed. Click the button to download.");
    } else {
      const data = await response.json();
      setResponseMessage(data.message);
    }
  }

  function downloadFile() {
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = "scrapedContent.md";
    document.body.appendChild(a);
    a.click();
    // a.remove();
    // window.URL.revokeObjectURL(downloadUrl);
    // setDownloadUrl("");
  }

  function handleFocus() {
    const overlayShown = localStorage.getItem("overlayShown");
    if (overlayShown !== "true") {
      setShowOverlay(true);
    }
  }

  function handleCloseOverlay() {
    setShowOverlay(false);
    localStorage.setItem("overlayShown", "true");
  }

  return (
    <>
      <form onSubmit={submit}>
        <label htmlFor="name">
          <input
            type="url"
            id="firstUrl"
            name="firstUrl"
            autoComplete="firstUrl"
            placeholder="https://playwright.dev/docs/intro"
            required
            onFocus={handleFocus}
          />
        </label>
        <button id="scrape">Scrape</button>
        {responseMessage && <p>{responseMessage}</p>}
        {downloadUrl && (
          <button type="button" onClick={downloadFile}>
            Download Markdown File
          </button>
        )}
      </form>
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <p>
              <span style={{fontWeight: "bolder"}}>Important:</span> Ensure you have read the instructions
              stated above before using the tool!
            </p>
            <button onClick={handleCloseOverlay}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}
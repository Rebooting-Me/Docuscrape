import { useState } from "react";

export default function Form() {
  const [responseMessage, setResponseMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

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

  return (
    <form onSubmit={submit}>
      <label htmlFor="name">
        Initial URL
        <input
          type="url"
          id="firstUrl"
          name="firstUrl"
          autoComplete="firstUrl"
          required
        />
      </label>
      <button>Scrape</button>
      {responseMessage && <p>{responseMessage}</p>}
      {downloadUrl && (
        <button type="button" onClick={downloadFile}>
          Download Markdown File
        </button>
      )}
    </form>
  );
}

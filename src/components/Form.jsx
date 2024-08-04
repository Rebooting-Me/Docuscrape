import { useState } from "react";
import { useRef } from "react";
import "./form.css";

export default function Form() {
  const [responseMessage, setResponseMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseOverlay, setResponseOverlay] = useState(true);
  const inputRef = useRef(null);

  async function submit(e) {
    e.preventDefault();
    setIsLoading(true);
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
    setIsLoading(false);

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
    inputRef.current.value = "";
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

  function closeResponse() {
    setResponseOverlay(false);
  }

  return (
    <>
      {isLoading && (
        <div id="loaderOverlay">
          <div id="loader">
            <p style={{ color: "#333", fontWeight: "600" }}>
              Processing Request...
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <defs>
                <filter id="svgSpinnersGooeyBalls20">
                  <feGaussianBlur
                    in="SourceGraphic"
                    result="y"
                    stdDeviation="1"
                  />
                  <feColorMatrix
                    in="y"
                    result="z"
                    values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7"
                  />
                  <feBlend in="SourceGraphic" in2="z" />
                </filter>
              </defs>
              <g filter="url(#svgSpinnersGooeyBalls20)">
                <circle cx="5" cy="12" r="4" fill="currentColor">
                  <animate
                    attributeName="cx"
                    calcMode="spline"
                    dur="2s"
                    keySplines=".36,.62,.43,.99;.79,0,.58,.57"
                    repeatCount="indefinite"
                    values="5;8;5"
                  />
                </circle>
                <circle cx="19" cy="12" r="4" fill="currentColor">
                  <animate
                    attributeName="cx"
                    calcMode="spline"
                    dur="2s"
                    keySplines=".36,.62,.43,.99;.79,0,.58,.57"
                    repeatCount="indefinite"
                    values="19;16;19"
                  />
                </circle>
                <animateTransform
                  attributeName="transform"
                  dur="0.75s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                />
              </g>
            </svg>
          </div>
        </div>
      )}
      {responseMessage && downloadUrl && responseOverlay && (
        <div id="responseOverlay">
          <div id="response">
            <p>{responseMessage}</p>
            <div style={{ display: "flex", gap: "2rem" }}>
              <button id="download" type="button" onClick={downloadFile}>
                Download
              </button>
              <button id="close" type="button" onClick={closeResponse}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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
            ref={inputRef}
          />
        </label>
        <button id="scrape">Scrape</button>
        {/* {isLoading && <div id="scrapeOverlay">a sliding toast</div>} */}
      </form>
      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <p>
              <span style={{ fontWeight: "bolder" }}>Important:</span> Ensure
              you have read the instructions stated above before using the tool!
            </p>
            <button onClick={handleCloseOverlay}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}
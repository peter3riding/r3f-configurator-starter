import { useState } from "react";
import App from "./App";
import Overlay from "./Overlay";
import { Leva } from "leva";

type DownloadFunction = () => void;

export default function Root() {
  const [download, setDownload] = useState<DownloadFunction | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <App setDownload={setDownload} onLoaded={() => setIsLoaded(true)} />
      <Overlay download={download} isLoaded={isLoaded} />
      {import.meta.env.DEV && <Leva collapsed />}
    </>
  );
}

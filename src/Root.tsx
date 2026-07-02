import { useState } from "react";
import App from "./App";
import Overlay from "./Overlay";
import { Leva } from "leva";

type DownloadFunction = () => void;

export default function Root() {
  const [download, setDownload] = useState<DownloadFunction | null>(null);

  return (
    <>
      <App setDownload={setDownload} />
      <Overlay download={download} />
      {import.meta.env.DEV && <Leva collapsed />}
    </>
  );
}

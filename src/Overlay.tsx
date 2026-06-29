import { Logo } from "@pmndrs/branding";
import { ShoppingCart, Sparkles, Download, ArrowLeft } from "lucide-react";
import useStore from "./stores/stores.ts";

export default function Overlay() {
  const intro = useStore((state) => state.intro);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <header className="flex justify-between w-full px-10 py-10 items-center fixed">
        <Logo width="40" height="40" />
        <div>
          <ShoppingCart />
        </div>
      </header>
      {intro ? <Intro /> : <Customizer />}
    </div>
  );
}

function Intro() {
  const setShowIntro = useStore((state) => state.setIntro);
  return (
    <section
      key="main"
      className="absolute top-0 left-0 flex justify-center flex-col h-full w-full items-center "
    >
      <div className="mt-[5vh] ml-[5vw]">
        <div>
          <h1 className="font-black text-[16vw] tracking-[-6px] italic w-[30%] leading-[15vh] font-['Nunito_Sans']">
            LET'S DO IT.
          </h1>
        </div>
        <div className="relative top-[-25%] left-75">
          <div>
            <p className="w-87.5 mb-12 leading-6">
              Create your unique and exclusive shirt with our brand-new 3D
              customization tool. <strong>Unleash your imagination</strong> and
              define your own style.
            </p>
            <button
              style={{ background: "black" }}
              onClick={() => setShowIntro(false)}
            >
              CUSTOMIZE IT <Sparkles />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Customizer() {
  const setShowIntro = useStore((state) => state.setIntro);

  const setColor = useStore((state) => state.setSelectedColor);

  const setDecal = useStore((state) => state.setSelectedDecal);

  const colors = [
    "#ccc",
    "#EFBD4E",
    "#80C670",
    "#726DE8",
    "#EF674E",
    "#353934",
    "Purple",
  ];
  const decals = ["react", "three2", "pmndrs"];

  return (
    <section key="custom">
      <div className="customizer">
        <div className="color-options">
          {colors.map((color) => (
            <div
              key={color}
              className="circle pointer-events-auto"
              style={{ background: color }}
              onClick={() => setColor(color)}
            ></div>
          ))}
        </div>
        <div className="decals">
          <div className="decals--container">
            {decals.map((decal) => (
              <div
                key={decal}
                className="decal pointer-events-auto"
                onClick={() => setDecal(decal)}
              >
                <img src={decal + "_thumb.png"} alt="brand" />
              </div>
            ))}
          </div>
        </div>
        <button className="share" style={{ background: "black" }}>
          DOWNLOAD
          <Download size="1.3em" />
        </button>

        <button
          className="exit"
          style={{ background: "black" }}
          onClick={() => setShowIntro(true)}
        >
          GO BACK
          <ArrowLeft size="1.3em" />
        </button>
      </div>
    </section>
  );
}

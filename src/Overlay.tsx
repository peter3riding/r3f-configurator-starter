import { Logo } from "@pmndrs/branding";
import { ShoppingCart, Sparkles, Download, ArrowLeft } from "lucide-react";
import useStore from "./stores/stores.ts";
import { motion, AnimatePresence } from "motion/react";

type Props = {
  download: (() => void) | null;
};

const variants = {
  hidden: {
    x: -500,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -500,
    opacity: 0,
  },
};

export default function Overlay({ download }: Props) {
  const intro = useStore((state) => state.intro);

  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <motion.header
        initial={{ opacity: 0, y: -120 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 1.8, delay: 1 }}
        className="flex justify-between w-full px-10 py-10 items-center fixed"
      >
        <Logo width="40" height="40" />
        <div>
          <ShoppingCart />
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {intro ? (
          <Intro key="intro" />
        ) : (
          <Customizer key="customizer" download={download} />
        )}
      </AnimatePresence>
    </div>
  );
}

function Intro() {
  const setShowIntro = useStore((state) => state.setIntro);
  return (
    <motion.section
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{
        type: "spring",
        duration: 0.8,
      }}
      key="main"
      className="max-[600px]:ml-[15vw] absolute top-0 left-0 flex justify-center flex-col h-full w-full items-center "
    >
      <div className="mt-[5vh] ml-[5vw]">
        <div>
          <h1 className="max-[600px]:text-[5rem] max-[600px]:tracking-[-6px] max-[600px]:leading-18 font-black text-[16vw] tracking-[-6px] italic w-[30%] leading-[15vh] font-['Nunito_Sans']">
            LET'S DO IT.
          </h1>
        </div>
        <div
          className="  max-[600px]:top-[5%]
    max-[600px]:left-0 relative top-[-25%] left-75"
        >
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
    </motion.section>
  );
}

function Customizer({ download }: Props) {
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
    <section>
      <div className="customizer">
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            type: "spring",
            duration: 0.8,
          }}
          className="color-options
            max-[600px]:mb-5
            max-[600px]:flex-col
            max-[600px]:absolute
            max-[600px]:top-1/2
            max-[600px]:right-10
            max-[600px]:-translate-y-1/2"
        >
          {colors.map((color) => (
            <div
              key={color}
              className="circle pointer-events-auto"
              style={{ background: color }}
              onClick={() => setColor(color)}
            />
          ))}
        </motion.div>

        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            type: "spring",
            duration: 0.8,
          }}
          className="decals"
        >
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
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            type: "spring",
            duration: 0.8,
          }}
          className="share"
          style={{ background: "black" }}
          onClick={() => download?.()}
        >
          DOWNLOAD
          <Download size="1.3em" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{
            type: "spring",
            duration: 0.8,
          }}
          className="exit"
          style={{ background: "black" }}
          onClick={() => setShowIntro(true)}
        >
          GO BACK
          <ArrowLeft size="1.3em" />
        </motion.button>
      </div>
    </section>
  );
}

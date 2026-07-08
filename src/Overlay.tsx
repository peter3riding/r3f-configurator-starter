import { Logo } from "@pmndrs/branding";
import {
  ShoppingCart,
  Sparkles,
  Download,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { useIntro, useShirtActions, useTotalPrice } from "./stores/stores.ts";
import { motion, AnimatePresence } from "motion/react";
import { containerVariants, itemVariants } from "./components/ui/variants.ts";
import ActionButton from "./components/ui/ActionButton.tsx";
import { shirtConfig } from "./config/shirtConfig";
import { useProgress } from "@react-three/drei";
import { useState } from "react";
import Cart from "./components/Cart.tsx";
export default function Overlay() {
  const intro = useIntro();
  const { active, progress } = useProgress();
  const isLoaded = !active && progress > 0;
  const [cartStatus, setCartStatus] = useState<boolean>(false);

  return (
    <>
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isLoaded ? 1 : 0,
        }}
        transition={{
          duration: 0.8,
          delay: isLoaded ? 2.2 : 0,
        }}
      >
        {cartStatus && <Cart />}
        <motion.header
          initial={{ opacity: 0, y: -120 }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            y: isLoaded ? 0 : -120,
          }}
          transition={{ duration: 1.1, delay: isLoaded ? 1.2 : 0 }}
          className="flex justify-between w-full px-10 py-10 items-center fixed z-50"
        >
          <Logo width="40" height="40" />
          <button
            className="cursor-pointer pointer-events-auto"
            onClick={() => setCartStatus((c) => (c === true ? false : true))}
          >
            <ShoppingCart />
          </button>
        </motion.header>

        <AnimatePresence mode="wait">
          {isLoaded &&
            (intro ? <Intro key="intro" /> : <Customizer key="customizer" />)}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

function Intro() {
  const { setIntro } = useShirtActions();

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      key="main"
      className="max-[600px]:ml-[15vw] absolute top-0 left-0 flex justify-center flex-col h-full w-full items-center "
    >
      <div className="mt-[20vh] ml-[5vw]">
        <motion.div variants={itemVariants}>
          <h1 className="max-[600px]:text-[5rem] max-[600px]:tracking-[-6px] max-[600px]:leading-18 font-black text-[16vw] leading-[0.8] tracking-tighter italic w-[30%] font-['Nunito_Sans']">
            LET'S DO IT.
          </h1>
        </motion.div>
        <div className="max-[600px]:top-[5%] max-[600px]:left-0 relative top-[-25%] left-75">
          <motion.div variants={itemVariants}>
            <p className="w-87.5 mb-12 leading-6">
              Create your unique and exclusive shirt with our brand-new 3D
              customization tool. <strong>Unleash your imagination</strong> and
              define your own style.
            </p>
            <ActionButton onClick={() => setIntro(false)}>
              CUSTOMIZE IT <Sparkles />
            </ActionButton>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

// Get all options from config
const ALL_COLORS = Object.values(shirtConfig.colors);
const ALL_DECALS = Object.values(shirtConfig.decals);

function Customizer() {
  const { setIntro, selectColor, selectDecal, download, addToCart } =
    useShirtActions();

  const totalPrice = useTotalPrice();

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex justify-end flex-col items-center h-full w-full mb-6.25">
        {/* Color Buttons */}
        <motion.div
          variants={itemVariants}
          className="color-options absolute flex gap-2.5 bottom-5 mb-5
            max-[600px]:mb-5 max-[600px]:flex-col max-[600px]:absolute
            max-[600px]:top-1/2 max-[600px]:right-10 max-[600px]:-translate-y-1/2"
        >
          {ALL_COLORS.map((colorOption) => (
            <motion.button
              type="button"
              key={colorOption.id}
              whileHover={{ scale: 1.1 }}
              className="w-7.5 h-7.5 rounded-full border-2 border-white pointer-events-auto cursor-pointer"
              style={{ background: colorOption.hex }}
              onClick={() => selectColor(colorOption.id)}
              aria-label={colorOption.label}
            />
          ))}
        </motion.div>
        {/* Decal Buttons */}
        <motion.div
          variants={itemVariants}
          className="absolute left-12.5 bottom-10"
        >
          <div className="flex gap-5">
            {ALL_DECALS.map((decalOption) => (
              <button
                type="button"
                key={decalOption.id}
                onClick={() => selectDecal(decalOption.id)}
                className="pointer-events-auto cursor-pointer"
              >
                <motion.img
                  className="w-6"
                  src={`${decalOption.id}_thumb.png`}
                  alt={decalOption.label}
                  initial={{
                    filter: "saturate(0) invert(1) brightness(5.5)",
                    scale: 1,
                  }}
                  whileHover={{
                    filter: "saturate(1) invert(0) brightness(1)",
                    scale: 1.2,
                  }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* // Download button */}
        <ActionButton className="absolute top-50 left-10" onClick={download}>
          <Download size="1.3em" />
        </ActionButton>

        {/* // Go back button */}
        <ActionButton
          className="absolute top-30 left-10 shadow-[inset_0_0_0_0.09px_black]"
          onClick={() => setIntro(true)}
        >
          <ArrowLeft size="1.3em" />
        </ActionButton>

        {/* // Add to Cart button */}
        <div className="absolute bottom-10 right-55">
          <p>
            <strong>${totalPrice}</strong>
          </p>
        </div>
        <ActionButton
          className="absolute bottom-10 right-10"
          onClick={addToCart}
        >
          <Plus size="1.3em" />
        </ActionButton>
      </div>
    </motion.section>
  );
}

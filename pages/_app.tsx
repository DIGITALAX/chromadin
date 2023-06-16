import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { store } from "./../redux/store";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { Provider } from "react-redux";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import Modals from "@/components/Common/Modals/modules/Modals";
import { useEffect } from "react";

const projectId = "b3b7fdf45176170edb033d0002c4904b";

const { chains, provider } = configureChains(
  [polygon],
  [
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY as string,
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Chromadin",
  chains,
  projectId,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    console.log(`
    ██████╗░██╗░█████╗░██╗░░░░░  ██╗███╗░░██╗  ████████╗░█████╗░  ████████╗██╗░░██╗███████╗
    ██╔══██╗██║██╔══██╗██║░░░░░  ██║████╗░██║  ╚══██╔══╝██╔══██╗  ╚══██╔══╝██║░░██║██╔════╝
    ██║░░██║██║███████║██║░░░░░  ██║██╔██╗██║  ░░░██║░░░██║░░██║  ░░░██║░░░███████║█████╗░░
    ██║░░██║██║██╔══██║██║░░░░░  ██║██║╚████║  ░░░██║░░░██║░░██║  ░░░██║░░░██╔══██║██╔══╝░░
    ██████╔╝██║██║░░██║███████╗  ██║██║░╚███║  ░░░██║░░░╚█████╔╝  ░░░██║░░░██║░░██║███████╗
    ╚═════╝░╚═╝╚═╝░░╚═╝╚══════╝  ╚═╝╚═╝░░╚══╝  ░░░╚═╝░░░░╚════╝░  ░░░╚═╝░░░╚═╝░░╚═╝╚══════╝
    
    ██████╗░██╗███╗░░██╗
    ██╔══██╗██║████╗░██║
    ██║░░██║██║██╔██╗██║
    ██║░░██║██║██║╚████║
    ██████╔╝██║██║░╚███║
    ╚═════╝░╚═╝╚═╝░░╚══╝`);
  }, []);
  return (
    <Provider store={store}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />
          <Modals />
        </RainbowKitProvider>
      </WagmiConfig>
    </Provider>
  );
}

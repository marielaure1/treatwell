import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster"

export default function App({ Component, pageProps }) {
  return (
    <>
     <header className="w-full p-10">
       <h1 className="text-7xl text-slate-950 text-center">Treatwell</h1>
     </header>
     <main className={`font-sans px-20 w-full`}>
       <Component {...pageProps} />
     </main>
     <Toaster />
     </>
      
   );
}

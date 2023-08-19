import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <main
            className={`grid grid-cols-1 mt-16 lg:ml-24 px-5 ${inter.className}`}>
            <h1>Home Seite</h1>
        </main>
    );
}

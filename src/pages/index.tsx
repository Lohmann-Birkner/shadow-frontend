import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
    return (
        <main
            className={`grid grid-cols-1 mt-16 ml-16  ${inter.className}`}></main>
    );
}

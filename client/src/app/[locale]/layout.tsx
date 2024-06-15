// import type { Metadata } from "next";
// import { Open_Sans } from "next/font/google";
// import "./globals.css";
// import { cn } from "../lib/utils";
// import { ReduxProvider } from "@/redux/Provider";

// const openSans = Open_Sans({
//   weight: ["300", "400", "500", "600", "700", "800"],
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body
//         className={cn(
//           "min-h-screen w-full bg-zinc-50 text-black flex overflow-y-hidden",
//           openSans.className,
//           {
//             "debug-screens": process.env.NODE_ENV === "development",
//           }
//         )}
//       >
//         <ReduxProvider>
//           <div className=" w-full ">{children}</div>
//         </ReduxProvider>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../../lib/utils";
import SideNavbar from "@/components/SideNavbar";
import Navbar from "@/components/header/Navbar";
import { ReduxProvider } from "@/redux/Provider";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app"
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

  export default function RootLayout({
  children,
  params: { locale },
}: Readonly<RootLayoutProps>) {
  return (
    <html lang={locale}>
      <body
        className={cn(
          // "min-h-screen w-full bg-[#111120] text-black flex ",
          "min-h-screen w-full bg-[#fefefe] overflow-x-hidden  text-black flex ",
          inter.className,
          {
            "debug-screens": process.env.NODE_ENV === "development"
          }
        )}
      > 
      <ReduxProvider>
      
      <div className=" w-full ">{children}</div>
        <ToastContainer/>
      </ReduxProvider>
      </body>
    </html>
  );
}



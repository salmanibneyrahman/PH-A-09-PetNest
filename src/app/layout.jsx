import "./globals.css";

export const metadata = {
    title: "PetNest - Find Your Perfect Companion",
    description:
        "PetNest is a modern pet adoption platform connecting pets with loving families. Browse dogs, cats, birds, rabbits and more.",
    keywords: "pet adoption, dogs, cats, birds, rabbits, reptiles, shelter, adopt",
    authors: [{ name: "PetNest" }],
    openGraph: {
        title: "PetNest - Find Your Perfect Companion",
        description:
            "Browse and adopt pets from verified shelters and pet owners near you.",
        type: "website",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://googleapis.com" />
                <link rel="preconnect" href="https://gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}

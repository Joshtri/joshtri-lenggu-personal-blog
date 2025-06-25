import { Metadata } from "next";
import AboutPage from "@/views/g/about";

export const metadata: Metadata = {
  title: "About Joshtri Lenggu | Personal Blog",
  description:
    "Learn more about Joshtri Lenggu, a blogger sharing personal stories, reflections, and life experiences. Discover the inspiration behind the blog.",
  keywords: ["Joshtri Lenggu", "personal blog", "life stories", "reflections", "inspiration"],
  openGraph: {
    title: "About Joshtri Lenggu",
    description: "Explore the personal journey of Joshtri Lenggu through stories and reflections on life.",
    url: "https://yourwebsite.com/about",
    type: "website",
    images: [
      {
        url: "https://yourwebsite.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Joshtri Lenggu - About Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Joshtri Lenggu",
    description: "Discover the stories and reflections of Joshtri Lenggu on life and personal experiences.",
    images: "https://yourwebsite.com/og-image.jpg",
  },
};

export default function About() {
  return <AboutPage />;
}

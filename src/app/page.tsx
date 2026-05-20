import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { Services } from "@/components/site/services";
// Projects section is hidden for now — bring back together with the `/projects`
// route and the `navLinks` entry in `lib/data.ts` when we're ready to relaunch.
// import { Projects } from "@/components/site/projects";
import { About } from "@/components/site/about";
import { Experience } from "@/components/site/experience";
import { Skills } from "@/components/site/skills";
import { CTA } from "@/components/site/cta";
import { Blog } from "@/components/site/blog";
import { Contact } from "@/components/site/contact";
import { Footer } from "@/components/site/footer";
import { JsonLd } from "@/components/site/json-ld";
import { personSchema, websiteSchema } from "@/lib/structured-data";

export default function Home() {
  return (
    <>
      <JsonLd id="ld-website" data={websiteSchema()} />
      <JsonLd id="ld-person" data={personSchema()} />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        {/* <Projects /> */}
        <About />
        <Experience />
        <Skills />
        <CTA />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

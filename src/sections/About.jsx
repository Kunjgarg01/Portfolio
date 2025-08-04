import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import PhysicsFooter from './PhysicsFooter';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const About = () => {
  const text = `Passionate about clean architecture
    I build scalable, high-performance solutions
    from prototype to production`;
  const imgRef = useRef(null);

  useGSAP(() => {
    gsap.to("#about", {
      scale: 0.95,
      scrollTrigger: {
        trigger: "#about",
        start: "bottom 80%",
        end: "bottom 20%",
        scrub: true,
        markers: false,
      },
      ease: "power1.inOut",
    });

    gsap.set(imgRef.current, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
    });
    gsap.to(imgRef.current, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 2,
      ease: "power4.out",
      scrollTrigger: { trigger: imgRef.current },
    });
  });

  return (
    <section id="about" className="min-h-screen bg-black rounded-b-4xl">
      <AnimatedHeaderSection
        subTitle={"Cod with purpose, Built to scale"}
        title={"About"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />
      <div className="flex flex-col gap-6 pt-6 px-10 pb-16 text-xl font-light tracking-wide text-white/60">
        {/* Left section, with Tech Stack heading in the right corner */}
        <div className="w-[100%] flex justify-between items-end">
          <div>
            <h2 className="mb-4 text-4xl font-bold text-white">
              Hi, I'm Kunj Garg
            </h2>
            <p className="text-2xl">
              Passionate front-end developer with a strong eye for design and detail.<br />
              I specialize in building responsive, user-friendly web interfaces using modern technologies like HTML, CSS, JavaScript, and React.<br />
              I turn ideas into seamless digital experiences that are both scalable and performance-driven.
            </p>
          </div>
        </div>
        <div className="flex justify-end pr-5">
  <h2 className="text-5xl font-bold text-white whitespace-nowrap">
    Tech Stack
  </h2>
</div>

      </div>
      <PhysicsFooter />
    </section>
  );
};

export default About;

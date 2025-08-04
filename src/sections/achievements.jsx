import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { achievementsData } from "../constants";
import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register the ScrollTrigger plugin once
gsap.registerPlugin(ScrollTrigger);

const Achievements = () => {
  const text = `Showcasing standout achievements,
valuable experiences, and earned distinctions
throughout my journey.
`;

  const achievementRefs = useRef([]);
  const isDesktop = useMediaQuery({ minWidth: "48rem" }); // 768px breakpoint

  useGSAP(() => {
    achievementRefs.current.forEach((el) => {
      if (!el) return;

      gsap.from(el, {
        y: 200,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
        },
        duration: 1,
        ease: "circ.out",
      });
    });
  }, []);

  if (!achievementsData || achievementsData.length === 0) {
    return (
      <section
        id="achievements"
        className="min-h-screen bg-black rounded-t-4xl flex items-center justify-center text-white"
      >
        <p className="text-xl">No achievements to display.</p>
      </section>
    );
  }

  return (
    <section id="achievements" className="min-h-screen bg-black rounded-t-4xl">
      <AnimatedHeaderSection
        subTitle={"Achievements & Milestones"}
        title={"Achievements"}
        text={text}
        textColor={"text-white"}
        withScrollTrigger={true}
      />

      {achievementsData.map((achievement, index) => (
        <div
          ref={(el) => (achievementRefs.current[index] = el)}
          key={index}
          className="sticky px-10 pt-6 pb-12 text-white bg-black border-t-2 border-white/30"
          style={
            isDesktop
              ? {
                  top: `calc(10vh + ${index * 5}em)`,
                  marginBottom: `${(achievementsData.length - index - 1) * 5}rem`,
                }
              : { top: 0 }
          }
        >
          <div className="flex items-center justify-between gap-4 font-light">
            <div className="flex flex-col gap-6">
              <h2 className="text-4xl lg:text-5xl">{achievement.title}</h2>

              {/* Description as bullets if array, as p if string */}
              {Array.isArray(achievement.description) ? (
                <ul className="pl-5 text-xl leading-relaxed tracking-widest lg:text-2xl text-white/60 list-disc space-y-1">
                  {achievement.description.map((desc, i) =>
                    <li key={i}>{desc.replace(/^•\s*/, "")}</li>
                  )}
                </ul>
              ) : (
                <p className="text-xl leading-relaxed tracking-widest lg:text-2xl text-white/60 whitespace-pre-line">
                  {achievement.description}
                </p>
              )}
              
              {/* Items as bullet points, e.g. for certifications */}
              {achievement.items && achievement.items.length > 0 && (
                <ul className="pl-7 text-xl lg:text-2xl text-white/80 list-disc space-y-1">
                  {achievement.items.map((item, itemIndex) =>
                    <li key={itemIndex}>{item}</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Achievements;

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PageTransition() {
  useLayoutEffect(() => {
    const mainPage = document.querySelector<HTMLElement>("#main-content");
    const collectionsRoot =
      document.querySelector<HTMLElement>("#collections-root");

    const collectionsSection = collectionsRoot?.querySelector<HTMLElement>(
      ".collections-section",
    );

    if (!mainPage || !collectionsRoot || !collectionsSection) {
      console.error("PageTransition: Required page elements are missing.");
      return;
    }

    const context = gsap.context(() => {
      const heading = collectionsSection.querySelector<HTMLElement>(
        ".collections-heading",
      );

      const cards =
        collectionsSection.querySelectorAll<HTMLElement>(".collection-card");

      const footer = collectionsSection.querySelector<HTMLElement>(
        ".collections-footer",
      );

      /*
       * IMPORTANT:
       * The first page is no longer scaled down.
       * It remains full-size and is covered by Collections.
       */

      gsap.set(mainPage, {
        clearProps: "transform,borderRadius",
      });

      // Initial state of Collections.
      if (heading) {
        gsap.set(heading, {
          autoAlpha: 0,
          y: 25,
        });
      }

      if (cards.length > 0) {
        gsap.set(cards, {
          autoAlpha: 0,
          y: 45,
        });
      }

      if (footer) {
        gsap.set(footer, {
          autoAlpha: 0,
          y: 15,
        });
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: mainPage,

          start: "top top",

          // One complete viewport controls the transition.
          end: () => `+=${window.innerHeight}`,

          scrub: 0.8,

          // Hold the first page while Collections rises over it.
          pin: mainPage,
          pinSpacing: false,

          anticipatePin: 1,
          invalidateOnRefresh: true,

          // Snap only to the beginning or end.
          snap: {
            snapTo: [0, 1],
            directional: true,

            delay: 0.12,

            duration: {
              min: 0.25,
              max: 0.65,
            },

            ease: "power3.inOut",
            inertia: false,
          },
        },
      });

      /*
       * COLLECTIONS HEADING
       */

      if (heading) {
        timeline.to(
          heading,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.3,
            ease: "power3.out",
          },
          0.15,
        );
      }

      /*
       * COLLECTION CARDS
       */

      if (cards.length > 0) {
        timeline.to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power3.out",
          },
          0.22,
        );
      }

      /*
       * COLLECTIONS FOOTER
       */

      if (footer) {
        timeline.to(
          footer,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.25,
            ease: "power2.out",
          },
          0.72,
        );
      }
    });

    // Calculate the correct pin and scroll positions.
    ScrollTrigger.refresh();

    return () => {
      context.revert();
    };
  }, []);

  return null;
}

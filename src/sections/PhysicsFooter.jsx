import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PhysicsFooter = () => {
  const footerRef = useRef(null);
  const containerRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const bodiesRef = useRef([]);

  // Track which object is hovered for correct inline styling
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  useEffect(() => {
    const { Engine, World, Bodies, Runner, Mouse, MouseConstraint, Body } = Matter;
    const footer = footerRef.current;
    const container = containerRef.current;
    const objects = [...container.querySelectorAll('.object')];

    const config = {
      gravity: 1,
      bounce: 1,
      frictionAir: 0.01,
      wallThickness: 100,
      dragStiffness: 0.1,
    };

    function createWalls(bounds, engine) {
      const wallOptions = { isStatic: true, restitution: config.bounce };
      const walls = [
        Bodies.rectangle(bounds.width / 2, bounds.height + config.wallThickness / 2, bounds.width, config.wallThickness, wallOptions),
        Bodies.rectangle(-config.wallThickness / 2, bounds.height / 2, config.wallThickness, bounds.height, wallOptions),
        Bodies.rectangle(bounds.width + config.wallThickness / 2, bounds.height / 2, config.wallThickness, bounds.height, wallOptions),
        Bodies.rectangle(bounds.width / 2, -config.wallThickness / 2, bounds.width, config.wallThickness, wallOptions),
      ];
      World.add(engine.world, walls);
    }

    function initPhysics() {
      const engine = Engine.create();
      engine.gravity.y = config.gravity;
      engineRef.current = engine;

      const runner = Runner.create();
      runnerRef.current = runner;

      World.clear(engine.world);
      Engine.clear(engine);

      const bounds = container.getBoundingClientRect();
      createWalls(bounds, engine);

      const bodies = objects.map(obj => {
        const rect = obj.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const x = Math.random() * bounds.width;
        const y = -Math.random() * 300 - height;
        const body = Bodies.rectangle(x, y, width, height, {
          restitution: config.bounce,
          frictionAir: config.frictionAir,
          density: 0.001,
          friction: 0.1,
        });
        World.add(engine.world, body);
        return { body, element: obj, width, height };
      });

      bodiesRef.current = bodies;

      const mouse = Mouse.create(container);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: config.dragStiffness },
        collisionFilter: { mask: 0x0001 },
      });
      World.add(engine.world, mouseConstraint);

      bodies.forEach(({ body, element }) => {
        element.addEventListener('mouseenter', () => {
          Body.applyForce(body, body.position, {
            x: (Math.random() - 0.5) * 0.1,
            y: -0.18 - Math.random() * 0.1,
          });
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.25);
        });
      });

      Runner.run(runner, engine);

      function update() {
        bodiesRef.current.forEach(({ body, element, width, height }) => {
          const paddingBuffer = 8;

          const minX = width / 2 + paddingBuffer;
          const maxX = container.clientWidth - width / 2 - paddingBuffer;
          if (body.position.x < minX) {
            Body.setPosition(body, { x: minX, y: body.position.y });
            Body.setVelocity(body, { x: 0, y: body.velocity.y });
          } else if (body.position.x > maxX) {
            Body.setPosition(body, { x: maxX, y: body.position.y });
            Body.setVelocity(body, { x: 0, y: body.velocity.y });
          }

          const minY = height / 2 + paddingBuffer;
          const maxY = container.clientHeight - height / 2 - paddingBuffer;
          if (body.position.y < minY) {
            Body.setPosition(body, { x: body.position.x, y: minY });
            Body.setVelocity(body, { x: body.velocity.x, y: 0 });
          } else if (body.position.y > maxY) {
            Body.setPosition(body, { x: body.position.x, y: maxY });
            Body.setVelocity(body, { x: body.velocity.x, y: 0 });
          }

          element.style.transform = `translate(${body.position.x - width / 2}px, ${body.position.y - height / 2}px) rotate(${body.angle}rad)`;
        });
        requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }

    ScrollTrigger.create({
      trigger: footer,
      start: 'top bottom',
      onEnter: () => {
        if (!engineRef.current) {
          initPhysics();
        }
      },
    });

    return () => {
      if (runnerRef.current && engineRef.current) {
        Matter.Runner.stop(runnerRef.current);
        Matter.World.clear(engineRef.current.world);
        Matter.Engine.clear(engineRef.current);
        runnerRef.current = null;
        engineRef.current = null;
        bodiesRef.current = [];
      }
    };
  }, []);

  const techs = ['HTML', 'CSS', 'Tailwind CSS', 'Javascript', 'React JS', 'Java', 'Python', 'GitHub'];

  return (
    <div
      ref={footerRef}
      style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        height: '30vh',
        width: '40vw',
        marginBottom: '2rem',
        marginRight: '2rem',
        maxWidth: '100vw',
        backgroundColor: 'black',
        color: 'white',
        borderRadius: 16,
        boxShadow: '0 0 20px #0008',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0.5rem 0',
        zIndex: 1000,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Small light text above objects */}
      <div style={{
        fontSize: '1.4rem',
        color: 'rgba(240, 240, 240, 0.3)',
        marginBottom: '0.35rem',
        marginRight: '1.5rem',
        userSelect: 'none',
        pointerEvents: 'none',
        fontWeight: '300',
        textAlign: 'end',
        width: '100%',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        letterSpacing: '0.05em',
      }}>
        Why list, When you can play..!
      </div>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          pointerEvents: 'auto',
        }}
      >
        {techs.map((text, idx) => (
          <div
            key={text}
            className="object"
            style={{
              position: 'absolute',
              background: 'white',
              color: '#222',
              height: '5rem',
              width: '8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              border: '2px solid #222',
              borderRadius: 20,
              cursor: 'grab',
              userSelect: 'none',
              fontWeight: '500',
              fontSize: '1.1rem',
              boxShadow:
                hoveredIndex === idx
                  ? '0 0 16px 4px rgba(66, 135, 245, 0.88)'
                  : '0 2px 6px rgba(0,0,0,0.3)',
              backgroundColor:
                hoveredIndex === idx
                  ? '#e6f0ff'
                  : 'white',
              willChange: 'transform',
              transition: 'box-shadow 0.3s, background-color 0.3s',
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(-1)}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhysicsFooter;

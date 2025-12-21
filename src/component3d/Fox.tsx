import React, { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useCharacterAnimations } from "../context/CharAnimation";
import gsap from "gsap";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const Fox = (props: JSX.IntrinsicElements["group"]) => {
  const redirectToURL = (url: string) => {
    window.open(url, "_blank");
  };
  const texture = useLoader(TextureLoader, "/link.svg");
  const group = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { nodes, materials, animations } = useGLTF("/model/fox1.gltf");

  const { actions, names } = useAnimations(animations || [], group);

  const { setAnimations, animationIndex, setAnimationIndex } =
    useCharacterAnimations();

  // useEffect(() => {
  //   let timeout: NodeJS.Timeout | null;

  //   if (animationIndex === 1) {
  //     actions[names[animationIndex]]?.reset().fadeIn(0.5).play();
  //     timeout = setTimeout(() => {
  //       actions[names[animationIndex]]?.fadeOut(0.5);
  //       setTimeout(() => {
  //         setAnimationIndex(4);
  //       }, 3000);
  //     }, 500);
  //   }

  //   // Cleanup function
  //   return () => {
  //     if (timeout) clearTimeout(timeout);
  //     actions[names[animationIndex]]?.fadeOut(0.5);
  //   };
  // }, [animationIndex, actions, names, setAnimationIndex]);

  useEffect(() => {
    setAnimations(names);
  }, [names, setAnimations]);
  useEffect(() => {
    if (actions && names) {
      actions[names[animationIndex]]?.reset().fadeIn(0.5).play();
    }
    return () => {
      if (actions && names) {
        actions[names[animationIndex]]?.fadeOut(0.5);
      }
    };
  }, [animationIndex, actions, names]);

  useEffect(() => {
    // let timeout: NodeJS.Timeout | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;


    if (group.current && animationIndex === 7) {
      const onCompleteHandler = () => {
        if (group.current) {
          gsap.to(group.current.rotation, { y: 0, z: 0, x: 0, duration: 0.5 });
          setTimeout(() => {
            setAnimationIndex(2);
          }, 150);
        }

        actions[names[animationIndex]]?.play();
        actions[names[animationIndex]]?.fadeOut(0.5);

        timeout = setTimeout(() => {
          actions[names[animationIndex]]?.fadeOut(1);
          setTimeout(() => {
            actions[names[animationIndex]]?.stop();
          }, 250);
        }, 500);

        return () => {
          if (timeout) clearTimeout(timeout);
          actions[names[animationIndex]]?.fadeOut(0.5);
        };
      };

      gsap.to(group.current.rotation, {
        y: Math.PI / 2,
        z: -Math.PI / 2,
        x: Math.PI / 2,
        duration: 0,
      });

      gsap.to(group.current.position, {
        x: 15,
        duration: 3,
        onComplete: onCompleteHandler as unknown as gsap.Callback,
      });
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      actions[names[animationIndex]]?.fadeOut(0.5);
    };
  }, [animationIndex, actions, names, setAnimationIndex]);


  useEffect(() => {
    // let timeout: NodeJS.Timeout | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (group.current && animationIndex === 5) {
      const onCompleteHandler = () => {
        if (group.current) {
          gsap.to(group.current.rotation, {
            y: 0,
            z: 0,
            x: 0,
            duration: 0.5,
          });
          setTimeout(() => {
            setAnimationIndex(4);

            if (meshRef.current) {
              gsap.to(meshRef.current.position, {
                y: 5,
                duration: 3.5,
                ease: "power1.out",
              });
            }
          }, 150);
        }

        actions[names[animationIndex]]?.play();
        actions[names[animationIndex]]?.fadeOut(0.5);

        timeout = setTimeout(() => {
          actions[names[animationIndex]]?.fadeOut(1);
          setTimeout(() => {
            actions[names[animationIndex]]?.stop();
          }, 250);
        }, 500);

        return () => {
          if (timeout) clearTimeout(timeout);

          if (actions[names[animationIndex]]) {
            actions[names[animationIndex]]?.fadeOut(0.5);
          }
        };
      };

      gsap.to(group.current.rotation, {
        y: Math.PI / 2,
        z: -Math.PI / 2,
        x: Math.PI / 2,
        duration: 0,
      });

      gsap.to(group.current.position, {
        x: 12.5,
        duration: 1,
        onComplete: onCompleteHandler as unknown as gsap.Callback,
      });
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      actions[names[animationIndex]]?.fadeOut(0.5);
    };
  }, [animationIndex, actions, names, setAnimationIndex]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    if (animationIndex === 2) {
      actions[names[animationIndex]]?.reset().fadeIn(0.5).play();
      timeout = setTimeout(() => {
        setAnimationIndex(4);
      }, 3000);
    } else {
      actions[names[animationIndex]]?.reset().fadeIn(0.5).play();
    }
    return () => {
      if (timeout) clearTimeout(timeout);
      actions[names[animationIndex]]?.fadeOut(0.5);
    };
  }, [animationIndex, actions, names, setAnimationIndex]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    if (animationIndex === 1) {
      actions[names[animationIndex]]?.reset().fadeIn(0.5).play();
      timeout = setTimeout(() => {
        setAnimationIndex(4);
      }, 3000);
    } else {
      actions[names[animationIndex]]?.reset().fadeIn(0.5).play();
    }
    return () => {
      if (timeout) clearTimeout(timeout);
      actions[names[animationIndex]]?.fadeOut(0.5);
    };
  }, [animationIndex, actions, names, setAnimationIndex]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    
    if (animationIndex === 0) {
      actions[names[animationIndex]]?.reset().fadeIn(0.5).play();
      timeout = setTimeout(() => {
        setAnimationIndex(4);
      }, 10000);
    } else {
      actions[names[animationIndex]]?.reset().fadeIn(0.5).play();
    }
    return () => {
      if (timeout) clearTimeout(timeout);
      actions[names[animationIndex]]?.fadeOut(0.5);
    };
  }, [animationIndex, actions, names, setAnimationIndex]);

  return (
    <>
      <mesh
        ref={meshRef}
        position={[15, 15, 0]}
        // transparent
        // envMapIntensity={2}
        onClick={() =>
          redirectToURL("https://youtu.be/Ab9s-6RbJMw?si=uaBsOOFGB-EcDCqo")
        }
      >
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial map={texture} transparent />
      </mesh>
      <group ref={group} {...props} dispose={null}>
        <group name="Scene">
          <group
            name="metarig"
            position={[-0.001, 0.126, 0.053]}
            rotation={[-0.048, 0.008, -0.001]}
          >
            <primitive object={nodes.spine} />
            <primitive object={nodes.IK} />
            <primitive object={nodes.neutral_bone} />
            <group name="Cube002">
              <skinnedMesh
                castShadow
                name="Cube002_1"
                geometry={(nodes.Cube002_1 as THREE.Mesh).geometry}
                material={materials.Base}
                skeleton={(nodes.Cube002_1 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                castShadow
                name="Cube002_2"
                geometry={(nodes.Cube002_2 as THREE.Mesh).geometry}
                material={materials["Material.001"]}
                skeleton={(nodes.Cube002_2 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                castShadow
                name="Cube002_3"
                geometry={(nodes.Cube002_3 as THREE.Mesh).geometry}
                material={materials["Material.003"]}
                skeleton={(nodes.Cube002_3 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                castShadow
                name="Cube002_4"
                geometry={(nodes.Cube002_4 as THREE.Mesh).geometry}
                material={materials["Material.002"]}
                skeleton={(nodes.Cube002_4 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                castShadow
                name="Cube002_5"
                geometry={(nodes.Cube002_5 as THREE.Mesh).geometry}
                material={materials.Mouth}
                skeleton={(nodes.Cube002_5 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                castShadow
                name="Cube002_6"
                geometry={(nodes.Cube002_6 as THREE.Mesh).geometry}
                material={materials["Material.004"]}
                skeleton={(nodes.Cube002_6 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                castShadow
                name="Cube002_7"
                geometry={(nodes.Cube002_7 as THREE.Mesh).geometry}
                material={materials["Material.005"]}
                skeleton={(nodes.Cube002_7 as THREE.SkinnedMesh).skeleton}
              />
              <skinnedMesh
                castShadow
                name="Cube002_8"
                geometry={(nodes.Cube002_8 as THREE.Mesh).geometry}
                material={materials["Material.006"]}
                skeleton={(nodes.Cube002_8 as THREE.SkinnedMesh).skeleton}
              />
            </group>
          </group>
        </group>
      </group>
    </>
  );
};
export default Fox;
useGLTF.preload("./model/fox1.gltf");

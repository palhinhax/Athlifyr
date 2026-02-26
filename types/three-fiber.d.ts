/**
 * Type augmentation for @react-three/fiber.
 *
 * Extends JSX.IntrinsicElements with Three.js elements such as
 * <group>, <mesh>, <ambientLight>, <directionalLight>, etc.
 *
 * @react-three/fiber v9 ships augmentations inside three-types.d.ts
 * but they are only applied when the package is referenced in the
 * compilation.  A top-level `import` turns this file into a module
 * (required for the re-export to work) and the side-effect import
 * pulls in the ambient module declarations.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { ThreeElements } from "@react-three/fiber";

declare module "react/jsx-runtime" {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface IntrinsicElements extends ThreeElements {}
  }
}

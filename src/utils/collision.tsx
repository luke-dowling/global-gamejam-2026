import { Sphere, Box3, Object3D } from "three";

export function isColliding(object1: Object3D, object2: Object3D): boolean {
  const box1 = new Box3().setFromObject(object1);
  const box2 = new Box3().setFromObject(object2);
  const sphere1 = new Sphere();
  const sphere2 = new Sphere();
  box1.getBoundingSphere(sphere1);
  box2.getBoundingSphere(sphere2);
  return sphere1.intersectsSphere(sphere2);
}

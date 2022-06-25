"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllParentsWithTheSameBoundingBox = getAllParentsWithTheSameBoundingBox;

function getAllParentsWithTheSameBoundingBox(fiber) {
  const parents = [fiber];

  if (fiber.stateNode === null) {
    return parents;
  }

  let currentFiber = fiber;

  while (currentFiber.return) {
    currentFiber = currentFiber.return;

    if (currentFiber.stateNode && currentFiber.stateNode.getBoundingClientRect) {
      const bbox = currentFiber.stateNode.getBoundingClientRect();

      if (bbox.x === fiber.stateNode.getBoundingClientRect().x && bbox.y === fiber.stateNode.getBoundingClientRect().y && bbox.width === fiber.stateNode.getBoundingClientRect().width && bbox.height === fiber.stateNode.getBoundingClientRect().height) {
        parents.push(currentFiber);
      } else {
        break;
      }
    }
  }

  return parents;
}
import test from 'node:test';
import assert from 'node:assert/strict';
import { outcomes, palettes, segmentCenter, targetRotation, indexAtRotation, randomIndex } from '../data.js';
test('All thirteen outcomes land under the top pointer after consecutive spins',()=>{
  assert.equal(outcomes.length,13);let rotation=0;
  for(let round=0;round<20;round++)for(let index=0;index<outcomes.length;index++){
    const next=targetRotation(rotation,index);assert.ok(next-rotation>=2160);assert.equal(indexAtRotation(next),index);rotation=next%360;
  }
});
test('Random selection always returns a valid outcome',()=>{for(let i=0;i<1000;i++){const value=randomIndex();assert.ok(Number.isInteger(value)&&value>=0&&value<outcomes.length);}});

test('All visual slice centers match the pointer and every theme has a palette', () => {
  for (let index=0; index<outcomes.length; index++) {
    const rotation=targetRotation(0,index);
    const remainder = (rotation + segmentCenter(index)) % 360;
    assert.ok(Math.min(remainder, 360 - remainder) < 1e-8);
  }
  assert.equal(Object.keys(palettes).length,3);
  for (const palette of Object.values(palettes)) assert.ok(palette.colors.length>=3);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { outcomes, targetRotation, indexAtRotation, randomIndex } from '../data.js';
test('All twelve outcomes land under the top pointer after consecutive spins',()=>{
  assert.equal(outcomes.length,12);let rotation=0;
  for(let round=0;round<20;round++)for(let index=0;index<12;index++){
    const next=targetRotation(rotation,index);assert.ok(next-rotation>=2160);assert.equal(indexAtRotation(next),index);rotation=next%360;
  }
});
test('Random selection always returns a valid outcome',()=>{for(let i=0;i<1000;i++){const value=randomIndex();assert.ok(Number.isInteger(value)&&value>=0&&value<12);}});

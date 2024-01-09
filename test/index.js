import {deepStrictEqual as eq} from 'assert';

import laws from 'fantasy-laws';
import jsc from 'jsverify';
import test from 'oletus';
import show from 'sanctuary-show';
import Z from 'sanctuary-type-classes';
import type from 'sanctuary-type-identifiers';
import Useless from 'sanctuary-useless';

import Identity from '../index.js';


//    IdentityArb :: Arbitrary a -> Arbitrary (Identity a)
const IdentityArb = arb => arb.smap (Identity, Z.extract, show);

//    NonEmpty :: Arbitrary a -> Arbitrary (NonEmpty a)
const NonEmpty = arb => jsc.suchthat (arb, x => not (empty (x)));

//    NumberArb :: Arbitrary Number
const NumberArb = jsc.oneof (
  jsc.constant (NaN),
  jsc.constant (-Infinity),
  jsc.constant (Number.MIN_SAFE_INTEGER),
  jsc.constant (-10000),
  jsc.constant (-9999),
  jsc.constant (-0.5),
  jsc.constant (-0),
  jsc.constant (0),
  jsc.constant (0.5),
  jsc.constant (9999),
  jsc.constant (10000),
  jsc.constant (Number.MAX_SAFE_INTEGER),
  jsc.constant (Infinity),
);

//    empty :: Monoid m => m -> Boolean
const empty = m => Z.equals (m, Z.empty (m.constructor));

//    not :: Boolean -> Boolean
const not = b => !b;

//    testLaws :: String -> Object -> Object -> Undefined
const testLaws = typeClass => laws => arbs => {
  (Object.keys (laws)).forEach (name => {
    eq (laws[name].length, arbs[name].length);
    const prettyName = name.replace (/[A-Z]/g, c => ' ' + c.toLowerCase ());
    test (`${typeClass} laws \x1B[2m›\x1B[0m ${prettyName}`,
          laws[name] (...arbs[name]));
  });
};


test ('metadata', () => {
  eq (typeof Identity, 'function');
  eq (Identity.name, 'Identity');
  eq (Identity.length, 1);
});

test ('@@type', () => {
  eq (type (Identity (0)), 'sanctuary-identity/Identity@1');
  eq (type.parse (type (Identity (0))),
      {namespace: 'sanctuary-identity', name: 'Identity', version: 1});
});

test ('@@show', () => {
  eq (show (Identity (['foo', 'bar', 'baz'])),
      'Identity (["foo", "bar", "baz"])');
  eq (show (Identity (Identity (Identity (-0)))),
      'Identity (Identity (Identity (-0)))');
});

test ('Setoid', () => {
  eq (Z.Setoid.test (Identity (Useless)), false);
  eq (Z.Setoid.test (Identity (/(?:)/)), true);
});

test ('Ord', () => {
  eq (Z.Ord.test (Identity (Useless)), false);
  eq (Z.Ord.test (Identity (/(?:)/)), false);
  eq (Z.Ord.test (Identity (0)), true);
});

test ('Semigroupoid', () => {
  eq (Z.Semigroupoid.test (Identity ([])), false);
});

test ('Category', () => {
  eq (Z.Category.test (Identity ([])), false);
});

test ('Semigroup', () => {
  eq (Z.Semigroup.test (Identity (Useless)), false);
  eq (Z.Semigroup.test (Identity (0)), false);
  eq (Z.Semigroup.test (Identity ([])), true);
});

test ('Monoid', () => {
  eq (Z.Monoid.test (Identity ([])), false);
});

test ('Group', () => {
  eq (Z.Group.test (Identity ([])), false);
});

test ('Filterable', () => {
  eq (Z.Filterable.test (Identity ([])), false);
});

test ('Functor', () => {
  eq (Z.Functor.test (Identity (Useless)), true);
});

test ('Bifunctor', () => {
  eq (Z.Bifunctor.test (Identity ([])), false);
});

test ('Profunctor', () => {
  eq (Z.Profunctor.test (Identity (Math.sqrt)), false);
});

test ('Apply', () => {
  eq (Z.Apply.test (Identity (Useless)), true);
});

test ('Applicative', () => {
  eq (Z.Applicative.test (Identity (Useless)), true);
});

test ('Chain', () => {
  eq (Z.Chain.test (Identity (Useless)), true);
});

test ('ChainRec', () => {
  eq (Z.ChainRec.test (Identity (Useless)), true);
});

test ('Monad', () => {
  eq (Z.Monad.test (Identity (Useless)), true);
});

test ('Alt', () => {
  eq (Z.Alt.test (Identity ([])), false);
});

test ('Plus', () => {
  eq (Z.Plus.test (Identity ([])), false);
});

test ('Alternative', () => {
  eq (Z.Alternative.test (Identity ([])), false);
});

test ('Foldable', () => {
  eq (Z.Foldable.test (Identity (Useless)), true);
});

test ('Traversable', () => {
  eq (Z.Traversable.test (Identity (Useless)), true);
});

test ('Extend', () => {
  eq (Z.Extend.test (Identity (Useless)), true);
});

test ('Comonad', () => {
  eq (Z.Comonad.test (Identity (Useless)), true);
});

test ('Contravariant', () => {
  eq (Z.Contravariant.test (Identity (Math.sqrt)), false);
});

testLaws ('Setoid') (laws.Setoid) ({
  reflexivity: [
    IdentityArb (NumberArb),
  ],
  symmetry: [
    IdentityArb (NumberArb),
    IdentityArb (NumberArb),
  ],
  transitivity: [
    IdentityArb (NumberArb),
    IdentityArb (NumberArb),
    IdentityArb (NumberArb),
  ],
});

testLaws ('Ord') (laws.Ord) ({
  totality: [
    IdentityArb (NumberArb),
    IdentityArb (NumberArb),
  ],
  antisymmetry: [
    IdentityArb (NumberArb),
    IdentityArb (NumberArb),
  ],
  transitivity: [
    IdentityArb (NumberArb),
    IdentityArb (NumberArb),
    IdentityArb (NumberArb),
  ],
});

testLaws ('Semigroup') (laws.Semigroup (Z.equals)) ({
  associativity: [
    IdentityArb (jsc.string),
    IdentityArb (jsc.string),
    IdentityArb (jsc.string),
  ],
});

testLaws ('Functor') (laws.Functor (Z.equals)) ({
  identity: [
    IdentityArb (NumberArb),
  ],
  composition: [
    IdentityArb (NumberArb),
    jsc.constant (Math.sqrt),
    jsc.constant (Math.abs),
  ],
});

testLaws ('Apply') (laws.Apply (Z.equals)) ({
  composition: [
    IdentityArb (jsc.constant (Math.sqrt)),
    IdentityArb (jsc.constant (Math.abs)),
    IdentityArb (NumberArb),
  ],
});

testLaws ('Applicative') (laws.Applicative (Z.equals, Identity)) ({
  identity: [
    IdentityArb (NumberArb),
  ],
  homomorphism: [
    jsc.constant (Math.abs),
    NumberArb,
  ],
  interchange: [
    IdentityArb (jsc.constant (Math.abs)),
    NumberArb,
  ],
});

testLaws ('Chain') (laws.Chain (Z.equals)) ({
  associativity: [
    IdentityArb (jsc.asciistring),
    jsc.constant (s => Identity (s.replace (/[A-Z]/g, ''))),
    jsc.constant (s => Identity (s.toUpperCase ())),
  ],
});

testLaws ('ChainRec') (laws.ChainRec (Z.equals, Identity)) ({
  equivalence: [
    jsc.constant (x => x >= 0),
    jsc.constant (x => Identity (x + 1)),
    jsc.constant (x => Identity (x * x)),
    jsc.integer,
  ],
});

testLaws ('Monad') (laws.Monad (Z.equals, Identity)) ({
  leftIdentity: [
    jsc.constant (x => Identity ([x, x])),
    IdentityArb (NumberArb),
  ],
  rightIdentity: [
    IdentityArb (NumberArb),
  ],
});

testLaws ('Foldable') (laws.Foldable (Z.equals)) ({
  associativity: [
    jsc.constant (Z.concat),
    jsc.string,
    IdentityArb (jsc.string),
  ],
});

testLaws ('Traversable') (laws.Traversable (Z.equals)) ({
  naturality: [
    jsc.constant (Array),
    jsc.constant (Identity),
    jsc.constant (xs => Identity (xs[0])),
    IdentityArb (NonEmpty (jsc.array (NumberArb))),
  ],
  identity: [
    jsc.constant (Array),
    IdentityArb (NumberArb),
  ],
  composition: [
    jsc.constant (Array),
    jsc.constant (Identity),
    IdentityArb (jsc.array (IdentityArb (NumberArb))),
  ],
});

testLaws ('Extend') (laws.Extend (Z.equals)) ({
  associativity: [
    IdentityArb (jsc.integer),
    jsc.constant (identity => Z.extract (identity) + 1),
    jsc.constant (identity => Math.pow (Z.extract (identity), 2)),
  ],
});

testLaws ('Comonad') (laws.Comonad (Z.equals)) ({
  leftIdentity: [
    IdentityArb (NumberArb),
  ],
  rightIdentity: [
    IdentityArb (NumberArb),
    jsc.constant (identity => Math.pow (Z.extract (identity), 2)),
  ],
});

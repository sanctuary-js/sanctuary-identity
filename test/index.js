'use strict';

const assert        = require ('assert');

const laws          = require ('fantasy-laws');
const jsc           = require ('jsverify');
const show          = require ('sanctuary-show');
const Z             = require ('sanctuary-type-classes');
const type          = require ('sanctuary-type-identifiers');
const Useless       = require ('sanctuary-useless');

const Identity      = require ('..');


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
  jsc.constant (Infinity)
);

//    empty :: Monoid m => m -> Boolean
const empty = m => Z.equals (m, Z.empty (m.constructor));

//    not :: Boolean -> Boolean
const not = b => !b;

//    testLaws :: Object -> Object -> Undefined
const testLaws = laws => arbs => {
  (Object.keys (laws)).forEach (name => {
    eq (laws[name].length) (arbs[name].length);
    test (name.replace (/[A-Z]/g, c => ' ' + c.toLowerCase ()),
          laws[name] (...arbs[name]));
  });
};

//    eq :: a -> b -> Undefined !
function eq(actual) {
  assert.strictEqual (arguments.length, eq.length);
  return function eq$1(expected) {
    assert.strictEqual (arguments.length, eq$1.length);
    assert.strictEqual (show (actual), show (expected));
    assert.strictEqual (Z.equals (actual, expected), true);
  };
}


suite ('Identity', () => {

  test ('metadata', () => {
    eq (typeof Identity) ('function');
    eq (Identity.name) ('Identity');
    eq (Identity.length) (1);
  });

  test ('@@type', () => {
    eq (type (Identity (0))) ('sanctuary-identity/Identity@1');
    eq (type.parse (type (Identity (0))))
       ({namespace: 'sanctuary-identity', name: 'Identity', version: 1});
  });

  test ('@@show', () => {
    eq (show (Identity (['foo', 'bar', 'baz'])))
       ('Identity (["foo", "bar", "baz"])');
    eq (show (Identity (Identity (Identity (-0)))))
       ('Identity (Identity (Identity (-0)))');
  });

});

suite ('type-class predicates', () => {

  test ('Setoid', () => {
    eq (Z.Setoid.test (Identity (Useless))) (false);
    eq (Z.Setoid.test (Identity (/(?:)/))) (true);
  });

  test ('Ord', () => {
    eq (Z.Ord.test (Identity (Useless))) (false);
    eq (Z.Ord.test (Identity (/(?:)/))) (false);
    eq (Z.Ord.test (Identity (0))) (true);
  });

  test ('Semigroupoid', () => {
    eq (Z.Semigroupoid.test (Identity ([]))) (false);
  });

  test ('Category', () => {
    eq (Z.Category.test (Identity ([]))) (false);
  });

  test ('Semigroup', () => {
    eq (Z.Semigroup.test (Identity (Useless))) (false);
    eq (Z.Semigroup.test (Identity (0))) (false);
    eq (Z.Semigroup.test (Identity ([]))) (true);
  });

  test ('Monoid', () => {
    eq (Z.Monoid.test (Identity ([]))) (false);
  });

  test ('Group', () => {
    eq (Z.Group.test (Identity ([]))) (false);
  });

  test ('Filterable', () => {
    eq (Z.Filterable.test (Identity ([]))) (false);
  });

  test ('Functor', () => {
    eq (Z.Functor.test (Identity (Useless))) (true);
  });

  test ('Bifunctor', () => {
    eq (Z.Bifunctor.test (Identity ([]))) (false);
  });

  test ('Profunctor', () => {
    eq (Z.Profunctor.test (Identity (Math.sqrt))) (false);
  });

  test ('Apply', () => {
    eq (Z.Apply.test (Identity (Useless))) (true);
  });

  test ('Applicative', () => {
    eq (Z.Applicative.test (Identity (Useless))) (true);
  });

  test ('Chain', () => {
    eq (Z.Chain.test (Identity (Useless))) (true);
  });

  test ('ChainRec', () => {
    eq (Z.ChainRec.test (Identity (Useless))) (true);
  });

  test ('Monad', () => {
    eq (Z.Monad.test (Identity (Useless))) (true);
  });

  test ('Alt', () => {
    eq (Z.Alt.test (Identity ([]))) (false);
  });

  test ('Plus', () => {
    eq (Z.Plus.test (Identity ([]))) (false);
  });

  test ('Alternative', () => {
    eq (Z.Alternative.test (Identity ([]))) (false);
  });

  test ('Foldable', () => {
    eq (Z.Foldable.test (Identity (Useless))) (true);
  });

  test ('Traversable', () => {
    eq (Z.Traversable.test (Identity (Useless))) (true);
  });

  test ('Extend', () => {
    eq (Z.Extend.test (Identity (Useless))) (true);
  });

  test ('Comonad', () => {
    eq (Z.Comonad.test (Identity (Useless))) (true);
  });

  test ('Contravariant', () => {
    eq (Z.Contravariant.test (Identity (Math.sqrt))) (false);
  });

});

suite ('Setoid laws', () => {
  testLaws (laws.Setoid) ({
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
});

suite ('Ord laws', () => {
  testLaws (laws.Ord) ({
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
});

suite ('Semigroup laws', () => {
  testLaws (laws.Semigroup (Z.equals)) ({
    associativity: [
      IdentityArb (jsc.string),
      IdentityArb (jsc.string),
      IdentityArb (jsc.string),
    ],
  });
});

suite ('Functor laws', () => {
  testLaws (laws.Functor (Z.equals)) ({
    identity: [
      IdentityArb (NumberArb),
    ],
    composition: [
      IdentityArb (NumberArb),
      jsc.constant (Math.sqrt),
      jsc.constant (Math.abs),
    ],
  });
});

suite ('Apply laws', () => {
  testLaws (laws.Apply (Z.equals)) ({
    composition: [
      IdentityArb (jsc.constant (Math.sqrt)),
      IdentityArb (jsc.constant (Math.abs)),
      IdentityArb (NumberArb),
    ],
  });
});

suite ('Applicative laws', () => {
  testLaws (laws.Applicative (Z.equals, Identity)) ({
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
});

suite ('Chain laws', () => {
  testLaws (laws.Chain (Z.equals)) ({
    associativity: [
      IdentityArb (jsc.asciistring),
      jsc.constant (s => Identity (s.replace (/[A-Z]/g, ''))),
      jsc.constant (s => Identity (s.toUpperCase ())),
    ],
  });
});

suite ('ChainRec laws', () => {
  testLaws (laws.ChainRec (Z.equals, Identity)) ({
    equivalence: [
      jsc.constant (x => x >= 0),
      jsc.constant (x => Identity (x + 1)),
      jsc.constant (x => Identity (x * x)),
      jsc.integer,
    ],
  });
});

suite ('Monad laws', () => {
  testLaws (laws.Monad (Z.equals, Identity)) ({
    leftIdentity: [
      jsc.constant (x => Identity ([x, x])),
      IdentityArb (NumberArb),
    ],
    rightIdentity: [
      IdentityArb (NumberArb),
    ],
  });
});

suite ('Foldable laws', () => {
  testLaws (laws.Foldable (Z.equals)) ({
    associativity: [
      jsc.constant (Z.concat),
      jsc.string,
      IdentityArb (jsc.string),
    ],
  });
});

suite ('Traversable laws', () => {
  testLaws (laws.Traversable (Z.equals)) ({
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
});

suite ('Extend laws', () => {
  testLaws (laws.Extend (Z.equals)) ({
    associativity: [
      IdentityArb (jsc.integer),
      jsc.constant (identity => Z.extract (identity) + 1),
      jsc.constant (identity => Math.pow (Z.extract (identity), 2)),
    ],
  });
});

suite ('Comonad laws', () => {
  testLaws (laws.Comonad (Z.equals)) ({
    leftIdentity: [
      IdentityArb (NumberArb),
    ],
    rightIdentity: [
      IdentityArb (NumberArb),
      jsc.constant (identity => Math.pow (Z.extract (identity), 2)),
    ],
  });
});

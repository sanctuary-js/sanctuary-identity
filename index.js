/*             ___________________
              /                  /\
             /                  /  \
            /_____       ______/   /
            \    /      /\     \  /
             \__/      /  \_____\/
               /      /   /
              /      /   /
       ______/      /___/_
      /                  /\
     /                  /  \
    /__________________/   /
    \                  \  /
     \__________________*/

//. <a href="https://github.com/fantasyland/fantasy-land"><img alt="Fantasy Land" src="https://raw.githubusercontent.com/fantasyland/fantasy-land/master/logo.png" width="75" height="75" align="left"></a>
//.
//. # sanctuary-identity
//.
//. Identity is the simplest container type: a value of type `Identity a`
//. always contains exactly one value, of type `a`.

(function(f) {

  'use strict';

  var util = {inspect: {}};

  /* istanbul ignore else */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f (require ('util'),
                        require ('sanctuary-show'),
                        require ('sanctuary-type-classes'));
  } else if (typeof define === 'function' && define.amd != null) {
    define (['sanctuary-show', 'sanctuary-type-classes'], function(show, Z) {
      return f (util, show, Z);
    });
  } else {
    self.sanctuaryIdentity = f (util,
                                self.sanctuaryShow,
                                self.sanctuaryTypeClasses);
  }

} (function(util, show, Z) {

  'use strict';

  /* istanbul ignore if */
  if (typeof __doctest !== 'undefined') {
    var $ = __doctest.require ('sanctuary-def');
    var type = __doctest.require ('sanctuary-type-identifiers');
    var S = (function() {
      var S = __doctest.require ('sanctuary');
      var IdentityType = $.UnaryType
        ('sanctuary-identity/Identity')
        ('')
        (function(x) { return type (x) === Identity['@@type']; })
        (function(i) { return [i.value]; });
      var env = Z.concat (S.env, [$.TypeClass, IdentityType ($.Unknown)]);
      return S.create ({checkTypes: true, env: env});
    } ());
  }

  var prototype = {
    /* eslint-disable key-spacing */
    'constructor':            Identity,
    '@@show':                 Identity$prototype$show,
    'fantasy-land/map':       Identity$prototype$map,
    'fantasy-land/ap':        Identity$prototype$ap,
    'fantasy-land/chain':     Identity$prototype$chain,
    'fantasy-land/reduce':    Identity$prototype$reduce,
    'fantasy-land/traverse':  Identity$prototype$traverse,
    'fantasy-land/extend':    Identity$prototype$extend,
    'fantasy-land/extract':   Identity$prototype$extract
    /* eslint-enable key-spacing */
  };

  var custom = util.inspect.custom;
  /* istanbul ignore else */
  if (typeof custom === 'symbol') {
    prototype[custom] = Identity$prototype$show;
  } else {
    prototype.inspect = Identity$prototype$show;
  }

  //. `Identity a` satisfies the following [Fantasy Land][] specifications:
  //.
  //. ```javascript
  //. > const Useless = require ('sanctuary-useless')
  //.
  //. > S.map (k => k + ' '.repeat (16 - k.length) +
  //. .             (Z[k].test (Identity (Useless)) ? '\u2705   ' :
  //. .              Z[k].test (Identity (['foo'])) ? '\u2705 * ' :
  //. .              /* otherwise */                  '\u274C   '))
  //. .       (S.keys (Z.filter ($.test ([]) ($.TypeClass), Z)))
  //. [ 'Setoid          ✅ * ',  // if ‘a’ satisfies Setoid
  //. . 'Ord             ✅ * ',  // if ‘a’ satisfies Ord
  //. . 'Semigroupoid    ❌   ',
  //. . 'Category        ❌   ',
  //. . 'Semigroup       ✅ * ',  // if ‘a’ satisfies Semigroup
  //. . 'Monoid          ❌   ',
  //. . 'Group           ❌   ',
  //. . 'Filterable      ❌   ',
  //. . 'Functor         ✅   ',
  //. . 'Bifunctor       ❌   ',
  //. . 'Profunctor      ❌   ',
  //. . 'Apply           ✅   ',
  //. . 'Applicative     ✅   ',
  //. . 'Chain           ✅   ',
  //. . 'ChainRec        ✅   ',
  //. . 'Monad           ✅   ',
  //. . 'Alt             ❌   ',
  //. . 'Plus            ❌   ',
  //. . 'Alternative     ❌   ',
  //. . 'Foldable        ✅   ',
  //. . 'Traversable     ✅   ',
  //. . 'Extend          ✅   ',
  //. . 'Comonad         ✅   ',
  //. . 'Contravariant   ❌   ' ]
  //. ```

  //# Identity :: a -> Identity a
  //.
  //. Identity's sole data constructor. Additionally, it serves as the
  //. Identity [type representative][].
  //.
  //. ```javascript
  //. > Identity (42)
  //. Identity (42)
  //. ```
  function Identity(value) {
    var identity = Object.create (prototype);
    if (Z.Setoid.test (value)) {
      identity['fantasy-land/equals'] = Identity$prototype$equals;
      if (Z.Ord.test (value)) {
        identity['fantasy-land/lte'] = Identity$prototype$lte;
      }
    }
    if (Z.Semigroup.test (value)) {
      identity['fantasy-land/concat'] = Identity$prototype$concat;
    }
    identity.value = value;
    return identity;
  }

  //# Identity.@@type :: String
  //.
  //. Identity [type identifier][].
  //.
  //. ```javascript
  //. > type (Identity (42))
  //. 'sanctuary-identity/Identity@1'
  //.
  //. > type.parse (type (Identity (42)))
  //. {namespace: 'sanctuary-identity', name: 'Identity', version: 1}
  //. ```
  Identity['@@type'] = 'sanctuary-identity/Identity@1';

  //# Identity.fantasy-land/of :: a -> Identity a
  //.
  //. `of (Identity) (x)` is equivalent to `Identity (x)`.
  //.
  //. ```javascript
  //. > S.of (Identity) (42)
  //. Identity (42)
  //. ```
  Identity['fantasy-land/of'] = Identity;

  function next(x) { return {tag: next, value: x}; }
  function done(x) { return {tag: done, value: x}; }

  //# Identity.fantasy-land/chainRec :: ((a -> c, b -> c, a) -> Identity c, a) -> Identity b
  //.
  //. ```javascript
  //. > Z.chainRec (
  //. .   Identity,
  //. .   (next, done, x) => Identity (x >= 0 ? done (x * x) : next (x + 1)),
  //. .   8
  //. . )
  //. Identity (64)
  //.
  //. > Z.chainRec (
  //. .   Identity,
  //. .   (next, done, x) => Identity (x >= 0 ? done (x * x) : next (x + 1)),
  //. .   -8
  //. . )
  //. Identity (0)
  //. ```
  Identity['fantasy-land/chainRec'] = function(f, x) {
    var r = next (x);
    while (r.tag === next) r = (f (next, done, r.value)).value;
    return Identity (r.value);
  };

  //# Identity#@@show :: Showable a => Identity a ~> () -> String
  //.
  //. `show (Identity (x))` is equivalent to `'Identity (' + show (x) + ')'`.
  //.
  //. ```javascript
  //. > show (Identity (['foo', 'bar', 'baz']))
  //. 'Identity (["foo", "bar", "baz"])'
  //. ```
  function Identity$prototype$show() {
    return 'Identity (' + show (this.value) + ')';
  }

  //# Identity#fantasy-land/equals :: Setoid a => Identity a ~> Identity a -> Boolean
  //.
  //. `Identity (x)` is equal to `Identity (y)` [iff][] `x` is equal to `y`
  //. according to [`Z.equals`][].
  //.
  //. ```javascript
  //. > S.equals (Identity ([1, 2, 3])) (Identity ([1, 2, 3]))
  //. true
  //.
  //. > S.equals (Identity ([1, 2, 3])) (Identity ([3, 2, 1]))
  //. false
  //. ```
  function Identity$prototype$equals(other) {
    return Z.equals (this.value, other.value);
  }

  //# Identity#fantasy-land/lte :: Ord a => Identity a ~> Identity a -> Boolean
  //.
  //. `Identity (x)` is less than or equal to `Identity (y)` [iff][] `x` is
  //. less than or equal to `y` according to [`Z.lte`][].
  //.
  //. ```javascript
  //. > S.filter (S.lte (Identity (1)))
  //. .          ([Identity (0), Identity (1), Identity (2)])
  //. [Identity (0), Identity (1)]
  //. ```
  function Identity$prototype$lte(other) {
    return Z.lte (this.value, other.value);
  }

  //# Identity#fantasy-land/concat :: Semigroup a => Identity a ~> Identity a -> Identity a
  //.
  //. `concat (Identity (x)) (Identity (y))` is equivalent to
  //. `Identity (concat (x) (y))`.
  //.
  //. ```javascript
  //. > S.concat (Identity ([1, 2, 3])) (Identity ([4, 5, 6]))
  //. Identity ([1, 2, 3, 4, 5, 6])
  //. ```
  function Identity$prototype$concat(other) {
    return Identity (Z.concat (this.value, other.value));
  }

  //# Identity#fantasy-land/map :: Identity a ~> (a -> b) -> Identity b
  //.
  //. `map (f) (Identity (x))` is equivalent to `Identity (f (x))`.
  //.
  //. ```javascript
  //. > S.map (Math.sqrt) (Identity (64))
  //. Identity (8)
  //. ```
  function Identity$prototype$map(f) {
    return Identity (f (this.value));
  }

  //# Identity#fantasy-land/ap :: Identity a ~> Identity (a -> b) -> Identity b
  //.
  //. `ap (Identity (f)) (Identity (x))` is equivalent to `Identity (f (x))`.
  //.
  //. ```javascript
  //. > S.ap (Identity (Math.sqrt)) (Identity (64))
  //. Identity (8)
  //. ```
  function Identity$prototype$ap(other) {
    return Identity (other.value (this.value));
  }

  //# Identity#fantasy-land/chain :: Identity a ~> (a -> Identity b) -> Identity b
  //.
  //. `chain (f) (Identity (x))` is equivalent to `f (x)`.
  //.
  //. ```javascript
  //. > S.chain (n => Identity (n + 1)) (Identity (99))
  //. Identity (100)
  //. ```
  function Identity$prototype$chain(f) {
    return f (this.value);
  }

  //# Identity#fantasy-land/reduce :: Identity a ~> ((b, a) -> b, b) -> b
  //.
  //. `reduce (f) (x) (Identity (y))` is equivalent to `f (x) (y)`.
  //.
  //. ```javascript
  //. > S.reduce (S.concat) ([1, 2, 3]) (Identity ([4, 5, 6]))
  //. [1, 2, 3, 4, 5, 6]
  //. ```
  function Identity$prototype$reduce(f, x) {
    return f (x, this.value);
  }

  //# Identity#fantasy-land/traverse :: Applicative f => Identity a ~> (TypeRep f, a -> f b) -> f (Identity b)
  //.
  //. `traverse (_) (f) (Identity (x))` is equivalent to
  //. `map (Identity) (f (x))`.
  //.
  //. ```javascript
  //. > S.traverse (Array) (x => [x + 1, x + 2, x + 3]) (Identity (100))
  //. [Identity (101), Identity (102), Identity (103)]
  //. ```
  function Identity$prototype$traverse(typeRep, f) {
    return Z.map (Identity, f (this.value));
  }

  //# Identity#fantasy-land/extend :: Identity a ~> (Identity a -> b) -> Identity b
  //.
  //. `extend (f) (Identity (x))` is equivalent to
  //. `Identity (f (Identity (x)))`.
  //.
  //. ```javascript
  //. > S.extend (S.reduce (S.add) (1)) (Identity (99))
  //. Identity (100)
  //. ```
  function Identity$prototype$extend(f) {
    return Identity (f (this));
  }

  //# Identity#fantasy-land/extract :: Identity a ~> () -> a
  //.
  //. `extract (Identity (x))` is equivalent to `x`.
  //.
  //. ```javascript
  //. > S.extract (Identity (42))
  //. 42
  //. ```
  function Identity$prototype$extract() {
    return this.value;
  }

  return Identity;

}));

//. [Fantasy Land]:             v:fantasyland/fantasy-land
//. [`Z.equals`]:               v:sanctuary-js/sanctuary-type-classes#equals
//. [`Z.lte`]:                  v:sanctuary-js/sanctuary-type-classes#lte
//. [iff]:                      https://en.wikipedia.org/wiki/If_and_only_if
//. [type identifier]:          v:sanctuary-js/sanctuary-type-identifiers
//. [type representative]:      v:fantasyland/fantasy-land#type-representatives

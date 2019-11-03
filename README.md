<a href="https://github.com/fantasyland/fantasy-land"><img alt="Fantasy Land" src="https://raw.githubusercontent.com/fantasyland/fantasy-land/master/logo.png" width="75" height="75" align="left"></a>

# sanctuary-identity

Identity is the simplest container type: a value of type `Identity a`
always contains exactly one value, of type `a`.

`Identity a` satisfies the following [Fantasy Land][] specifications:

```javascript
> const Useless = require ('sanctuary-useless')

> const isTypeClass = x =>
.   type (x) === 'sanctuary-type-classes/TypeClass@1'

> S.map (k => k + ' '.repeat (16 - k.length) +
.             (Z[k].test (Identity (Useless)) ? '\u2705   ' :
.              Z[k].test (Identity (['foo'])) ? '\u2705 * ' :
.              /* otherwise */                  '\u274C   '))
.       (S.keys (S.unchecked.filter (isTypeClass) (Z)))
[ 'Setoid          ✅ * ',  // if ‘a’ satisfies Setoid
. 'Ord             ✅ * ',  // if ‘a’ satisfies Ord
. 'Semigroupoid    ❌   ',
. 'Category        ❌   ',
. 'Semigroup       ✅ * ',  // if ‘a’ satisfies Semigroup
. 'Monoid          ❌   ',
. 'Group           ❌   ',
. 'Filterable      ❌   ',
. 'Functor         ✅   ',
. 'Bifunctor       ❌   ',
. 'Profunctor      ❌   ',
. 'Apply           ✅   ',
. 'Applicative     ✅   ',
. 'Chain           ✅   ',
. 'ChainRec        ✅   ',
. 'Monad           ✅   ',
. 'Alt             ❌   ',
. 'Plus            ❌   ',
. 'Alternative     ❌   ',
. 'Foldable        ✅   ',
. 'Traversable     ✅   ',
. 'Extend          ✅   ',
. 'Comonad         ✅   ',
. 'Contravariant   ❌   ' ]
```

#### <a name="Identity" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L121">`Identity :: a -⁠> Identity a`</a>

Identity's sole data constructor. Additionally, it serves as the
Identity [type representative][].

```javascript
> Identity (42)
Identity (42)
```

#### <a name="Identity.fantasy-land/of" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L145">`Identity.fantasy-land/of :: a -⁠> Identity a`</a>

`of (Identity) (x)` is equivalent to `Identity (x)`.

```javascript
> S.of (Identity) (42)
Identity (42)
```

#### <a name="Identity.fantasy-land/chainRec" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L158">`Identity.fantasy-land/chainRec :: ((a -⁠> c, b -⁠> c, a) -⁠> Identity c, a) -⁠> Identity b`</a>

```javascript
> Z.chainRec (
.   Identity,
.   (next, done, x) => Identity (x >= 0 ? done (x * x) : next (x + 1)),
.   8
. )
Identity (64)

> Z.chainRec (
.   Identity,
.   (next, done, x) => Identity (x >= 0 ? done (x * x) : next (x + 1)),
.   -8
. )
Identity (0)
```

#### <a name="Identity.prototype.@@show" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L181">`Identity#@@show :: Showable a => Identity a ~> () -⁠> String`</a>

`show (Identity (x))` is equivalent to `'Identity (' + show (x) + ')'`.

```javascript
> show (Identity (['foo', 'bar', 'baz']))
'Identity (["foo", "bar", "baz"])'
```

#### <a name="Identity.prototype.fantasy-land/equals" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L193">`Identity#fantasy-land/equals :: Setoid a => Identity a ~> Identity a -⁠> Boolean`</a>

`Identity (x)` is equal to `Identity (y)` [iff][] `x` is equal to `y`
according to [`Z.equals`][].

```javascript
> S.equals (Identity ([1, 2, 3])) (Identity ([1, 2, 3]))
true

> S.equals (Identity ([1, 2, 3])) (Identity ([3, 2, 1]))
false
```

#### <a name="Identity.prototype.fantasy-land/lte" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L209">`Identity#fantasy-land/lte :: Ord a => Identity a ~> Identity a -⁠> Boolean`</a>

`Identity (x)` is less than or equal to `Identity (y)` [iff][] `x` is
less than or equal to `y` according to [`Z.lte`][].

```javascript
> S.filter (S.lte (Identity (1)))
.          ([Identity (0), Identity (1), Identity (2)])
[Identity (0), Identity (1)]
```

#### <a name="Identity.prototype.fantasy-land/concat" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L223">`Identity#fantasy-land/concat :: Semigroup a => Identity a ~> Identity a -⁠> Identity a`</a>

`concat (Identity (x)) (Identity (y))` is equivalent to
`Identity (concat (x) (y))`.

```javascript
> S.concat (Identity ([1, 2, 3])) (Identity ([4, 5, 6]))
Identity ([1, 2, 3, 4, 5, 6])
```

#### <a name="Identity.prototype.fantasy-land/map" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L236">`Identity#fantasy-land/map :: Identity a ~> (a -⁠> b) -⁠> Identity b`</a>

`map (f) (Identity (x))` is equivalent to `Identity (f (x))`.

```javascript
> S.map (Math.sqrt) (Identity (64))
Identity (8)
```

#### <a name="Identity.prototype.fantasy-land/ap" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L248">`Identity#fantasy-land/ap :: Identity a ~> Identity (a -⁠> b) -⁠> Identity b`</a>

`ap (Identity (f)) (Identity (x))` is equivalent to `Identity (f (x))`.

```javascript
> S.ap (Identity (Math.sqrt)) (Identity (64))
Identity (8)
```

#### <a name="Identity.prototype.fantasy-land/chain" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L260">`Identity#fantasy-land/chain :: Identity a ~> (a -⁠> Identity b) -⁠> Identity b`</a>

`chain (f) (Identity (x))` is equivalent to `f (x)`.

```javascript
> S.chain (n => Identity (n + 1)) (Identity (99))
Identity (100)
```

#### <a name="Identity.prototype.fantasy-land/reduce" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L272">`Identity#fantasy-land/reduce :: Identity a ~> ((b, a) -⁠> b, b) -⁠> b`</a>

`reduce (f) (x) (Identity (y))` is equivalent to `f (x) (y)`.

```javascript
> S.reduce (S.concat) ([1, 2, 3]) (Identity ([4, 5, 6]))
[1, 2, 3, 4, 5, 6]
```

#### <a name="Identity.prototype.fantasy-land/traverse" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L284">`Identity#fantasy-land/traverse :: Applicative f => Identity a ~> (TypeRep f, a -⁠> f b) -⁠> f (Identity b)`</a>

`traverse (_) (f) (Identity (x))` is equivalent to
`map (Identity) (f (x))`.

```javascript
> S.traverse (Array) (x => [x + 1, x + 2, x + 3]) (Identity (100))
[Identity (101), Identity (102), Identity (103)]
```

#### <a name="Identity.prototype.fantasy-land/extend" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L297">`Identity#fantasy-land/extend :: Identity a ~> (Identity a -⁠> b) -⁠> Identity b`</a>

`extend (f) (Identity (x))` is equivalent to
`Identity (f (Identity (x)))`.

```javascript
> S.extend (S.reduce (S.add) (1)) (Identity (99))
Identity (100)
```

#### <a name="Identity.prototype.fantasy-land/extract" href="https://github.com/sanctuary-js/sanctuary-identity/blob/v2.0.0/index.js#L310">`Identity#fantasy-land/extract :: Identity a ~> () -⁠> a`</a>

`extract (Identity (x))` is equivalent to `x`.

```javascript
> S.extract (Identity (42))
42
```

[Fantasy Land]:             https://github.com/fantasyland/fantasy-land/tree/v4.0.1
[`Z.equals`]:               https://github.com/sanctuary-js/sanctuary-type-classes/tree/v12.0.0#equals
[`Z.lte`]:                  https://github.com/sanctuary-js/sanctuary-type-classes/tree/v12.0.0#lte
[iff]:                      https://en.wikipedia.org/wiki/If_and_only_if
[type representative]:      https://github.com/fantasyland/fantasy-land/tree/v4.0.1#type-representatives

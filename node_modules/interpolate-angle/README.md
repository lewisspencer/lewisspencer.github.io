# interpolate-angle

![](screenshot.png)

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Linear interpolation between two angles along the shorter arc

## Usage

[![NPM](https://nodei.co/npm/interpolate-angle.png)](https://www.npmjs.com/package/interpolate-angle)

#### interpolateAngle(from, to, t)

Parameters:  
`from` - angle in radians 0..2PI  
`to` - angle in radians 0..2PI  
`t` - interpolation ratio 0..1

```javascript
var interpolateAngle = require('interpolate-angle');

interpolateAngle(0, 2 * Math.PI, 0.5) //-> PI
interpolateAngle(-Math.PI/6, Math.PI/6, 0.5) //-> 0
interpolateAngle(Math.PI*5/3, Math.PI/3, 0.25) //-> -1/6 PI
```

## License

MIT, see [LICENSE.md](http://github.com/vorg/interpolate-angle/blob/master/LICENSE.md) for details.

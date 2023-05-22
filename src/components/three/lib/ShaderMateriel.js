import * as THREE from 'three'
const loader = new THREE.TextureLoader();
export const WaterShader = {
  vertexShader:`
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader:`
    #include <common>
    uniform vec3 iResolution;
    uniform float iTime;

    // by David Hoskins.
    // Original water turbulence effect by joltz0r
    // Redefine below to see the tiling...
    //#define SHOW_TILING
    #define TAU 6.28318530718
    #define MAX_ITER 5
    void mainImage(out vec4 gl_FragColor, in vec2 fragCoord) 
    {
        float time = iTime * .5+23.0;
        // uv should be the 0-1 uv of texture...
        vec2 uv = fragCoord.xy / iResolution.xy;
        
    #ifdef SHOW_TILING
        vec2 p = mod(uv*TAU*2.0, TAU)-250.0;
    #else
        vec2 p = mod(uv*TAU, TAU)-250.0;
    #endif
        vec2 i = vec2(p);
        float c = 1.0;
        float inten = .005;
        for (int n = 0; n < MAX_ITER; n++) 
        {
            float t = time * (1.0 - (3.5 / float(n+1)));
            i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
            c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),p.y / (cos(i.y+t)/inten)));
        }
        c /= float(MAX_ITER);
        c = 1.17-pow(c, 1.4);
        vec3 colour = vec3(pow(abs(c), 8.0));
        colour = clamp(colour + vec3(0.0, 0.35, 0.5), 0.0, 1.0);
        #ifdef SHOW_TILING
        // Flash tile borders...
        vec2 pixel = 2.0 / iResolution.xy;
        uv *= 2.0;
        float f = floor(mod(iTime*.5, 2.0)); 	// Flash value.
        vec2 first = step(pixel, uv) * f;		   	// Rule out first screen pixels and flash.
        uv  = step(fract(uv), pixel);				// Add one line of pixels per tile.
        colour = mix(colour, vec3(1.0, 1.0, 0.0), (uv.x + uv.y) * first.x * first.y); // Yellow line
        #endif
        
        gl_FragColor = vec4(colour, 1.0);
    }
    varying vec2 vUv;
    void main() {
        mainImage(gl_FragColor, vUv * iResolution.xy);
    }
  `,
  uniforms:{
    iResolution:{
      value:new THREE.Vector3(1,1,1)
    },
    iTime:{
      value: 0.0
    },
  }
}

export const CustomShader = {
  vertexShader:`
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader:`
    uniform float iTime;
    uniform vec3 iResolution; // 视口分辨率（像素）
    varying vec2 vUv; //顶点着色器传递uv坐标给片元着色器。
  

    #define t iTime
    #define r iResolution.xy

    void main(){
      vec3 c;
      float l,z=t;
      for(int i=0;i<3;i++) {
        vec2 uv,p=vUv.xy/r;
        uv=p;
        p-=.5;
        p.x*=r.x/r.y;
        z+=.07;
        l=length(p);
        uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
        c[i]=.01/length(mod(uv,1.)-.5);
      }
      gl_FragColor=vec4(c/l,t);
    }

  `,
  uniforms:{
    iResolution:{
      value:new THREE.Vector3(1,1,1)
    },
    iTime:{
      value: 0.0
    },
  }
}
export const FireShader = {
  uniforms:{
    iResolution:{
      value:new THREE.Vector3(1,1,1)
    },
    iTime:{
      value: 0.0
    },
  },
  vertexShader:`
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader:`
    varying vec2 vUv;
    uniform vec3 iResolution;
    uniform float iTime;

    float noise(vec3 p) //Thx to Las^Mercury
    {
      vec3 i = floor(p);
      vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
      vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;
      a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
      a.xy = mix(a.xz, a.yw, f.y);
      return mix(a.x, a.y, f.z);
    }
    
    float sphere(vec3 p, vec4 spr)
    {
      return length(spr.xyz-p) - spr.w;
    }
    
    float flame(vec3 p)
    {
      float d = sphere(p*vec3(1.,.5,1.), vec4(.0,-1.,.0,1.));
      return d + (noise(p+vec3(.0,iTime*2.,.0)) + noise(p*3.)*.5)*.25*(p.y) ;
    }
    
    float scene(vec3 p)
    {
      return min(100.-length(p) , abs(flame(p)) );
    }
    
    vec4 raymarch(vec3 org, vec3 dir)
    {
      float d = 0.0, glow = 0.0, eps = 0.02;
      vec3  p = org;
      bool glowed = false;
      
      for(int i=0; i<64; i++)
      {
        d = scene(p) + eps;
        p += d * dir;
        if( d>eps )
        {
          if(flame(p) < .0)
            glowed=true;
          if(glowed)
                glow = float(i)/64.;
        }
      }
      return vec4(p,glow);
    }
    
    void main()
    {
      vec2 v = -1.0 + 2.0 * vUv.xy / iResolution.xy;
      v.x *= iResolution.x/iResolution.y;
      
      vec3 org = vec3(0., -2., 4.);
      vec3 dir = normalize(vec3(v.x*1.6, -v.y, -1.5));
      
      vec4 p = raymarch(org, dir);
      float glow = p.w;
      
      vec4 col = mix(vec4(1.,.5,.1,1.), vec4(0.1,.5,1.,1.), p.y*.02+.4);
      
      gl_FragColor = mix(vec4(0.), col, pow(glow*2.,4.));
      //gl_FragColor = mix(vec4(1.), mix(vec4(1.,.5,.1,1.),vec4(0.1,.5,1.,1.),p.y*.02+.4), pow(glow*2.,4.));
    
    }
  `
}

export const FireShader2 = {
  uniforms:{
    iResolution:{
      value:new THREE.Vector3(1,1,1)
    },
    iTime:{
      value: 0.0
    },
    iMouse:{
      value:new THREE.Vector3()
    },
  },
  vertexShader:`
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader:`
    varying vec2 vUv;
    uniform vec3 iResolution;
    uniform float iTime;
    uniform vec4 iMouse;

    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v)
      { 
      const vec2	C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4	D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // First corner
      vec3 i	= floor(v + dot(v, C.yyy) );
      vec3 x0 =	 v - i + dot(i, C.xxx) ;
    
    // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
    
      //	 x0 = x0 - 0.0 + 0.0 * C.xxx;
      //	 x1 = x0 - i1	+ 1.0 * C.xxx;
      //	 x2 = x0 - i2	+ 2.0 * C.xxx;
      //	 x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;			// -1.0+3.0*C.x = -0.5 = -D.y
    
    // Permutations
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    
    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3	ns = n_ * D.wyz - D.xzx;
    
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);	//	mod(p,7*7)
    
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );		// mod(j,N)
    
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
    
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
    
      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
    
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
    
    //Normalise gradients
      //vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
    
    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
      }
    
    //////////////////////////////////////////////////////////////
    
    // PRNG
    // From https://www.shadertoy.com/view/4djSRW
    float prng(in vec2 seed) {
      seed = fract (seed * vec2 (5.3983, 5.4427));
      seed += dot (seed.yx, seed.xy + vec2 (21.5351, 14.3137));
      return fract (seed.x * seed.y * 95.4337);
    }
    
    //////////////////////////////////////////////////////////////
    
    float PI = 3.1415926535897932384626433832795;
    
    float noiseStack(vec3 pos,int octaves,float falloff){
      float noise = snoise(vec3(pos));
      float off = 1.0;
      if (octaves>1) {
        pos *= 2.0;
        off *= falloff;
        noise = (1.0-off)*noise + off*snoise(vec3(pos));
      }
      if (octaves>2) {
        pos *= 2.0;
        off *= falloff;
        noise = (1.0-off)*noise + off*snoise(vec3(pos));
      }
      if (octaves>3) {
        pos *= 2.0;
        off *= falloff;
        noise = (1.0-off)*noise + off*snoise(vec3(pos));
      }
      return (1.0+noise)/2.0;
    }
    
    vec2 noiseStackUV(vec3 pos,int octaves,float falloff,float diff){
      float displaceA = noiseStack(pos,octaves,falloff);
      float displaceB = noiseStack(pos+vec3(3984.293,423.21,5235.19),octaves,falloff);
      return vec2(displaceA,displaceB);
    }
    
    void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
        float time = iTime;
        vec2 resolution = iResolution.xy;
      vec2 drag = iMouse.xy;
      vec2 offset = iMouse.xy;
        //
      float xpart = fragCoord.x/resolution.x;
      float ypart = fragCoord.y/resolution.y;
      //
      float clip = 210.0;
      float ypartClip = fragCoord.y/clip;
      float ypartClippedFalloff = clamp(2.0-ypartClip,0.0,1.0);
      float ypartClipped = min(ypartClip,1.0);
      float ypartClippedn = 1.0-ypartClipped;
      //
      float xfuel = 1.0-abs(2.0*xpart-1.0);//pow(1.0-abs(2.0*xpart-1.0),0.5);
      //
      float timeSpeed = 0.5;
      float realTime = timeSpeed*time;
      //
      vec2 coordScaled = 0.01*fragCoord - 0.02*vec2(offset.x,0.0);
      vec3 position = vec3(coordScaled,0.0) + vec3(1223.0,6434.0,8425.0);
      vec3 flow = vec3(4.1*(0.5-xpart)*pow(ypartClippedn,4.0),-2.0*xfuel*pow(ypartClippedn,64.0),0.0);
      vec3 timing = realTime*vec3(0.0,-1.7,1.1) + flow;
      //
      vec3 displacePos = vec3(1.0,0.5,1.0)*2.4*position+realTime*vec3(0.01,-0.7,1.3);
      vec3 displace3 = vec3(noiseStackUV(displacePos,2,0.4,0.1),0.0);
      //
      vec3 noiseCoord = (vec3(2.0,1.0,1.0)*position+timing+0.4*displace3)/1.0;
      float noise = noiseStack(noiseCoord,3,0.4);
      //
      float flames = pow(ypartClipped,0.3*xfuel)*pow(noise,0.3*xfuel);
      //
      float f = ypartClippedFalloff*pow(1.0-flames*flames*flames,8.0);
      float fff = f*f*f;
      vec3 fire = 1.5*vec3(f, fff, fff*fff);
      //
      // smoke
      float smokeNoise = 0.5+snoise(0.4*position+timing*vec3(1.0,1.0,0.2))/2.0;
      vec3 smoke = vec3(0.3*pow(xfuel,3.0)*pow(ypart,2.0)*(smokeNoise+0.4*(1.0-noise)));
      //
      // sparks
      float sparkGridSize = 30.0;
      vec2 sparkCoord = fragCoord - vec2(2.0*offset.x,190.0*realTime);
      sparkCoord -= 30.0*noiseStackUV(0.01*vec3(sparkCoord,30.0*time),1,0.4,0.1);
      sparkCoord += 100.0*flow.xy;
      if (mod(sparkCoord.y/sparkGridSize,2.0)<1.0) sparkCoord.x += 0.5*sparkGridSize;
      vec2 sparkGridIndex = vec2(floor(sparkCoord/sparkGridSize));
      float sparkRandom = prng(sparkGridIndex);
      float sparkLife = min(10.0*(1.0-min((sparkGridIndex.y+(190.0*realTime/sparkGridSize))/(24.0-20.0*sparkRandom),1.0)),1.0);
      vec3 sparks = vec3(0.0);
      if (sparkLife>0.0) {
        float sparkSize = xfuel*xfuel*sparkRandom*0.08;
        float sparkRadians = 999.0*sparkRandom*2.0*PI + 2.0*time;
        vec2 sparkCircular = vec2(sin(sparkRadians),cos(sparkRadians));
        vec2 sparkOffset = (0.5-sparkSize)*sparkGridSize*sparkCircular;
        vec2 sparkModulus = mod(sparkCoord+sparkOffset,sparkGridSize) - 0.5*vec2(sparkGridSize);
        float sparkLength = length(sparkModulus);
        float sparksGray = max(0.0, 1.0 - sparkLength/(sparkSize*sparkGridSize));
        sparks = sparkLife*sparksGray*vec3(1.0,0.3,0.0);
      }
      //
      fragColor = vec4(max(fire,sparks)+smoke,1.0);
    }
    void main(){
      mainImage(gl_FragColor, vUv * iResolution.xy);
    }
  `
}

export const CloudShader = {
  uniforms:{
    iResolution:{
      value:new THREE.Vector3(1,1,1)
    },
    iTime:{
      value: 0.0
    },
  },
  vertexShader:`
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader:`
    varying vec2 vUv;
    uniform vec3 iResolution;
    uniform float iTime;
    
    const float cloudscale = 1.1;
    const float speed = 0.03;
    const float clouddark = 0.5;
    const float cloudlight = 0.3;
    const float cloudcover = 0.2;
    const float cloudalpha = 8.0;
    const float skytint = 0.5;
    const vec3 skycolour1 = vec3(0.2, 0.4, 0.6);
    const vec3 skycolour2 = vec3(0.4, 0.7, 1.0);

    const mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );

    vec2 hash( vec2 p ) {
      p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)));
      return -1.0 + 2.0*fract(sin(p)*43758.5453123);
    }

    float noise( in vec2 p ) {
        const float K1 = 0.366025404; // (sqrt(3)-1)/2;
        const float K2 = 0.211324865; // (3-sqrt(3))/6;
      vec2 i = floor(p + (p.x+p.y)*K1);	
        vec2 a = p - i + (i.x+i.y)*K2;
        vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0); //vec2 of = 0.5 + 0.5*vec2(sign(a.x-a.y), sign(a.y-a.x));
        vec2 b = a - o + K2;
      vec2 c = a - 1.0 + 2.0*K2;
        vec3 h = max(0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );
      vec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));
        return dot(n, vec3(70.0));	
    }

    float fbm(vec2 n) {
      float total = 0.0, amplitude = 0.1;
      for (int i = 0; i < 7; i++) {
        total += noise(n) * amplitude;
        n = m * n;
        amplitude *= 0.4;
      }
      return total;
    }

    // -----------------------------------------------

    void main() {
        vec2 p = vUv.xy / iResolution.xy;
      vec2 uv = p*vec2(iResolution.x/iResolution.y,1.0);    
        float time = iTime * speed;
        float q = fbm(uv * cloudscale * 0.5);
        
        //ridged noise shape
      float r = 0.0;
      uv *= cloudscale;
        uv -= q - time;
        float weight = 0.8;
        for (int i=0; i<8; i++){
        r += abs(weight*noise( uv ));
            uv = m*uv + time;
        weight *= 0.7;
        }
        
        //noise shape
      float f = 0.0;
        uv = p*vec2(iResolution.x/iResolution.y,1.0);
      uv *= cloudscale;
        uv -= q - time;
        weight = 0.7;
        for (int i=0; i<8; i++){
        f += weight*noise( uv );
            uv = m*uv + time;
        weight *= 0.6;
        }
        
        f *= r + f;
        
        //noise colour
        float c = 0.0;
        time = iTime * speed * 2.0;
        uv = p*vec2(iResolution.x/iResolution.y,1.0);
      uv *= cloudscale*2.0;
        uv -= q - time;
        weight = 0.4;
        for (int i=0; i<7; i++){
        c += weight*noise( uv );
            uv = m*uv + time;
        weight *= 0.6;
        }
        
        //noise ridge colour
        float c1 = 0.0;
        time = iTime * speed * 3.0;
        uv = p*vec2(iResolution.x/iResolution.y,1.0);
      uv *= cloudscale*3.0;
        uv -= q - time;
        weight = 0.4;
        for (int i=0; i<7; i++){
        c1 += abs(weight*noise( uv ));
            uv = m*uv + time;
        weight *= 0.6;
        }
      
        c += c1;
        
        vec3 skycolour = mix(skycolour2, skycolour1, p.y);
        vec3 cloudcolour = vec3(1.1, 1.1, 0.9) * clamp((clouddark + cloudlight*c), 0.0, 1.0);
      
        f = cloudcover + cloudalpha*f*r;
        
        vec3 result = mix(skycolour, clamp(skytint * skycolour + cloudcolour, 0.0, 1.0), clamp(f + c, 0.0, 1.0));
        
      gl_FragColor = vec4( result, 0.9 );
    }
  `

}

const GridLight_texture = loader.load('/textures/grass_texture.jpg')
GridLight_texture.minFilter = THREE.NearestFilter;
GridLight_texture.magFilter = THREE.NearestFilter;
GridLight_texture.wrapS = THREE.RepeatWrapping;
GridLight_texture.wrapT = THREE.RepeatWrapping;
export const GridLightShader = {
  uniforms:{
    iResolution:{
      value:new THREE.Vector3(1,1,1)
    },
    iTime:{
      value: 0.0
    },
    iChannel0:{value:GridLight_texture}
  },
  vertexShader:`
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader:`
  #include <common>
  uniform vec3 iResolution;
  uniform float iTime;
  uniform sampler2D iChannel0;

  #define TIMESCALE 0.25 
  #define TILES 8
  #define COLOR 0.7, 1.6, 2.8

  void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;
    
    vec4 noise = texture2D(iChannel0, floor(uv * float(TILES)) / float(TILES));
    float p = 1.0 - mod(noise.r + noise.g + noise.b + iTime * float(TIMESCALE), 1.0);
    p = min(max(p * 3.0 - 1.8, 0.1), 2.0);
    
    vec2 r = mod(uv * float(TILES), 1.0);
    r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
    p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);
    
    fragColor = vec4(COLOR, 1.0) * p;
  }
  varying vec2 vUv;
  void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
  }
  `,

}

export const GridLightShader2 = {
  uniforms:{
    iResolution:{
      value:new THREE.Vector3(1,1,1)
    },
    iTime:{
      value: 0.0
    },
  },
  vertexShader:`
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader:`
    uniform vec3 iResolution;
    uniform float iTime;
    varying vec2 vUv;
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        vec2  px = 4.0*(-iResolution.xy + 2.0*fragCoord.xy) / iResolution.y;
        
        float id = 0.5 + 0.5*cos(iTime + sin(dot(floor(px+0.5),vec2(113.1,17.81)))*43758.545);
        
        vec3  co = 0.5 + 0.5*cos(iTime + 2.0*id + vec3(0.0,1.0,2.0) );
        
        vec2  pa = smoothstep( 0.0, 0.2, id*(0.5 + 0.5*cos(6.2831*px)) );
        
        fragColor = vec4( co*pa.x*pa.y, 1.0 );
    }
    void main(){
      mainImage(gl_FragColor, vUv * iResolution.xy);
    }
  `
}

export const FireworksShader = {
  uniforms:{
    iResolution:{
      value:new THREE.Vector3(1,1,1)
    },
    iTime:{
      value: 0.0
    },
  },
  vertexShader:`
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader:`
    #define PI 3.141592653589793238
    #define TWOPI 6.283185307179586
    #define S(x,y,z) smoothstep(x,y,z)
    #define B(x,y,z,w) S(x-z, x+z, w)*S(y+z, y-z, w)
    #define saturate(x) clamp(x,0.,1.)
    
    #define NUM_EXPLOSIONS 8.
    #define NUM_PARTICLES 70.
    
    uniform vec3 iResolution;
    uniform float iTime;
    varying vec2 vUv;
    
    // Noise functions by Dave Hoskins 
    #define MOD3 vec3(.1031,.11369,.13787)
    vec3 hash31(float p) {
      vec3 p3 = fract(vec3(p) * MOD3);
      p3 += dot(p3, p3.yzx + 19.19);
      return fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
    }
    float hash12(vec2 p){
      vec3 p3  = fract(vec3(p.xyx) * MOD3);
        p3 += dot(p3, p3.yzx + 19.19);
        return fract((p3.x + p3.y) * p3.z);
    }
    
    float circ(vec2 uv, vec2 pos, float size) {
      uv -= pos;
        
        size *= size;
        return S(size*1.1, size, dot(uv, uv));
    }
    
    float light(vec2 uv, vec2 pos, float size) {
      uv -= pos;
        
        size *= size;
        return size/dot(uv, uv);
    }
    
    vec3 explosion(vec2 uv, vec2 p, float seed, float t) {
      
        vec3 col = vec3(0.);
        
        vec3 en = hash31(seed);
        vec3 baseCol = en;
        for(float i=0.; i<NUM_PARTICLES; i++) {
          vec3 n = hash31(i)-.5;
          
        vec2 startP = p-vec2(0., t*t*.1);        
            vec2 endP = startP+normalize(n.xy)*n.z;
            
            
            float pt = 1.-pow(t-1., 2.);
            vec2 pos = mix(p, endP, pt);    
            float size = mix(.01, .005, S(0., .1, pt));
            size *= S(1., .1, pt);
            
            float sparkle = (sin((pt+n.z)*100.)*.5+.5);
            sparkle = pow(sparkle, pow(en.x, 3.)*50.)*mix(0.01, .01, en.y*n.y);
          
          //size += sparkle*B(.6, 1., .1, t);
            size += sparkle*B(en.x, en.y, en.z, t);
            
            col += baseCol*light(uv, pos, size);
        }
        
        return col;
    }
    
    vec3 Rainbow(vec3 c) {
      
        float t=iTime;
        
        float avg = (c.r+c.g+c.b)/3.;
        c = avg + (c-avg)*sin(vec3(0., .333, .666)+t);
        
        c += sin(vec3(.4, .3, .3)*t + vec3(1.1244,3.43215,6.435))*vec3(.4, .1, .5);
        
        return c;
    }
    
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
      vec2 uv = fragCoord.xy / iResolution.xy;
      uv.x -= .5;
        uv.x *= iResolution.x/iResolution.y;
        
        float n = hash12(uv+10.);
        float t = iTime*.5;
        
        vec3 c = vec3(0.);
        
        for(float i=0.; i<NUM_EXPLOSIONS; i++) {
          float et = t+i*1234.45235;
            float id = floor(et);
            et -= id;
            
            vec2 p = hash31(id).xy;
            p.x -= .5;
            p.x *= 1.6;
            c += explosion(uv, p, id, et);
        }
        c = Rainbow(c);
        
        fragColor = vec4(c, 1.);
    }
    void main() {
      mainImage(gl_FragColor, vUv * iResolution.xy);
    }
  `
}
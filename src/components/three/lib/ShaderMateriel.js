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

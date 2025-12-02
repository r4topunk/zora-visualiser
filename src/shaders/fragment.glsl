varying vec2 vUv;
varying float vVisibility;


void main()
{            
                    
    
    gl_FragColor = vec4(vUv, 0.0, vVisibility);
}
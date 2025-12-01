varying vec2 vUv;


void main()
{     
    
    vec3 newPosition=position;    


    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(newPosition, 1.0);        


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;    

    vUv = uv;
}
varying vec2 vUv;
varying float vVisibility;
varying vec4 vTextureCoords;
varying float vAspectRatio;

uniform sampler2D uAtlas;
uniform sampler2D uBlurryAtlas;

void main()
{
    // Get UV coordinates for this image from the uniform array
    float xStart = vTextureCoords.x;
    float xEnd = vTextureCoords.y;
    float yStart = vTextureCoords.z;
    float yEnd = vTextureCoords.w;

    // Apply cover behavior - container is square (aspect 1:1)
    vec2 coverUV = vUv;

    if (vAspectRatio > 1.0) {
        // Image is wider than tall - crop horizontally
        float scale = 1.0 / vAspectRatio;
        float offset = (1.0 - scale) * 0.5;
        coverUV.x = offset + vUv.x * scale;
    } else {
        // Image is taller than wide - crop vertically
        float scale = vAspectRatio;
        float offset = (1.0 - scale) * 0.5;
        coverUV.y = offset + vUv.y * scale;
    }

    vec2 atlasUV = vec2(
        mix(xStart, xEnd, coverUV.x),
        mix(yStart, yEnd, 1.-coverUV.y)
    );

    // Sample the textures
    vec4 sharpTexel = texture2D(uAtlas, atlasUV);
    vec4 blurryTexel = texture2D(uBlurryAtlas, atlasUV);

    // Mix sharp and blurry based on visibility (distance)
    vec4 color = mix(blurryTexel, sharpTexel, vVisibility);

    color.a *= vVisibility;

    color.r = min(color.r, 1.);
    color.g = min(color.g, 1.);
    color.b = min(color.b, 1.);

    gl_FragColor = color;
}
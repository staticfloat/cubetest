// Uniforms
#if defined(SHADOWMAP)
uniform float u_shadowMapGradientStep;
#endif


// Ported from http://http.developer.nvidia.com/GPUGems/gpugems_ch12.html
// Unpacks a float from RGBA texture
float getDepth(sampler2D shadowMap, vec2 uv)
{
    vec4 depthPacked = texture2D(u_shadowMap, uv);
    return  depthPacked.r / 1.0 +
            depthPacked.g / 256.0 +
            depthPacked.b / 65536.0 +
            depthPacked.a / 16777216.0;
}


float getShadowmapValue( sampler2D shadowMap, vec2 shadowUV )
{
    float shadowTerm = 1.0;
    float gradientScaleBias = 1.0;
    float fixedDepthBias = 0.0;
    float centerdepth = getDepth(shadowMap, shadowUV.xy);
    
    // NABIL: Scale gradient by normal vector; get longer blurring on slanted regions maybe
    // gradient calculation
    vec4 depths = vec4(getDepth(shadowMap, shadowUV.xy + vec2(-u_shadowMapGradientStep, 0)),
                       getDepth(shadowMap, shadowUV.xy + vec2(+u_shadowMapGradientStep, 0)),
                       getDepth(shadowMap, shadowUV.xy + vec2(0, -u_shadowMapGradientStep)),
                       getDepth(shadowMap, shadowUV.xy + vec2(0, +u_shadowMapGradientStep)) );
    vec2 differences = abs( depths.yw - depths.xz );
    float gradient = min(gradientClamp, max(differences.x, differences.y));
    float gradientFactor = gradient * gradientScaleBias;
    // visibility function
    float depthAdjust = gradientFactor + (fixedDepthBias * centerdepth);
    float finalCenterDepth = centerdepth + depthAdjust;
    // PCF
    depths += depthAdjust;
    float final = (finalCenterDepth > shadowUV.z) ? 1.0 : 0.0;
    final += (depths.x > shadowUV.z) ? 1.0 : 0.0;
    final += (depths.y > shadowUV.z) ? 1.0 : 0.0;
    final += (depths.z > shadowUV.z) ? 1.0 : 0.0;
    final += (depths.w > shadowUV.z) ? 1.0 : 0.0;
    final *= 0.2;
    return final;
}
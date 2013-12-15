///////////////////////////////////////////////////////////////////
// Uniforms
uniform vec3 u_pointLightColor[POINT_LIGHT_COUNT];
uniform float u_pointLightRangeInverse[POINT_LIGHT_COUNT];

#if defined(SHADOWMAP)
uniform sampler2D u_pointLightShadowmap[POINT_LIGHT_COUNT];
#endif

///////////////////////////////////////////////////////////////////
// Varyings
varying vec3 v_vertexToPointLightDirection[POINT_LIGHT_COUNT];
#if defined(SHADOWMAP)
// The sampler coordinates for this spot light's shadowmap
varying vec2 v_pointShadowmapCoords[POINT_LIGHT_COUNT];
#endif


vec3 pointlight_frag( vec3 normalVector ) {
    vec3 combinedColor = vec3(0,0,0);
    for (int i = 0; i < POINT_LIGHT_COUNT; ++i)
    {
        float attenuation = 1.0;
        // First, we calculate our shadow multiplication amount:
        #if defined(SHADOWMAP)
        attenuation = getShadowmapValue( v_pointShadowmapCoords );
        
        // This is the case only if this pixel is completely in shadow for this light
        // So we don't need to go through with calculating the rest of this light's contribution
        if( attenuation == 0.0 )
            continue;
        #endif
        
        vec3 ldir = v_vertexToPointLightDirection[i] * u_pointLightRangeInverse[i];
        float attenuation = shadowMult * clamp(1.0 - dot(ldir, ldir), 0.0, 1.0);
        combinedColor += computeLighting(normalVector, normalize(v_vertexToPointLightDirection[i]), u_pointLightColor[i], attenuation);
    }
    return combinedColor;
}
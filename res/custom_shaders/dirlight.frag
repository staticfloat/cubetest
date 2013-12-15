///////////////////////////////////////////////////////////////////
// Uniforms
#if (DIRECTIONAL_LIGHT_COUNT > 0)
uniform vec3 u_directionalLightColor[SPOT_LIGHT_COUNT];
uniform vec3 u_directionalLightDirection[SPOT_LIGHT_COUNT];

#if defined(SHADOWMAP)
uniform sampler2D u_directionalLightShadowmap[SPOT_LIGHT_COUNT];
#endif
#endif

vec3 dirlight_frag( vec3 normalVector ) {
    vec3 combinedColor = vec3(0,0,0);
    for (int i = 0; i < DIRECTIONAL_LIGHT_COUNT; ++i)
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
        
        vec3 lightDirection = normalize(u_directionalLightDirection[i]);
        combinedColor += blinn_phong(normalVector, -lightDirection, u_directionalLightColor[i], attenuation);
    }
    return combinedColor;
}
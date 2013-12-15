///////////////////////////////////////////////////////////////////
// Uniforms
uniform vec3 u_spotLightColor[SPOT_LIGHT_COUNT];
uniform vec3 u_spotLightDirection[SPOT_LIGHT_COUNT];
uniform float u_spotLightRangeInverse[SPOT_LIGHT_COUNT];
uniform float u_spotLightInnerAngleCos[SPOT_LIGHT_COUNT];
uniform float u_spotLightOuterAngleCos[SPOT_LIGHT_COUNT];

#if defined(SHADOWMAP)
uniform sampler2D u_spotLightShadowmap[SPOT_LIGHT_COUNT];
#endif

///////////////////////////////////////////////////////////////////
// Varyings
varying vec3 v_vertexToSpotLightDirection[SPOT_LIGHT_COUNT];
#if defined(SHADOWMAP)
// The sampler coordinates for this spot light's shadowmap
varying vec2 v_spotShadowmapCoords[SPOT_LIGHT_COUNT];
#endif


vec3 spotlight_frag( vec3 normalVector ) {
    vec3 combinedColor = vec3(0,0,0);
    for (int i = 0; i < SPOT_LIGHT_COUNT; ++i)
    {
        float attenuation = 1.0;
        // First, we calculate our shadow multiplication amount:
        #if defined(SHADOWMAP)
        attenuation = getShadowmapValue( v_spotShadowmapCoords );
        
        // This is the case only if this pixel is completely in shadow for this light
        // So we don't need to go through with calculating the rest of this light's contribution
        if( attenuation == 0.0 )
            continue;
        #endif
        
        // Compute range attenuation
        vec3 ldir = v_vertexToSpotLightDirection[i] * u_spotLightRangeInverse[i];
        attenuation = attenuation * clamp(1.0 - dot(ldir, ldir), 0.0, 1.0);
        vec3 vertexToSpotLightDirection = normalize(v_vertexToSpotLightDirection[i]);
        
        // TODO:
        // Let app normalize this! Need Node::getForwardVectorViewNorm
        // This needs to be in TANGENT SPACE for bump mapping
        // and should always pass from vertex shader via v_spotLightDirection[i]
        vec3 spotLightDirection = normalize(u_spotLightDirection[i]);
        
        // "-lightDirection" is used because light direction points in opposite direction to spot direction.
        float spotCurrentAngleCos = dot(spotLightDirection, -vertexToSpotLightDirection);
        
		// Apply spot attenuation
        attenuation *= smoothstep(u_spotLightOuterAngleCos[i], u_spotLightInnerAngleCos[i], spotCurrentAngleCos);
        combinedColor += blinn_phong(normalVector, vertexToSpotLightDirection, u_spotLightColor[i], attenuation);
    }
    
    return combinedColor;
}
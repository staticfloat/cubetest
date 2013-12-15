///////////////////////////////////////////////////////////////////
// Uniforms
uniform vec3 u_spotLightPosition[SPOT_LIGHT_COUNT];
uniform vec3 u_spotLightDirection[SPOT_LIGHT_COUNT];

#if defined(SHADOWMAP)
// The textures the shadowmaps have been stored in (calculated in shadowmap_depthpass.{frag,vert}
uniform sampler2D u_spotLightShadowmap[SPOT_LIGHT_COUNT];
// The transform matrix to the View*Projection space for each spot light
uniform mat4 u_spotLightViewProjTransform[SPOT_LIGHT_COUNT];
#endif


///////////////////////////////////////////////////////////////////
// Varyings
// Fragment -> light direction
varying vec3 v_vertexToSpotLightDirection[SPOT_LIGHT_COUNT];
#if defined(SHADOWMAP)
// The sampler coordinates for this spot light's shadowmap
varying vec2 v_spotShadowmapCoords[SPOT_LIGHT_COUNT];
#endif


void spotlight_vert(vec4 position, vec4 positionWorldView)
{
    for (int i = 0; i < SPOT_LIGHT_COUNT; ++i)
    {
        // Compute the light direction with light position and the vertex position.
	    v_vertexToSpotLightDirection[i] = u_spotLightPosition[i] - positionWorldView.xyz;
        
        // Calculate texture coordinates for the shadowmap
        #if defined(SHADOWMAP)
        vec4 viewProjPos = u_spotLightViewProjTransform[i] * position;
        v_spotShadowmapCoords[i] = viewProjPos.xy / viewProjPos.w;
        #endif
    }
}
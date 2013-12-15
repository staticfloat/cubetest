///////////////////////////////////////////////////////////////////
// Uniforms
#if defined(SHADOWMAP)
// The textures the shadowmaps have been stored in (calculated in shadowmap_depthpass.{frag,vert})
uniform sampler2D u_dirLightShadowmap[DIRECTIONAL_LIGHT_COUNT];
// The transform matrix to the View*Projection space for each directional light
uniform mat4 u_dirLightViewProjTransform[DIRECTIONAL_LIGHT_COUNT];
#endif


///////////////////////////////////////////////////////////////////
// Varyings
#if defined(SHADOWMAP)
// The sampler coordinates for this point light's shadowmap
varying vec2 v_dirShadowmapCoords[DIRECTIONAL_LIGHT_COUNT];
#endif


void dirlight_vert(vec4 position, vec4 positionWorldView)
{
#if defined(SHADOWMAP)
    for (int i = 0; i < DIRECTIONAL_LIGHT_COUNT; ++i)
    {
        vec4 viewProjPos = u_dirLightViewProjTransform[i] * position;
        v_dirShadowmapCoords[i] = viewProjPos.xy / viewProjPos.w;
    }
#endif
}
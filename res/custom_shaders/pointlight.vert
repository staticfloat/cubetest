///////////////////////////////////////////////////////////////////
// Uniforms
uniform vec3 u_pointLightPosition[POINT_LIGHT_COUNT];

#if defined(SHADOWMAP)
// The textures the shadowmaps have been stored in (calculated in shadowmap_depthpass.{frag,vert})
uniform sampler2D u_pointLightShadowmap[POINT_LIGHT_COUNT];
// The transform matrix to the View*Projection space for each point light
uniform mat4 u_pointLightViewProjTransform[POINT_LIGHT_COUNT];
#endif


///////////////////////////////////////////////////////////////////
// Varyings
// Fragment -> light direction
varying vec3 v_vertexToPointLightDirection[POINT_LIGHT_COUNT];
#if defined(SHADOWMAP)
// The sampler coordinates for this point light's shadowmap
varying vec2 v_pointShadowmapCoords[POINT_LIGHT_COUNT];
#endif


void pointlight_vert(vec4 position, vec4 positionWorldView)
{
    for (int i = 0; i < POINT_LIGHT_COUNT; ++i)
    {
        // Compute the light direction with light position and the vertex position.
	    v_vertexToPointLightDirection[i] = u_pointLightPosition[i] - positionWorldView.xyz;
        
        // Calculate texture coordinates for the shadowmap
#if defined(SHADOWMAP)
        vec4 viewProjPos = u_pointLightViewProjTransform[i] * position;
        v_pointShadowmapCoords[i] = viewProjPos.xy / viewProjPos.w;
#endif
    }
}
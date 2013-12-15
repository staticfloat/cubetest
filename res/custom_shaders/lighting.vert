///////////////////////////////////////////////////////////////////
// Attributes (all vertex data must have normal information!)
attribute vec3 a_normal;


///////////////////////////////////////////////////////////////////
// Uniforms
uniform mat4 u_inverseTransposeWorldViewMatrix;

#if (POINT_LIGHT_COUNT > 0) || (SPOT_LIGHT_COUNT > 0) || defined(SPECULAR)
uniform mat4 u_worldViewMatrix;
#endif

#if defined(SPECULAR)
uniform vec3 u_cameraPosition;
#endif

///////////////////////////////////////////////////////////////////
// Varyings
varying vec3 v_normalVector;

#if defined(SPECULAR)
varying vec3 v_cameraDirection;
#endif


///////////////////////////////////////////////////////////////////
// Includes
#if (DIRECTIONAL_LIGHT_COUNT > 0)
#include "dirlight.vert"
#endif

#if (SPOT_LIGHT_COUNT > 0)
#include "spotlight.vert"
#endif

#if (POINT_LIGHT_COUNT > 0)
#include "pointlight.vert"
#endif


void lighting_vert(vec4 position)
{
    // Transform normal vector to view space for usage in the fragment shader
    v_normalVector = mat3(u_inverseTransposeWorldViewMatrix[0].xyz,
                          u_inverseTransposeWorldViewMatrix[1].xyz,
                          u_inverseTransposeWorldViewMatrix[2].xyz) * a_normal;

    #if defined(SPECULAR) || (POINT_LIGHT_COUNT > 0) || (SPOT_LIGHT_COUNT > 0)
	vec4 positionWorldView = u_worldViewMatrix * position;
    #endif
    
    #if (DIRECTIONAL_LIGHT_COUNT > 0)
    dirlight_vert(position, positionWorldView );
    #endif
    
    #if (POINT_LIGHT_COUNT > 0)
    pointlight_vert(position, positionWorldView );
    #endif
    
    #if (SPOT_LIGHT_COUNT > 0)
    spotlight_vert(position, positionWorldView );
    #endif
    
    #if defined(SPECULAR)  
	v_cameraDirection = u_cameraPosition - positionWorldView.xyz;
    #endif
}
#ifndef DIRECTIONAL_LIGHT_COUNT
#define DIRECTIONAL_LIGHT_COUNT 0
#endif
#ifndef SPOT_LIGHT_COUNT
#define SPOT_LIGHT_COUNT 0
#endif
#ifndef POINT_LIGHT_COUNT
#define POINT_LIGHT_COUNT 0
#endif
#if (DIRECTIONAL_LIGHT_COUNT > 0) || (POINT_LIGHT_COUNT > 0) || (SPOT_LIGHT_COUNT > 0)
#define LIGHTING
#endif

///////////////////////////////////////////////////////////
// Attributes
attribute vec4 a_position;


///////////////////////////////////////////////////////////
// Uniforms
uniform mat4 u_worldViewProjectionMatrix;


///////////////////////////////////////////////////////////
// Includes
#if defined(LIGHTING)
#include "lighting.vert"
#endif


void main()
{
    gl_Position = u_worldViewProjectionMatrix * a_position;

    #if defined (LIGHTING)
    // Apply lighting vertex shaders, pass in raw position, not ViewProj
    lighting_vert(a_position);
    #endif
}

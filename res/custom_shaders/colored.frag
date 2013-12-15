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

#ifdef OPENGL_ES
precision highp float;
#endif


///////////////////////////////////////////////////////////
// Uniforms
uniform vec4 u_diffuseColor;


///////////////////////////////////////////////////////////
// Includes
#if defined(LIGHTING)
#include "lighting.frag"
#endif


void main()
{
    #if defined(LIGHTING)
    gl_FragColor.a = u_diffuseColor.a;
    gl_FragColor.rgb = lighting_frag();
    #else
    gl_FragColor = u_diffuseColor;
    #endif // LIGHTING
}

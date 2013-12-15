///////////////////////////////////////////////////////////////////
// Uniforms
uniform vec3 u_ambientColor;

#if defined(SPECULAR)
uniform float u_specularExponent;
#endif


///////////////////////////////////////////////////////////////////
// Varyings
varying vec3 v_normalVector;




// Utility function that gets called a lot; this is the basic shading function that everything else is built on top of
vec3 blinn_phong(vec3 normalVector, vec3 lightDirection, vec3 lightColor, float attenuation)
{
    float diffuse = max(dot(normalVector, lightDirection), 0.0);
    vec3 diffuseColor = lightColor * u_diffuseColor.rgb * diffuse * attenuation;
    
    vec3 specularColor = vec3(0,0,0);
#if defined(SPECULAR)
    // Blinn-Phong shading
    vec3 vertexToEye = normalize(v_cameraDirection);
    vec3 halfVector = normalize(lightDirection + vertexToEye);
    float specularAngle = clamp(dot(normalVector, halfVector), 0.0, 1.0);
    
    // Calculate the actual specular color, scale by attenuation
    specularColor = vec3(pow(specularAngle, u_specularExponent)) * attenuation;
#endif
    
    return diffuseColor + specularColor;
}


///////////////////////////////////////////////////////////////////
// Includes
#if defined(SHADOWMAP)
#include "shadowmap.frag"
#endif

#if (DIRECTIONAL_LIGHT_COUNT > 0)
#include "dirlight.frag"
#endif

#if (SPOT_LIGHT_COUNT > 0)
#include "spotlight.frag"
#endif

#if (POINT_LIGHT_COUNT > 0)
#include "pointlight.frag"
#endif



vec3 lighting_frag()
{
    // Normalize the normal vector as given to us by the vertex shader
    vec3 normalVector = normalize(v_normalVector);
    
    // Initialize combined lighting to ambient
    vec3 combinedColor = u_diffuseColor.rgb * u_ambientColor;

    // Calculate light contributions from various light types
    #if (DIRECTIONAL_LIGHT_COUNT > 0)
    combinedColor += dirlight_frag(normalVector);
    #endif
    
    #if (POINT_LIGHT_COUNT > 0)
    combinedColor += pointlight_frag(normalVector);
    #endif
    
    #if (SPOT_LIGHT_COUNT > 0)
    combinedColor += spotlight_frag(normalVector);
    #endif
    
    return combinedColor;
}

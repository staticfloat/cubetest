cmake_minimum_required(VERSION 2.7)
PROJECT(cubetest)

set(GAME_NAME cubetest)

if( CMAKE_SIZEOF_VOID_P EQUAL 8 )
    set(ARCH_DIR "x64" )
else( CMAKE_SIZEOF_VOID_P EQUAL 8 )
    set(ARCH_DIR "x86" )
endif( CMAKE_SIZEOF_VOID_P EQUAL 8 )

set(GAMEPLAY_SRC_PATH "../GamePlay") 
set(GAMEPLAY_EXT_LIBS_PATH "${GAMEPLAY_SRC_PATH}/external-deps")

IF(CMAKE_SYSTEM_NAME MATCHES "Linux")
    ADD_DEFINITIONS(-D__linux__)
    SET(TARGET_OS "LINUX")
    SET(TARGET_OS_DIR "linux")
ELSEIF(CMAKE_SYSTEM_NAME MATCHES "Windows")
    IF(MSVC)
        ADD_DEFINITIONS(-DMSVC)
    ENDIF(MSVC)
    ADD_DEFINITIONS(-DWIN32)
    ADD_DEFINITIONS(-D_WINDOWS)
    SET(TARGET_OS "WINDOWS")
    SET(TARGET_OS_DIR "windows")
ENDIF(CMAKE_SYSTEM_NAME MATCHES "Linux")

set(GAME_OUTPUT_DIR "${CMAKE_BINARY_DIR}/bin/${TARGET_OS_DIR}")

macro (append_gameplay_lib listToAppend)
    set(libName gameplay)
    IF (TARGET_OS STREQUAL "WINDOWS")
		FIND_LIBRARY(${libName}_LIBRARY_RELEASE
			NAMES ${libName}
			PATHS "${GAMEPLAY_SRC_PATH}/gameplay/${TARGET_OS_DIR}/${ARCH_DIR}/Release"
		)

		FIND_LIBRARY(${libName}_LIBRARY_DEBUG
			NAMES ${libName}
			PATHS "${GAMEPLAY_SRC_PATH}/gameplay/${TARGET_OS_DIR}/${ARCH_DIR}/Debug"
		)
		SET(FOUND_LIB_${libName}
			debug ${${libName}_LIBRARY_DEBUG}
			optimized ${${libName}_LIBRARY_RELEASE}
		)
	ELSE (TARGET_OS STREQUAL "WINDOWS")
		find_library(FOUND_LIB_${libName} ${libName} HINTS
			"${GAMEPLAY_SRC_PATH}/cmake/gameplay" "${GAMEPLAY_SRC_PATH}/build/gameplay" "${GAMEPLAY_SRC_PATH}/gameplay/src")
	ENDIF (TARGET_OS STREQUAL "WINDOWS")
	set(${listToAppend} ${${listToAppend}} ${FOUND_LIB_${libName}})
endmacro(append_gameplay_lib)

macro (append_gameplay_ext_lib listToAppend libName libDirName)
    IF("${libDirName}" STREQUAL "")
		find_library(FOUND_LIB_${libName} NAMES ${libName} ${ARGN})
    ELSE("${libDirName}" STREQUAL "")
        set(pathToSearch
            "${GAMEPLAY_EXT_LIBS_PATH}/${libDirName}/lib/${TARGET_OS_DIR}/${ARCH_DIR}")
		find_library(FOUND_LIB_${libName} NAMES ${libName} ${ARGN} HINTS ${pathToSearch})
    ENDIF("${libDirName}" STREQUAL "")

    set(${listToAppend} ${${listToAppend}} ${FOUND_LIB_${libName}})
    message(STATUS "Library Found: ${libName} Path: ${FOUND_LIB_${libName}}")
endmacro (append_gameplay_ext_lib)

macro(copy_files TARGET_NAME GLOBPAT SOURCE DESTINATION RECUR)
    get_filename_component(REALPATH_SOURCE ${SOURCE} REALPATH)
    IF(${RECUR})
        SET(RECURSE_PARAM GLOB_RECURSE)
    ELSEIF(NOT ${RECUR})
        SET(RECURSE_PARAM GLOB)
    ENDIF(${RECUR})
    file(${RECURSE_PARAM} COPY_FILES RELATIVE ${REALPATH_SOURCE} "${REALPATH_SOURCE}/${GLOBPAT}")

  add_custom_target(${TARGET_NAME} ALL COMMENT "Copying files: ${REALPATH_SOURCE}/${GLOBPAT}")

  foreach(FILENAME ${COPY_FILES})
    set(SRC "${REALPATH_SOURCE}/${FILENAME}")
    set(DST "${DESTINATION}/${FILENAME}")

    IF(IS_DIRECTORY ${SRC})
        add_custom_command(TARGET ${TARGET_NAME} COMMAND ${CMAKE_COMMAND} -E make_directory ${DST})
    ELSE(IS_DIRECTORY ${SRC})
        add_custom_command(TARGET ${TARGET_NAME} COMMAND ${CMAKE_COMMAND} -E copy_if_different ${SRC} ${DST})
    ENDIF(IS_DIRECTORY ${SRC})
  endforeach(FILENAME)
endmacro(copy_files)

include_directories( 
    ${GAMEPLAY_SRC_PATH}/gameplay/src
    ${GAMEPLAY_SRC_PATH}/external-deps/lua/include
    ${GAMEPLAY_SRC_PATH}/external-deps/bullet/include
    ${GAMEPLAY_SRC_PATH}/external-deps/png/include
    ${GAMEPLAY_SRC_PATH}/external-deps/oggvorbis/include
    ${GAMEPLAY_SRC_PATH}/external-deps/zlib/include
    ${GAMEPLAY_SRC_PATH}/external-deps/openal/include
	${GAMEPLAY_SRC_PATH}/external-deps/openal/include/AL
    ${GAMEPLAY_SRC_PATH}/external-deps/glew/include
)

append_gameplay_lib(GAMEPLAY_LIBRARIES)
append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "GLEW" "glew" "glew32")
append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "lua" "lua")
append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "png" "png" "libpng")
append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "BulletDynamics" "bullet")
append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "BulletCollision" "bullet")
append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "LinearMath" "bullet")
append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "openal" "openal" "openal32")
append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "vorbis" "oggvorbis" "libvorbis")
append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "ogg" "oggvorbis" "libogg")
append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "z" "zlib" "zlib")

IF (TARGET_OS STREQUAL "LINUX")
	append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "GL" "")
	append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "m" "" )
	append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "X11" "")
	append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "dl" "")
	append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "rt" "" )
	append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "pthread" "" )
ELSEIF (TARGET_OS STREQUAL "WINDOWS")
	set(GAMEPLAY_LIBRARIES ${GAMEPLAY_LIBRARIES} "OpenGL32")
	set(GAMEPLAY_LIBRARIES ${GAMEPLAY_LIBRARIES} "GLU32")
	append_gameplay_ext_lib(GAMEPLAY_LIBRARIES "vorbisfile" "oggvorbis" "libvorbisfile")
	ADD_DEFINITIONS(-D_ITERATOR_DEBUG_LEVEL=0)
ENDIF (TARGET_OS STREQUAL "LINUX")

source_group(res FILES ${GAME_RES} ${GAMEPLAY_RES} ${GAME_RES_SHADERS} ${GAME_RES_SHADERS_LIB})
source_group(src FILES ${GAME_SRC})

set(GAME_SRC
	src/CubeTest.cpp
	src/CubeTest.h
)

add_executable(${GAME_NAME}
	WIN32
    ${GAME_SRC}
)

target_link_libraries(${GAME_NAME} ${GAMEPLAY_LIBRARIES})

set_target_properties(${GAME_NAME} PROPERTIES
    OUTPUT_NAME "${GAME_NAME}"
    RUNTIME_OUTPUT_DIRECTORY "${GAME_OUTPUT_DIR}"
    LIBRARY_OUTPUT_DIRECTORY "${GAME_OUTPUT_DIR}"
)

#TODO: Copy res files to the bin dir, it is done that way so we can make post
#processing to the the res files in the future like zipping or preparation to
#per platfom format.
copy_files(CopyRes * "${CMAKE_SOURCE_DIR}/res" "$<TARGET_FILE_DIR:${GAME_NAME}>/res" 1)
copy_files(CopyShaders * "${GAMEPLAY_SRC_PATH}/gameplay/res/shaders" "$<TARGET_FILE_DIR:${GAME_NAME}>/res/shaders" 1)
copy_files(CopyConfig *.config "${CMAKE_SOURCE_DIR}" "$<TARGET_FILE_DIR:${GAME_NAME}>" 0)

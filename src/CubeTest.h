#ifndef TEMPLATEGAME_H_
#define TEMPLATEGAME_H_

#include "gameplay.h"

using namespace gameplay;

/**
 * Main game class.
 */
class CubeTest: public Game
{
public:

    /**
     * Constructor.
     */
    CubeTest();

    /**
     * @see Game::keyEvent
     */
	void keyEvent(Keyboard::KeyEvent evt, int key);
	
    /**
     * @see Game::touchEvent
     */
    void touchEvent(Touch::TouchEvent evt, int x, int y, unsigned int contactIndex);

protected:

    /**
     * @see Game::initialize
     */
    void initialize();

    /**
     * @see Game::finalize
     */
    void finalize();

    /**
     * @see Game::update
     */
    void update(float elapsedTime);

    /**
     * @see Game::render
     */
    void render(float elapsedTime);

private:

    /**
     * Draws the scene each frame.
     */
    bool drawScene(Node* node);
    
    // Assign a spotlight to a material
    void bindSpotLight( Material * mat, Node * spot );
    void bindDirectionalLight( Material * mat, Node * sun );

    Scene * _scene;
    bool _wireframe;
    Camera * _camera;
    
    bool _ctrlDown, _wDown, _sDown, _aDown, _dDown, _rDown, _fDown;
};

#endif

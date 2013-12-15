#include "CubeTest.h"

// Declare our game instance
CubeTest game;

CubeTest::CubeTest()
    : _scene(NULL), _wireframe(false)
{
}

/*
void printVec3( float * vec );
void printVec4( float * vec );
void dumpMaterial( Material * mat, const char * prefix );
void dumpModel( Node * node );
void dumpNode( Node * node );
void printMaterialValue( MaterialParameter * p );

void printVec3( float * vec ) {
    printf("<%.3f, %.3f, %.3f>\n", vec[0], vec[1], vec[2] );
}

void printVec4( float * vec ) {
    printf("<%.3f, %.3f, %.3f %.3f>\n", vec[0], vec[1], vec[2], vec[3] );
}

void printMaterialValue( MaterialParameter * p ) {
    switch( p->_type ) {
        case MaterialParameter::VECTOR3:
            printVec3(p->_value.floatPtrValue);
            break;
        case MaterialParameter::VECTOR4:
            printVec4(p->_value.floatPtrValue);
            break;
        case MaterialParameter::FLOAT:
            printf( "%.3f\n", p->_value.floatValue );
            break;
        default:
            printf("[?%d]\n", p->_type );
            break;
    }
}

void dumpMaterial( Material * mat, const char * prefix = "" ) {
    // First, dump root-level parameters:
    for( int i=0; i<mat->getParameterCount(); ++i ) {
        MaterialParameter * p = mat->getParameterByIndex(i);
        printf("%s/[%d] %s ", prefix, i, p->getName() );
        printMaterialValue( p );
    }
    
    for( int j=0; j<mat->getTechniqueCount(); ++j ) {
        Technique * t = mat->getTechniqueByIndex(j);
        const char * tname = t->getId();
        for( int i=0; i<t->getParameterCount(); ++i ) {
            MaterialParameter * p = t->getParameterByIndex(i);
            printf("%s/[%d] %s/[%d] %s ", prefix, j, tname, i, p->getName());
            printMaterialValue( p );
        }
        
        for( int k=0; k<t->getPassCount(); ++k ) {
            Pass * pass = t->getPassByIndex(k);
            const char * passname = pass->getId();
            for( int i=0; i<pass->getParameterCount(); ++i ) {
                MaterialParameter * p = pass->getParameterByIndex(i);
                printf("%s/[%d] %s/[%d] %s/[%d] %s ", prefix, j, tname, k, passname, i, p->getName());
                printMaterialValue( p );
            }
        }
    }
}

void dumpModel( Node * node ) {
    printf("Shared:\n");
    dumpMaterial( node->getModel()->getMaterial() );
    
    if( node->getModel()->getMeshPartCount() > 0 ) {
        printf("Per part:\n");
        for( int i=0; i<node->getModel()->getMeshPartCount(); ++i ) {
            char prefix[100];
            sprintf(prefix, "part [%d]", i);
            dumpMaterial( node->getModel()->getMaterial(i), prefix );
        }
    }
}

void dumpNode( Node * node ) {
    printf("%s/position: <%.3f, %.3f, %.3f>\n", node->getId(), node->getTranslation().x, node->getTranslation().y, node->getTranslation().z );
}
 */

void CubeTest::initialize()
{
    _scene = Scene::load( "res/world.scene" );
    if( !_scene ) {
        printf("Couldn't load scene!");
        Game::getInstance()->exit();
    }

    // Set the aspect ratio for the scene's camera to match the current resolution
    _camera = _scene->getActiveCamera();
    _camera->setAspectRatio(getAspectRatio());
    
    Node * sun = _scene->findNode("sun");
    Node * box = _scene->findNode("box");
    Node * monkey = _scene->findNode("X");
    Node * spot = _scene->findNode("spot");
    
    _camera->getNode()->rotateY( MATH_DEG_TO_RAD(270.0f) );
    
    Node * camNode = _camera->getNode();
    //camNode->setTranslation(0, 0, 0);
    //camNode->setRotation(1, 0, 0, 0);
    
    //camNode->translate(0, -10, 10);
    //camNode->rotateX( MATH_DEG_TO_RAD(225.0f) );
    //camNode->rotateX( MATH_DEG_TO_RAD(-10.0f));
    Vector3 f = camNode->getForwardVector();
    
    
    bindSpotLight( box->getModel()->getMaterial(0), spot );
    bindDirectionalLight( box->getModel()->getMaterial(0), sun );
    bindDirectionalLight( monkey->getModel()->getMaterial(0), sun );
    
    
    //printf("<%.3f, %.3f, %.3f>\n", f.x, f.y, f.z );
    //dumpModel( box );
}

void CubeTest::bindSpotLight( Material * mat, Node * spot ) {
    mat->getParameter("u_spotLightColor[0]")->setValue( spot->getLight()->getColor() );
    mat->getParameter("u_spotLightInnerAngleCos[0]")->setValue( cosf(spot->getLight()->getInnerAngle()) );
    mat->getParameter("u_spotLightOuterAngleCos[0]")->setValue( cosf(spot->getLight()->getOuterAngle()) );
    mat->getParameter("u_spotLightRangeInverse[0]")->setValue( 0.001f );
    mat->getParameter("u_spotLightDirection[0]")->bindValue( spot, &Node::getForwardVectorView );
    mat->getParameter("u_spotLightPosition[0]")->bindValue( spot, &Node::getTranslationView );
}

void CubeTest::bindDirectionalLight( Material * mat, Node * sun ) {
    mat->getParameter("u_directionalLightColor[0]")->setValue( sun->getLight()->getColor() );
    mat->getParameter("u_directionalLightDirection[0]")->bindValue( sun, &Node::getForwardVectorView );
}

void CubeTest::finalize()
{
    SAFE_RELEASE(_scene);
}

void CubeTest::update(float elapsedTime)
{
    // Rotate model
    _scene->findNode("box")->rotateZ(MATH_DEG_TO_RAD((float)elapsedTime / 3000.0f * 180.0f));
    float dscale = 1.0f + .25f*sinf(MATH_DEG_TO_RAD((float)getGameTime() / 200.0f * 180.0f));
    _scene->findNode("box")->setScale(dscale);
    
    Node * camNode = _camera->getNode();
    if( _wDown )
        camNode->translateForward(.2f);
    if( _sDown )
        camNode->translateForward(-.2f);
    
    if( _aDown ) {
        if( _ctrlDown )
            camNode->rotateY(.02f);
        else
            camNode->translateLeft(.2f);
    }
    
    if( _dDown ) {
        if( _ctrlDown )
            camNode->rotateY(-.02f);
        else
            camNode->translateLeft(-.2f);
    }
    if( _rDown ) {
        if( _ctrlDown )
            camNode->rotateX(.02f);
        else
            camNode->translateUp(.2f);
    }
    if( _fDown ) {
        if( _ctrlDown )
            camNode->rotateX(-.02f);
        else
            camNode->translateUp(-.2f);
    }
}

void CubeTest::render(float elapsedTime)
{
    // Clear the color and depth buffers
    clear(CLEAR_COLOR_DEPTH, Vector4::zero(), 1.0f, 0);

    // Visit all the nodes in the scene for drawing
    _scene->visit(this, &CubeTest::drawScene);
}

bool CubeTest::drawScene(Node* node)
{
    // If the node visited contains a model, draw it
    Model* model = node->getModel(); 
    if( model )
    {
        auto bsphere = node->getBoundingSphere();
        auto frustum = _camera->getFrustum();
        if( bsphere.intersects(frustum) )
            model->draw(_wireframe);
    }
    return true;
}

void CubeTest::keyEvent(Keyboard::KeyEvent evt, int key)
{
    if (evt == Keyboard::KEY_PRESS)
    {
        switch (key)
        {
            case Keyboard::KEY_W:
                _wDown = true;
                break;
            case Keyboard::KEY_S:
                _sDown = true;
                break;
            case Keyboard::KEY_A:
                _aDown = true;
                break;
            case Keyboard::KEY_D:
                _dDown = true;
                break;
            case Keyboard::KEY_R:
                _rDown = true;
                break;
            case Keyboard::KEY_F:
                _fDown = true;
                break;
            case Keyboard::KEY_CTRL:
                _ctrlDown = true;
                break;
            case Keyboard::KEY_SPACE:
                _wireframe = !_wireframe;
                break;
            case Keyboard::KEY_ESCAPE:
                exit();
                break;
        }
    }
    
    if (evt == Keyboard::KEY_RELEASE ) {
        switch (key) {
            case Keyboard::KEY_W:
                _wDown = false;
                break;
            case Keyboard::KEY_S:
                _sDown = false;
                break;
            case Keyboard::KEY_A:
                _aDown = false;
                break;
            case Keyboard::KEY_D:
                _dDown = false;
                break;
            case Keyboard::KEY_R:
                _rDown = false;
                break;
            case Keyboard::KEY_F:
                _fDown = false;
                break;
            case Keyboard::KEY_CTRL:
                _ctrlDown = false;
                break;
        }
    }
}

void CubeTest::touchEvent(Touch::TouchEvent evt, int x, int y, unsigned int contactIndex)
{
    switch (evt)
    {
        case Touch::TOUCH_PRESS: {
            Rectangle viewport;
            viewport.x = 0;
            viewport.y = 0;
            viewport.width = getWidth();
            viewport.height = getHeight();
            
            Ray touchRay;
            _camera->pickRay( viewport, x, y, &touchRay );
            
            auto bsphere = _scene->findNode("box")->getBoundingSphere();
            if( touchRay.intersects( bsphere ) != Ray::INTERSECTS_NONE ) {
                _wireframe = !_wireframe;
            }
        }   break;
        case Touch::TOUCH_RELEASE:
            break;
        case Touch::TOUCH_MOVE:
            break;
    };
}

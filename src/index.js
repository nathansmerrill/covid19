import p5 from 'p5';

if (module.hot) {
    module.hot.accept(function() {
        window.location.reload();
    });
}

import Sketch from './sketch';

new p5(Sketch);

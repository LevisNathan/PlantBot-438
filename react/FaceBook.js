import * as React from 'react';

export class FaceBook extends React.Component {
    
    render() {
        return(
            <div className="loginprompt">
            <span className="fb-login-button" data-max-rows="1" data-size="xlarge" data-show-faces="false" data-auto-logout-link="true"></span>
            </div>
            );
    }
}






